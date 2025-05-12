import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function Settings() {
    return (
        <>
            <Stack.Screen options={{ title: 'Settings' }} />
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
