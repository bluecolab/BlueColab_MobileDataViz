/** Config for ESLint (linter).
 * 
 * More info: https://docs.expo.dev/guides/using-eslint/
 */ 
module.exports = {
  extends: 'expo',
  ignorePatterns: ['/dist/*','/node_modules/*'],
  env: {
    node: true,
    es2021: true,
  },
  settings: {
    'import/resolver': {
      'babel-module': {
        root: ['./src'], // Should match root as in babel.config.js
      },
    },
  },
};
