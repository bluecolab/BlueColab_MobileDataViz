module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./src'], // Define the root folder for resolving modules
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
          },
        },
      ],
    ],
  };
};
