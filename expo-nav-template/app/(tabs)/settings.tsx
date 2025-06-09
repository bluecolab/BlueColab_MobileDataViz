import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useIsDark } from '@/contexts/ColorSchemeContext';

export default function Settings() {
    const { isDark } = useIsDark();
    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Settings',
                    headerStyle: {
                        backgroundColor: isDark ? '#2e2e3b' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                }}
            />
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
