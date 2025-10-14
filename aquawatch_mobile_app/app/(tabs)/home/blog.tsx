// app/(tabs)/home/blog.tsx
import { Stack } from 'expo-router';
import { Platform, View } from 'react-native';

import CustomWebView from '@/components/CustomWebView';
import CustomWebViewIframe from '@/components/CustomWebView+web';
import { useColorScheme } from '@/contexts/ColorSchemeContext';

/** The blog screen of the app. It loads a web page in a custom WebView component.
 * @returns {JSX.Element}
 */
export default function Blog() {
    const { isDark } = useColorScheme();
    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Blogs',
                    headerStyle: {
                        backgroundColor: isDark ? '#2e2e3b' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                }}
            />
            <View style={{ flex: 1 }}>
                {Platform.OS === 'web' ? (
                    <CustomWebViewIframe uri="https://bluecolab.blogs.pace.edu/blog-app/" />
                ) : (
                    <CustomWebView uri="https://bluecolab.blogs.pace.edu/blog-app/" />
                )}
            </View>
        </>
    );
}
