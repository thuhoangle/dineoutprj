// prettier.config.js
module.exports = {
  semi: true,
  tabWidth: 2,
  printWidth: 120,
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  endOfLine: 'auto',
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '^@/components/(.*)$',
    '^@/hooks/(.*)$',
    '^@/utils/(.*)$',
    '^@/styles/(.*)$',
    '^@/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
