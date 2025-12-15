const { defineConfig } = require('eslint/config');
const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const prettier = require('eslint-config-prettier');
const globals = require('globals');

module.exports = defineConfig([
  js.configs.recommended,
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'examples/**/node_modules/**', 'examples/**/dist/**', '**/*.html'],
  },
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

  // UI components - Browser environment
  {
    files: ['src/ui/**/*.ts', 'src/ui/**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },

  {
    files: ['**/*.d.ts'],
    rules: {
      'no-unused-vars': 'off',
    },
  },

  // Node/CommonJS config files
  {
    files: ['eslint.config.js', 'tsup.config.ts', 'vitest.config.ts'],
    languageOptions: { sourceType: 'commonjs', globals: { ...globals.node } },
  },

  // Examples - Node.js files
  {
    files: ['examples/basic/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
  },

  // Examples - Browser files
  {
    files: ['examples/browser/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        ...globals.browser,
      },
    },
  },

  // Examples - React TypeScript files
  {
    files: ['examples/react-vite/**/*.tsx', 'examples/react-vite/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },

  prettier,
]);
