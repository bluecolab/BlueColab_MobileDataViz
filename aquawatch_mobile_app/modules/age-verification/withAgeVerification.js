/**
 * Expo config plugin for Google Play Age Signals API integration
 * This plugin configures the Android build to include necessary dependencies
 * for accessing age verification data from Google Play
 */

const { withAppBuildGradle, withProjectBuildGradle } = require('@expo/config-plugins');

/**
 * Add Age Signals API dependencies to app/build.gradle
 */
const withAgeVerificationAppGradle = (config) => {
    return withAppBuildGradle(config, (config) => {
        const buildGradle = config.modResults.contents;

        // Check if dependencies are already added
        if (buildGradle.includes('com.google.android.gms:play-services-base')) {
            return config;
        }

        // Add Play Services dependency for Age Signals API
        const dependencyString = `
    // Google Play Age Signals API dependencies
    implementation 'com.google.android.gms:play-services-base:18.5.0'
`;

        // Insert before the closing of dependencies block
        config.modResults.contents = buildGradle.replace(
            /dependencies\s*{/,
            `dependencies {${dependencyString}`
        );

        return config;
    });
};

/**
 * Main plugin function
 */
const withAgeVerification = (config) => {
    config = withAgeVerificationAppGradle(config);
    return config;
};

module.exports = withAgeVerification;
