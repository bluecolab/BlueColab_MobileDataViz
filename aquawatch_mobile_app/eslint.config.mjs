import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactNative from "eslint-plugin-react-native"; // Importing the react-native plugin
import pluginImport from "eslint-plugin-import"; // Importing the import plugin

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    ignores: ["**/*.config.js"],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        browser: true,
      },
    },
    plugins: {
      react: pluginReact,
      "react-native": pluginReactNative,
      import: pluginImport,
    },
    rules: {
      "quotes": ["error", "single"],
      "semi": ["error", "always"],
      "indent": ["error", 2],
      "comma-dangle": ["error", "always-multiline"],
      "no-unused-vars": ["error", { "args": "none" }],
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "arrow-body-style": ["error", "as-needed"],
      "max-len": ["error", { "code": 100 }],
      "no-empty-function": ["error", { "allow": ["arrowFunctions", "functions"] }],
      "no-multiple-empty-lines": ["error", { "max": 1 }],
      "prefer-const": ["error", { "destructuring": "all" }],
      "no-extra-semi": "error",
      "object-curly-spacing": ["error", "always"],
      "no-empty-pattern": "error",
      "func-names": ["error", "always"],
      "prefer-template": "error",
      "no-return-assign": ["error", "always"],
    },
  },
];
