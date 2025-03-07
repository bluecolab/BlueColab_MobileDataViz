import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginReactNative from 'eslint-plugin-react-native';
import pluginImport from 'eslint-plugin-import';
import babelParser from '@babel/eslint-parser'; // Import babel parser

/** @type {import('eslint').Linter.Config[]} */
export default [
    // Apply to JS/JSX files
    {
        files: ['**/*.{js,mjs,cjs,jsx}'],
        ignores: ['node_modules/**', '**/*.config.js'], // Try adding `/**`
        languageOptions: {
            parser: babelParser, // Use babel parser
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true, // Enable JSX support
                },
            },
        },
    },

    // Global configuration for browser environment
    {
        languageOptions: { globals: globals.browser },
    },

    // Recommended configs for JavaScript and React
    pluginJs.configs.recommended,
    pluginReact.configs.flat.recommended,

    //       'no-console': ['warn', { 'allow': ['warn', 'error'] }],

    // Custom configuration
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                browser: true,
            },
        },
        plugins: {
            react: pluginReact,
            'react-native': pluginReactNative,
            import: pluginImport,
        },
        rules: {
            'react-native/no-unused-styles': 2,
            'react-native/split-platform-components': 2,
            'react-native/no-raw-text': 2,
            'react-native/no-single-element-style-arrays': 2,
            'react/prop-types': 'off', // Disables the rule globally
            'import/no-duplicates': 'error',
            'import/named': 'error',
            'import/default': 'error',
            'import/no-named-as-default': 'error',
            'import/no-named-as-default-member': 'error',
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            'indent': ['error', 4],
            'comma-dangle': ['error', 'always-multiline'],
            'no-unused-vars': ['error', { 'args': 'none' }],
            'arrow-body-style': ['error', 'as-needed'],
            'no-empty-function': ['error', { 'allow': ['arrowFunctions', 'functions'] }],
            'no-multiple-empty-lines': ['error', { 'max': 1 }],
            'prefer-const': ['error', { 'destructuring': 'all' }],
            'no-extra-semi': 'error',
            'object-curly-spacing': ['error', 'always'],
            'no-empty-pattern': 'error',
            'func-names': ['error', 'always'],
            'prefer-template': 'error',
            'no-return-assign': ['error', 'always'],
        },
    },
];
