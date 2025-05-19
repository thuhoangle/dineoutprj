// react-internal.js
import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import baseConfig from './base.js';

/** @type {import("eslint").FlatConfig[]} */
export default [
  ...baseConfig,
  js.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
      'unused-imports': pluginUnusedImports,
      'simple-import-sort': pluginSimpleImportSort,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React-related rules
      ...pluginReactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/require-default-props': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'react/jsx-filename-extension': 'off',
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

      // TypeScript-related rules
      '@typescript-eslint/comma-dangle': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/return-await': 'off',
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/indent': 'off',

      // Import & formatting rules
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/extensions': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/prefer-default-export': 'off',

      // Unused imports
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // Other preferences
      'no-underscore-dangle': 'off',
      'no-nested-ternary': 'off',

      // Optional: Prettier-related overlaps
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',

      // Tailwind (if using)
      'tailwindcss/no-custom-classname': 'error',
    },
  },
];
