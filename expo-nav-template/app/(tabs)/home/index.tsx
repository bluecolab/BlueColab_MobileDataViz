// app/(tabs)/home/index.tsx
import React, { useCallback } from 'react';
import { ScrollView, View, FlatList, Text } from 'react-native';
import { useCurrentData } from '@/contexts/CurrentDataContext';
import { useIsDark } from '@/contexts/ColorSchemeContext';

export default function HomeScreen() {
    const { defaultLocation } = useCurrentData();
    const { isDark } = useIsDark();
    console.log('isDark', isDark);

    return (
        <View className="h-full bg-defaultbackground dark:bg-defaultdarkbackground">
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', paddingBottom: 90 }}>

                <Text>Test project to demo the point</Text>
            </ScrollView>
        </View>
    );
}
