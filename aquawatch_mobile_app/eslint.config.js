import pluginImport from 'eslint-plugin-import';
import path from 'path';
import tsParser from '@typescript-eslint/parser';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import tseslint from '@typescript-eslint/eslint-plugin';

export default [
    {
        files: [
            'app/**/*.{js,ts,jsx,tsx}',
            'components/**/*.{js,ts,jsx,tsx}',
            'contexts/**/*.{js,ts,jsx,tsx}',
            'hooks/**/*.{js,ts,jsx,tsx}',
        ],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                ecmaFeatures: { jsx: true },
                project: './tsconfig.json',
            },
        },
        plugins: {
            import: pluginImport,
            '@typescript-eslint': tseslint,
            react: pluginReact,
            'react-hooks': pluginReactHooks,
        },
        settings: {
            react: { version: 'detect' },
            'import/resolver': {
                typescript: {
                    project: path.resolve('./tsconfig.json'),
                },
            },
        },
        rules: {
            // Imports
            'import/no-unresolved': 'error',
            'import/namespace': 'error',
            'import/no-duplicates': 'warn',

            // React
            'react/jsx-key': 'warn',
            'react/no-unstable-nested-components': 'warn',

            // React Hooks
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',

            // TypeScript rules
            '@typescript-eslint/no-unused-vars': 'warn',
            //   '@typescript-eslint/no-floating-promises': 'error',
            //   '@typescript-eslint/explicit-function-return-type': 'warn',
        },
    },
];
