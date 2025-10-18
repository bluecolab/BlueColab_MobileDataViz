// app/_layout.tsx
import '../global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

import ColorSchemeProvider from '@/contexts/ColorSchemeContext';
import CurrentDataProvider from '@/contexts/CurrentDataContext';
import GraphDataProvider from '@/contexts/GraphDataContext';

export const unstable_settings = {
    initialRouteName: '(tabs)',
};

const queryClient = new QueryClient();

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
                        <Stack>
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        </Stack>
                    </ColorSchemeProvider>
                </CurrentDataProvider>
            </GraphDataProvider>
        </QueryClientProvider>
    );
}
