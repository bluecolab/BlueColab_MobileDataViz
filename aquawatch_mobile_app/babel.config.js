module.exports = function (api) {
  api.cache(true);  // Cache for performance
  const plugins = [
    'react-native-reanimated/plugin', // Required for Reanimated 2
    // Uncomment and modify below if you want to use module aliases
    // [
    //   'module-resolver',
    //   {
    //     root: ['./src'],
    //     alias: {
    //       '@components': './src/components',
    //       '@screens': './src/screens',
    //       '@contexts': './src/contexts',
    //       '@hooks': './src/hooks',
    //     },
    //   },
    // ],
  ];

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],  // Expo preset with nativewind for Tailwind-like styling
      'nativewind/babel',  // Required for NativeWind to function
    ],
    plugins,
  };
};
