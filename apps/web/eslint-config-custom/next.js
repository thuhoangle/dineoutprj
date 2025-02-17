const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

module.exports = {
  // Configuration for JavaScript files
  extends: [
    'airbnb-base',
    'next/core-web-vitals', // Needed to avoid warning in next.js build: 'The Next.js plugin was not detected in your ESLint configuration'
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        endOfLine: 'auto',
      },
    ],
  },
  images: {
    domains: ['plus.unsplash.com', 'placebear.com"'],
  },
  overrides: [
    // Configuration for TypeScript files
    {
      files: ['**/*.ts', '**/*.tsx'],
      plugins: [
        '@typescript-eslint',
        'unused-imports',
        'tailwindcss',
        'simple-import-sort',
      ],
      extends: ['plugin:tailwindcss/recommended', 'airbnb-typescript'],
      parserOptions: {
        project,
      },
      rules: {
        'prettier/prettier': [
          'error',
          {
            singleQuote: true,
            endOfLine: 'auto',
            printWidth: 120,
          },
        ],
        'react/destructuring-assignment': 'off', // Vscode doesn't support automatically destructuring, it's a pain to add a new variable
        'jsx-a11y/anchor-is-valid': 'off', // Next.js use his own internal link system
        'react/require-default-props': 'off', // Allow non-defined react props as undefined
        'react/jsx-props-no-spreading': 'off', // _app.tsx uses spread operator and also, react-hook-form
        'react-hooks/exhaustive-deps': 'off', // Incorrectly report needed dependency with Next.js router
        '@next/next/no-img-element': 'off', // We currently not using next/image because it isn't supported with SSG mode
        '@typescript-eslint/comma-dangle': 'off', // Avoid conflict rule between Eslint and Prettier
        '@typescript-eslint/consistent-type-imports': 'error', // Ensure `import type` is used when it's necessary
        'import/prefer-default-export': 'off', // Named export is easier to refactor automatically
        'simple-import-sort/imports': 'error', // Import configuration for `eslint-plugin-simple-import-sort`
        'simple-import-sort/exports': 'error', // Export configuration for `eslint-plugin-simple-import-sort`
        '@typescript-eslint/no-unused-vars': 'off',
        'unused-imports/no-unused-imports': 'error',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/naming-convention': 'off',
        'no-underscore-dangle': 'off',
        'unused-imports/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/return-await': 'off',
        'no-nested-ternary': 'off',
        '@typescript-eslint/no-shadow': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'import/extensions': 'off',
        'import/no-extraneous-dependencies': 'off',
        '@typescript-eslint/indent': 'off',
        'no-restricted-globals': 'off',
        'react/jsx-curly-brace-presence': 'error',
        'tailwindcss/no-custom-classname': [
          'error',
          {
            whitelist: ['bsx-group/tooltip'],
          },
        ],
        'react/jsx-sort-props': [
          'error',
          {
            callbacksLast: true,
            shorthandFirst: false,
            shorthandLast: true,
            multiline: 'last',
            ignoreCase: true,
            noSortAlphabetically: false,
            reservedFirst: false,
          },
        ],
      },
      settings: {
        tailwindcss: {
          config: resolve(
            process.cwd(),
            'packages/tailwind-config/tailwind.config.ts'
          ),
        },
      },
    },
    // Configuration for testing
    {
      files: ['**/*.test.ts', '**/*.test.tsx'],
      plugins: ['jest', 'jest-formatting', 'testing-library', 'jest-dom'],
      extends: [
        'plugin:jest/recommended',
        'plugin:jest-formatting/recommended',
        'plugin:testing-library/react',
        'plugin:jest-dom/recommended',
      ],
    },
    // Configuration for e2e testing (Cypress)
    // {
    //   files: ["**/*.cy.ts"],
    //   plugins: ["cypress"],
    //   extends: ["plugin:cypress/recommended"],
    //   parserOptions: {
    //     project: "./cypress/tsconfig.json",
    //   },
    // },
  ],
};
