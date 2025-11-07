// app/(tabs)/center.tsx
// Placeholder for the center tab. We never navigate to this screen directly.
// The tab icon's onPress pushes to /liveData (a Stack screen) to get smooth animations.
import { Stack } from 'expo-router';

export default function CenterTabPlaceholder() {
    return <Stack.Screen options={{ headerShown: false }} />;
}
