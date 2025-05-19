import pluginNext from '@next/eslint-plugin-next';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

import baseConfig from './base.js';

/** @type {import("eslint").FlatConfig[]} */
export default [
  ...baseConfig,
  {
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      '@next/next': pluginNext,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
    languageOptions: {
      globals: {
        ...globals.serviceworker,
      },
    },
  },
];
