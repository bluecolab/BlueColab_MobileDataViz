const { withAndroidStyles } = require('@expo/config-plugins');

/**
 * Remove deprecated edge-to-edge API usage for Android 15+ compatibility
 * This plugin removes android:statusBarColor from the app theme to comply with
 * Google Play Console warnings about deprecated edge-to-edge APIs.
 */
const withAndroidEdgeToEdge = (config) => {
    return withAndroidStyles(config, (config) => {
        const styles = config.modResults;

        // Find the AppTheme style
        if (!styles?.resources?.style) {
            return config;
        }

        const appThemeIndex = styles.resources.style.findIndex(
            (style) => style.$.name === 'AppTheme'
        );

        if (appThemeIndex !== -1) {
            const appTheme = styles.resources.style[appThemeIndex];

            // Remove deprecated edge-to-edge color properties
            if (appTheme.item) {
                appTheme.item = appTheme.item.filter(
                    (item) =>
                        item.$?.name !== 'android:statusBarColor' &&
                        item.$?.name !== 'android:navigationBarColor'
                );
            }
        }

        return config;
    });
};

module.exports = withAndroidEdgeToEdge;
