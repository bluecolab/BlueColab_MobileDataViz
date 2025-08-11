import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { StyleSheet } from 'react-native';

export function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={28} style={styles.tabBarIcon} {...props} />;
}

export const styles = StyleSheet.create({
    tabBarIcon: {
        marginBottom: -3,
    },
});
