// app/(tabs)/home/_layout.tsx
import { Stack } from 'expo-router';

export const unstable_settings = {
    initialRouteName: 'index',
};

/** The layout of the home screen. It contains the stack navigator for the home screen.
 * @returns {JSX.Element}
 */
export default function HomeStackLayout() {
    return <Stack />;
}
