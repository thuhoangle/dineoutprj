const pluginReactHooks = require('eslint-plugin-react-hooks');
const pluginReact = require('eslint-plugin-react');
const globals = require('globals');
const pluginNext = require('@next/eslint-plugin-next');
const { config: baseConfig } = require('./base.js');

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config}
 */
const nextJsConfig = {
  ...baseConfig,
  extends: [
    ...baseConfig.extends,
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@next/next/recommended',
    'plugin:@next/next/core-web-vitals',
  ],
  plugins: [...baseConfig.plugins, 'react', 'react-hooks', '@next/next'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    ...baseConfig.rules,
    'react/react-in-jsx-scope': 'off',
  },
  globals: {
    ...globals.serviceworker,
  },
};

module.exports = nextJsConfig;
