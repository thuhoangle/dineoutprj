module.exports = {
  root: true,
  extends: ['@repo/eslint-config/next-js'],
  rules: {
    '@next/next/no-html-link-for-pages': ['error', 'apps/www/src/pages/'],
  },
};
