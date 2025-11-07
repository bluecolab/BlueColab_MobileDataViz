// app/(tabs)/liveData.tsx
// Stub screen used only to host the center tab button UI. We always push to the
// real screen at /currentData via the tab icon's onPress.
import { Stack } from 'expo-router';

export default function LiveDataTab() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
        </>
    );
}
