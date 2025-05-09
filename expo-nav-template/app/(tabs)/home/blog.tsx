// app/(tabs)/home/blog.tsx
import { Stack } from 'expo-router';
import { View } from 'react-native';

import CustomWebView from '@/components/CustomWebView';

/**
 * @returns {JSX.Element}
 * @description The blog screen of the app. It loads a web page in a custom WebView component.
 */
export default function Blog() {
    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Blogs',
                }}
            />
            <View style={{ flex: 1 }}>
                <CustomWebView uri="https://bluecolab.blogs.pace.edu/blog-app/" />
            </View>
        </>
    );
}
