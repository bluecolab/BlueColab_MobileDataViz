import { Stack } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';

import { Widget } from '@/components/visualizations/Widget';
import { WQICard } from '@/components/visualizations/WQI/WQICard';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useCurrentData } from '@/contexts/CurrentDataContext';
import { useGraphData } from '@/contexts/GraphDataContext';
import { config } from '@/hooks/useConfig';
import { extractLastData } from '@/utils/extractLastData';

export default function CurrentData() {
    const { isDark } = useColorScheme();
    const { data, airData, defaultLocation, defaultTempUnit, loadingCurrent, error } =
        useCurrentData();

    const { showConvertedUnits: showConvertedUnitsGlobal } = useGraphData();

    const lastDataPoint = extractLastData(
        data,
        airData,
        defaultLocation,
        defaultTempUnit,
        loadingCurrent,
        error,
        showConvertedUnitsGlobal
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
                }}
            />
            <ScrollView className="h-full bg-defaultbackground dark:bg-defaultdarkbackground">
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
                {config.BLUE_COLAB_API_CONFIG.validMatches.some(
                    (loc) => loc.name === defaultLocation?.name
                ) ? (
                    <View className="mb-12 mt-6 items-center px-4">
                        <WQICard loading={false} data={[]} wqi={lastDataPoint.wqi} />
                    </View>
                ) : (
                    <></>
                )}
            </ScrollView>
        </>
    );
}
