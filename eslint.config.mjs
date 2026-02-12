import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import promise from 'eslint-plugin-promise';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: ['lib/**', 'docs/**', 'docusaurus/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      prettier,
      promise,
      '@typescript-eslint': tseslint.plugin,
      import: importPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': ['error'],

      'newline-before-return': 'error',
      'no-async-promise-executor': 'error',
      'no-promise-executor-return': 'error',
      'no-useless-catch': 'error',
      'no-underscore-dangle': [
        'error',
        { allowAfterThis: true, allowAfterSuper: true },
      ],
      'no-unused-vars': 'off',
      'no-redeclare': 'off',
      'no-console': 'warn',
      'no-param-reassign': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'prefer-template': 'error',
      'dot-notation': 'error',
      'prefer-destructuring': 'off',

      'promise/always-return': 'off',
      'promise/catch-or-return': 'error',

      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',

      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '*.scss',
              group: 'index',
              patternOptions: { matchBase: true },
              position: 'after',
            },
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-unresolved': 'off',
      'import/no-duplicates': 'error',
      'import/no-unused-modules': 'off',
      'import/no-cycle': ['error', { maxDepth: 1 }],
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': [
        'error',
        {
          noUselessIndex: true,
        },
      ],
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-absolute-path': 'error',
      'import/no-relative-packages': 'error',
    },
  },
  {
    files: ['stories/**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    rules: {
      'no-console': 'off',
    },
  },
]);
