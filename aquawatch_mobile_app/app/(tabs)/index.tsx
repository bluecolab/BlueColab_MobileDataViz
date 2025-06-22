// app/(tabs)/index.tsx
import { Redirect } from 'expo-router';

/**
 * @returns {JSX.Element}
 * @description The default tab screen of the app. It redirects to screen in /home.
 */
export default function TabsIndex() {
    // Redirect to the home screen of the app
    return <Redirect href="/home" />;
}
