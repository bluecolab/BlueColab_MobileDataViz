// app/(tabs)/home/_layout.tsx
import { Stack } from 'expo-router';

export default function HomeStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home Page' }} />
      {/* <Stack.Screen name="[itemId]" options={{ title: 'Item Details' }} /> */}
    </Stack>
  );
}
