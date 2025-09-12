// app/_layout.tsx
import '../global.css';

import { Stack } from 'expo-router';

import ColorSchemeProvider from '@/contexts/ColorSchemeContext';
import CurrentDataProvider from '@/contexts/CurrentDataContext';
import GraphDataProvider from '@/contexts/GraphDataContext';

export const unstable_settings = {
    initialRouteName: '(tabs)',
};

/** The root layout of the app. It wraps the app in the necessary providers.
 * @returns {JSX.Element}
 */
export default function RootLayout() {
    return (
        <GraphDataProvider>
            <CurrentDataProvider>
                <ColorSchemeProvider>
                    <Stack>
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    </Stack>
                </ColorSchemeProvider>
            </CurrentDataProvider>
        </GraphDataProvider>
    );
}
