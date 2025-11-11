const { defineConfig } = require('eslint/config');
const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const prettier = require('eslint-config-prettier');
const globals = require('globals');

module.exports = defineConfig([
  js.configs.recommended,
  { ignores: ['dist/**', 'node_modules/**'] },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      globals: {
        process: 'readonly',
      },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // Test files (Vitest) globals
  {
    files: ['**/*.test.ts', 'tests/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.vitest,
        ...globals.node,
        require: 'readonly',
        Response: 'readonly',
        RequestInit: 'readonly',
        URL: 'readonly',
      },
    },
  },

  // Node/CommonJS config files
  {
    files: ['eslint.config.js', 'tsup.config.ts', 'vitest.config.ts'],
    languageOptions: { sourceType: 'commonjs', globals: { ...globals.node } },
  },

  prettier,
]);
