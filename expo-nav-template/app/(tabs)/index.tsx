// app/(tabs)/index.tsx
import { Redirect } from 'expo-router';

export default function TabsIndex() {
  // Redirect to the desired default tab
  return <Redirect href="/home" />;
}
