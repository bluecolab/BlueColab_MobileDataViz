/** Config file for Babel (compiler).
 * 
 * Uses:
 *  - Set up presets (ex. needed when adding nativewind)
 *  - Set up plugins 
 *      - If you want to do @ imports like it's done for 
 *        components you would add them below.
 * 
 * More info: https://docs.expo.dev/versions/latest/config/babel/
 */
module.exports = function(api) {
    api.cache(true);
    return {
        presets: [
            ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
            'nativewind/babel',
        ],
        plugins: [
            'react-native-reanimated/plugin',
            [
                'module-resolver',
                {
                    root: ['./src'],
                    alias: {
                        '@components': './src/components',
                        '@screens': './src/screens',
                        '@contexts': './src/contexts',
                        '@hooks': './src/hooks',
                    },
                },
            ],
        ],
    };
};
