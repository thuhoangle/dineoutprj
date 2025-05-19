import onlyWarn from 'eslint-plugin-only-warn';
import turboPlugin from 'eslint-plugin-turbo';
import tseslint from 'typescript-eslint';

/** @type {import("eslint").FlatConfig[]} */
export default [
  ...tseslint.configs.recommended,
  {
    plugins: {
      onlyWarn,
      turbo: turboPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react/no-unescaped-entities': 'off',
      'no-extra-boolean-cast': 'off',
    },
    ignores: ['dist/**'],
  },
];
