// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser', // Use the TypeScript parser
  parserOptions: {
    project: './tsconfig.json', // Ensure ESLint uses your tsconfig.json
    tsconfigRootDir: __dirname, // Path to your root directory
  },
  ignorePatterns: ['/dist/*','*.config.js','*.config.ts','.eslintrc.js','node_modules/*'],
  env: {
    node: true,
    es2021: true,
  },
  settings: {
    'import/resolver': {
      'babel-module': {
        root: ['./src'], // Same root as in your babel.config.js
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@contexts': './src/contexts',
          '@hooks': './src/hooks',
        },
      },
      typescript: {
        alwaysTryTypes: true, // Try to resolve types under <root>@types
      },
    },
  },
  rules: {
    // You can add any additional rules you want here
  },
};
