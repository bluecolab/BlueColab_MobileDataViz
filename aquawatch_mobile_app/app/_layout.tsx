// app/_layout.tsx
import '../global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

import ColorSchemeProvider, { useColorScheme } from '@/contexts/ColorSchemeContext';
import CurrentDataProvider from '@/contexts/CurrentDataContext';
import GraphDataProvider from '@/contexts/GraphDataContext';

export const unstable_settings = {
    initialRouteName: 'home',
};

/** The root layout of the app. It wraps the app in the necessary providers.
 * @returns {JSX.Element}
 */
// Initialize Query Client once (module scope to preserve across re-renders)
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Avoid refetching on every screen focus unless desired
            refetchOnWindowFocus: true,
            staleTime: 1000 * 60, // 1 minute by default; screen-level queries can override
        },
    },
});

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <GraphDataProvider>
                <CurrentDataProvider>
                    <ColorSchemeProvider>
                        <InnerStack />
                    </ColorSchemeProvider>
                </CurrentDataProvider>
            </GraphDataProvider>
        </QueryClientProvider>
    );
}

function InnerStack() {
    const { isDark } = useColorScheme();

    return (
        <Stack
            screenOptions={{
                contentStyle: { backgroundColor: isDark ? '#1a202c' : '#f1f1f1' },
            }}>
            <Stack.Screen name="home" options={{ headerShown: false }} />
        </Stack>
    );
}
