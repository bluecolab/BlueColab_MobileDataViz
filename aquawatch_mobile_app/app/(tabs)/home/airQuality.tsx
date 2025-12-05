import { Stack } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';

import { Widget, SENSOR_MAP } from '@/components/visualizations/Widget';
import PolarChart from '@/components/visualizations/WQI/PolarChart';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useCurrentData } from '@/contexts/CurrentDataContext';

export default function CurrentData() {
    const { isDark } = useColorScheme();
    const { aqiData, defaultLocation, error } = useCurrentData();

    // Use US EPA AQI
    const usAQI = aqiData?.usAQI;
    const aqi = usAQI?.aqi;
    const category = usAQI?.category;
    const dominantPollutant = usAQI?.dominantPollutant;

    // Calculate percent for PolarChart (0-500 scale, where lower is better)
    const percent = aqi !== undefined ? Math.max(0, Math.min(100, ((500 - aqi) / 500) * 100)) : 0;

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
                        {defaultLocation?.name} AQI Data
                    </Text>
                </View>

                {error && (
                    <View>
                        <Text className="text-center text-xl font-bold dark:text-white">
                            {error.message}
                        </Text>
                    </View>
                )}

                {/* US EPA AQI Display */}
                {aqiData && aqi !== undefined && (
                    <View className="items-center px-4 py-4">
                        <View className="h-[200] w-[200]">
                            <View className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                                <Text className="text-center text-4xl font-bold dark:text-white">
                                    {aqi}
                                </Text>
                                <Text className="text-md text-center font-semibold dark:text-white">
                                    {category}
                                </Text>
                            </View>
                            <PolarChart percent={Math.round(percent)} isDark={isDark} />
                        </View>
                        <Text className="mt-2 text-center text-sm dark:text-white">
                            US EPA Air Quality Index
                        </Text>
                        {dominantPollutant && (
                            <Text className="text-center text-sm text-gray-500 dark:text-gray-400">
                                Dominant Pollutant: {dominantPollutant}
                            </Text>
                        )}
                    </View>
                )}

                <View className="flex flex-row flex-wrap">
                    {aqiData && (
                        <>
                            {Object.entries(aqiData.list[0].components).map(([key, value]) => {
                                // Use the map to get the correct widget name
                                const widgetName = SENSOR_MAP[key];

                                if (widgetName) {
                                    return <Widget key={key} name={widgetName} value={value} />;
                                }

                                return null;
                            })}
                        </>
                    )}
                </View>
            </ScrollView>
        </>
    );
}
