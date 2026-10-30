import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const PIN_PREFIX = /^[~^]/;
const DEPENDENCY_KEYS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
const ENTRIES_TO_EXCLUDE = ['node_modules', '.git'];

/**
 * Lists every package.json under a directory, skipping `node_modules` and `.git`.
 *
 * @param {string} directory
 * @returns {string[]}
 */
const findPackageJsons = (directory) =>
  readdirSync(directory, { withFileTypes: true })
    .filter((entry) => !ENTRIES_TO_EXCLUDE.includes(entry.name))
    .flatMap((entry) => {
      const fullPath = join(directory, entry.name);
      if (entry.isDirectory()) {
        return findPackageJsons(fullPath);
      }
      return entry.name === 'package.json' ? [fullPath] : [];
    });

/**
 * Returns one line per `^`/`~` range in a package.json, except the peerDependencies of a package
 * that declares `"private": false`, since a peer is a range of versions consumers may install.
 *
 * @param {string} packageJsonFilename
 * @param {Record<string, unknown>} packageJsonContents
 * @returns {string[]}
 */
const findPinViolations = (packageJsonFilename, packageJsonContents) => {
  const isInstalledByConsumers = packageJsonContents.private === false;
  return DEPENDENCY_KEYS.filter((key) => !(key === 'peerDependencies' && isInstalledByConsumers)).flatMap((key) => {
    const dependencies = packageJsonContents[key];
    if (!dependencies || typeof dependencies !== 'object') {
      return [];
    }
    return Object.entries(dependencies)
      .filter(([, range]) => PIN_PREFIX.test(range))
      .map(([name, range]) => `${packageJsonFilename}: ${name} → ${range}`);
  });
};

const violations = findPackageJsons('.').flatMap((packageJsonFilename) => {
  try {
    return findPinViolations(packageJsonFilename, JSON.parse(readFileSync(packageJsonFilename, 'utf8')));
  } catch (error) {
    console.log(`::warning file=${packageJsonFilename}::Skipping unreadable package.json: ${error.message}`);
    return [];
  }
});

if (violations.length > 0) {
  console.log('::error::Exact-version pinning violated. Replace ^/~ prefixes with the exact version (use lockfile-resolved values):');
  for (const violation of violations) {
    console.log(violation);
  }
  console.log('');
  console.log('===== HOW TO FIX =====');
  console.log("Run `pnpm install` locally, look up each offending package's");
  console.log('resolved version in pnpm-lock.yaml, and replace the ^/~ prefix');
  console.log("with that exact version. Overrides in pnpm-workspace.yaml's");
  console.log('overrides: block keep their ^ – those are intentional for');
  console.log('security-patch flow and are excluded from this check.');
  console.log('====================');
  process.exit(1);
}
