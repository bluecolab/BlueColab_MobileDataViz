import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';

export default function Settings() {
    return (
        <>
            <Stack.Screen options={{ title: 'Settings' }} />
            <View style={styles.container}>
                <ScreenContent path="app/(tabs)/two.tsx" title="Settings" />
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
