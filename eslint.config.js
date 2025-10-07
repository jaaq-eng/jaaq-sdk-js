const { defineConfig } = require('eslint/config');
const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const prettier = require('eslint-config-prettier');

module.exports = defineConfig([
  js.configs.recommended,
  // Ignore build artifacts and dependencies
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  // TypeScript parsing support (no stylistic rules)
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
    },
  },
  // Disable ESLint formatting rules that conflict with Prettier
  prettier,
]);
