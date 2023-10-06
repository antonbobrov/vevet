/** @type{import("eslint").Linter.Config} */
module.exports = {
  extends: [
    '@anton.bobrov/eslint-config/react',
    'plugin:storybook/recommended',
  ],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  ignorePatterns: ['lib/**', 'build/**'],
  rules: {
    'class-methods-use-this': 'off',
    'import/extensions': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      { selector: 'typeAlias', format: ['PascalCase'], prefix: ['T'] },
      {
        selector: 'interface',
        format: ['PascalCase'],
        prefix: ['I'],
        filter: {
          regex: '^(Window)$',
          match: false,
        },
      },
      { selector: 'enum', format: ['PascalCase'], prefix: ['E'] },
      {
        selector: ['variable', 'function', 'parameter'],
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
      },
      {
        selector: ['variable'],
        types: ['boolean'],
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        prefix: [
          'is',
          'IS',
          'Is',
          'has',
          'HAS',
          'Has',
          'can',
          'CAN',
          'Can',
          'should',
          'SHOULD',
          'Should',
          'will',
          'WILL',
          'Will',
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['**/stories/*.ts', '**/stories/*.tsx'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};
