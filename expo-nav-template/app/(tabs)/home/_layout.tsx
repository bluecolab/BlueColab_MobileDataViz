// app/(tabs)/home/_layout.tsx
import { Stack } from 'expo-router';

export const unstable_settings = {
    initialRouteName: 'index',
};

/**
 * @returns {JSX.Element}
 * @description The layout of the home screen. It contains the stack navigator for the home screen.
 */
export default function HomeStackLayout() {
    // /* <Stack.Screen name="index" options={{ title: 'Home Page' }} /> */

    /* <Stack.Screen name="[itemId]" options={{ title: 'Item Details' }} /> */

    return <Stack />;
}
