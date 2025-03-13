// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: 'expo',
  ignorePatterns: ['/dist/*'],
  env: {
    node: true,
    es2021: true,
  },
  settings: {
    'import/resolver': {
      'babel-module': {
        root: ['./src'], // Same root as in your babel.config.js
      },
    },
  },
};
