import { Stack } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';

import { Widget } from '@/components/visualizations/Widget';
import { WQICard } from '@/components/visualizations/WQI/WQICard';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useCurrentData } from '@/contexts/CurrentDataContext';
import { extractLastData } from '@/utils/extractLastData';

export default function WaterReports() {
    const { isDark } = useColorScheme();
    const { data, defaultLocation, defaultTempUnit, loadingCurrent, error } = useCurrentData();

    const lastDataPoint = extractLastData(
        data,
        defaultLocation,
        defaultTempUnit,
        loadingCurrent,
        error
    );

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Water Reports',
                    headerStyle: {
                        backgroundColor: isDark ? '#2e2e3b' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                }}
            />
            <ScrollView className="h-full bg-defaultbackground dark:bg-defaultdarkbackground">
                {/* — Title — */}
            </ScrollView>
        </>
    );
}
