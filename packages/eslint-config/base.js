const js = require('@eslint/js');
const eslintConfigPrettier = require('eslint-config-prettier');
const turboPlugin = require('eslint-plugin-turbo');
const tseslint = require('typescript-eslint');
const onlyWarn = require('eslint-plugin-only-warn');

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 */
const config = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['turbo', 'only-warn'],
  rules: {
    'turbo/no-undeclared-env-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react/no-unescaped-entities': 'off',
    'no-extra-boolean-cast': 'off',
  },
  ignorePatterns: ['dist/**'],
};

module.exports = { config };
