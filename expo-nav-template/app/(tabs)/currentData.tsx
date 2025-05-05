import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';

export default function CurrentData() {
    return (
        <>
            <Stack.Screen options={{ title: 'Current Data' }} />
            <View style={styles.container}>
                <ScreenContent path="app/(tabs)/feed.tsx" title="Tab One" />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
});
