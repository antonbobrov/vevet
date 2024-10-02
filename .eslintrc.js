/** @type{import("eslint").Linter.Config} */
module.exports = {
  extends: [
    '@anton.bobrov/eslint-config/react',
    'plugin:storybook/recommended',
  ],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  ignorePatterns: ['lib/**', 'docs/**'],
  rules: {
    'class-methods-use-this': 'off',
    'import/extensions': 'off',
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
