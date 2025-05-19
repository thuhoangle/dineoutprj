import turboPlugin from 'eslint-plugin-turbo';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'error',
    },
  },
  ...(await import('./apps/web/eslint.config.mjs')).default,
];
