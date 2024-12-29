const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'next/typescript',
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'custom/next',
  ],
  rules: {
    '@next/next/no-html-link-for-pages': ['error', 'apps/www/src/pages/'],
    'no-bitwise': 'off',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
      typescript: {},
    },
  },
  eslintPluginPrettierRecommended,
};
