// app/(tabs)/home/blog.tsx
import { Stack } from 'expo-router';
import { View } from 'react-native';

import CustomWebView from '@/components/CustomWebView';
import { useColorScheme } from '@/contexts/ColorSchemeContext';

/**
 * @returns {JSX.Element}
 * @description The blog screen of the app. It loads a web page in a custom WebView component.
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
                <CustomWebView uri="https://bluecolab.blogs.pace.edu/blog-app/" />
            </View>
        </>
    );
}
