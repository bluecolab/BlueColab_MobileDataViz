/** Config file for Metro (Bundler).
 * 
 * More info: https://docs.expo.dev/versions/latest/config/metro/
 */
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });