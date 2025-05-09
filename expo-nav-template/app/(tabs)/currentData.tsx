import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function CurrentData() {
    return (
        <>
            <Stack.Screen options={{ title: 'Current Data' }} />
            <View style={styles.container} />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
});
