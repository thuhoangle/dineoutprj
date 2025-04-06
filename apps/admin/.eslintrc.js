module.exports = {
  root: true,
  extends: ['custom/next'],
  rules: {
    '@next/next/no-html-link-for-pages': ['error', 'apps/www/src/pages/'],
  },
};
