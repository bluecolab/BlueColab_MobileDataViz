// app/(tabs)/index.tsx
import { Redirect } from 'expo-router';

/** The default tab screen of the app. It redirects to screen in /home.
 * @returns {JSX.Element}
 */
export default function TabsIndex() {
    // Redirect to the home screen of the app
    return <Redirect href="/home" />;
}
