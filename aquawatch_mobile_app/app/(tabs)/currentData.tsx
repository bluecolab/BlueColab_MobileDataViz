import { Stack } from 'expo-router';
import { useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';

import { Widget } from '@/components/visualizations/Widget';
import { WQICard } from '@/components/visualizations/WQI/WQICard';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useCurrentData } from '@/contexts/CurrentDataContext';
import { useGraphData } from '@/contexts/GraphDataContext';
import { extractLastData } from '@/utils/extractLastData';

// Stable header refresh button component (defined outside render to satisfy lint rules)
function HeaderRefreshButton({ onPress, color }: { onPress: () => void; color: string }) {
    return (
        <TouchableOpacity onPress={onPress} accessibilityLabel="Refresh data">
            <Text style={{ color }}>Refresh</Text>
        </TouchableOpacity>
    );
}

export default function CurrentData() {
    const { isDark } = useColorScheme();
    const { data, defaultLocation, defaultTempUnit, loadingCurrent, error, refetchCurrent } =
        useCurrentData();

    const { showConvertedUnits: showConvertedUnitsGlobal } = useGraphData();

    const lastDataPoint = extractLastData(
        data,
        defaultLocation,
        defaultTempUnit,
        loadingCurrent,
        error,
        showConvertedUnitsGlobal
    );

    const headerRight = useCallback(
        () => <HeaderRefreshButton onPress={refetchCurrent} color={isDark ? 'white' : 'black'} />,
        [refetchCurrent, isDark]
    );

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Current Data',
                    headerStyle: {
                        backgroundColor: isDark ? '#2e2e3b' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                    headerRight,
                }}
            />
            <ScrollView
                className="h-full bg-defaultbackground dark:bg-defaultdarkbackground"
                refreshControl={
                    <RefreshControl
                        refreshing={loadingCurrent}
                        onRefresh={refetchCurrent}
                        tintColor={isDark ? 'white' : 'black'}
                    />
                }>
                {/* — Title — */}
                <View>
                    <Text className="mt-7 text-center text-2xl font-bold dark:text-white">
                        {defaultLocation?.name} Data
                    </Text>
                </View>

                {error && (
                    <View>
                        <Text className="text-center text-xl font-bold dark:text-white">
                            {error.message}
                        </Text>
                    </View>
                )}

                {/* — The 6 Widgets — */}
                <View className="flex flex-row flex-wrap">
                    <Widget name="Water Temperature" value={lastDataPoint.temp} />
                    <Widget name="Conductivity" value={lastDataPoint.cond} />
                    <Widget name="Salinity" value={lastDataPoint.sal} />
                    <Widget name="pH" value={lastDataPoint.pH} />
                    <Widget name="Turbidity" value={lastDataPoint.turb} />
                    <Widget name="Oxygen" value={lastDataPoint.do} />
                </View>

                {/* — Current‐Data WQI Gauge — */}
                <View className="mt-6 items-center px-4">
                    <WQICard loading={false} data={[]} wqi={lastDataPoint.wqi} />
                </View>
                <View className="pb-[25]">
                    <Text></Text>
                </View>
            </ScrollView>
        </>
    );
}
