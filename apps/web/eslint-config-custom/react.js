const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
  // Configuration for JavaScript files
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        singleQuote: true,
        endOfLine: "auto",
      },
    ],
  },
  overrides: [
    // Configuration for TypeScript files
    {
      files: ["**/*.ts", "**/*.tsx"],
      plugins: ["@typescript-eslint", "unused-imports", "tailwindcss", "simple-import-sort"],
      extends: ["plugin:tailwindcss/recommended", "airbnb-typescript"],
      parserOptions: {
        project,
      },
      rules: {
        "prettier/prettier": [
          "error",
          {
            singleQuote: true,
            endOfLine: "auto",
            printWidth: 120,
          },
        ],
        "react/destructuring-assignment": "off", // Vscode doesn't support automatically destructuring, it's a pain to add a new variable
        "react/require-default-props": "off", // Allow non-defined react props as undefined
        "react/jsx-props-no-spreading": "off", // _app.tsx uses spread operator and also, react-hook-form
        "react-hooks/exhaustive-deps": "off", // Incorrectly report needed dependency with Next.js router
        "@typescript-eslint/comma-dangle": "off", // Avoid conflict rule between Eslint and Prettier
        "@typescript-eslint/consistent-type-imports": "error", // Ensure `import type` is used when it's necessary
        "import/prefer-default-export": "off", // Named export is easier to refactor automatically
        "simple-import-sort/imports": "error", // Import configuration for `eslint-plugin-simple-import-sort`
        "simple-import-sort/exports": "error", // Export configuration for `eslint-plugin-simple-import-sort`
        "@typescript-eslint/no-unused-vars": "off",
        "unused-imports/no-unused-imports": "error",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/naming-convention": "off",
        "no-underscore-dangle": "off",
        "unused-imports/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "@typescript-eslint/return-await": "off",
        "no-nested-ternary": "off",
        "@typescript-eslint/no-shadow": "off",
        "@typescript-eslint/no-empty-function": "off",
        "import/extensions": "off",
        "import/no-extraneous-dependencies": "off",
        "@typescript-eslint/indent": "off",
        "react/jsx-filename-extension": "off",
      },
      settings: {
        tailwindcss: {
          config: resolve(process.cwd(), "packages/tailwind-config/tailwind.config.ts"),
        },
      },
    },
  ],
};
