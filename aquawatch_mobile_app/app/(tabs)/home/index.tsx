import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import MyChart from '@/components/MyChart'; // Adjust the import path as necessary

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
      <MyChart />
      {/* <Button title="Go to Details" onPress={() => router.push('/(tabs)/home/details')} /> */}
    </View>
  );
}
