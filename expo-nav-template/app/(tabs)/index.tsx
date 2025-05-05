// app/(tabs)/index.tsx
import { Redirect } from 'expo-router';

export default function TabsIndex() {
    // Redirect to the home screen of the app
    return <Redirect href="/home" />;
}
