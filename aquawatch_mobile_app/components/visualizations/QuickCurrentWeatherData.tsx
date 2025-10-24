// /components/QuickCurrentData.tsx
import { differenceInSeconds } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';

import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useCurrentData } from '@/contexts/CurrentDataContext';
import { config } from '@/hooks/useConfig';

import PolarChart from './WQI/PolarChart';

/** The timer component that displays the time since the last data point was received.
 * @param timestamp - The timestamp for the data point
 * @returns {JSX.Element}
 */
const Timer = ({ timestamp }: { timestamp: string }) => {
    const [minutes, setMinutes] = useState<number>();
    useEffect(() => {
        const intervalId = setInterval(() => {
            const currentTime = new Date();
            const timestampDateTime = timestamp === 'Loading' ? new Date() : new Date(timestamp);

            if (!isNaN(timestampDateTime.getTime())) {
                const diffInSeconds = differenceInSeconds(currentTime, timestampDateTime);
                setMinutes(diffInSeconds);
            } else {
                setMinutes(-999999);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timestamp]);

    return (
        <View>
            <Text className="text-md py-4 text-center text-white">
                As of{' '}
                {minutes && minutes !== -999999
                    ? `${String(Math.floor(minutes / 60))} minute(s) ago`
                    : 'Loading...'}
            </Text>
        </View>
    );
};

/**
 * The quick current data component. It displays the current data in a quick grid-view format.
 * @returns {JSX.Element}
 */
// Removed duplicate export default function QuickCurrentData()
export default function QuickCurrentWeatherData() {
    const { isDark } = useColorScheme();
    const { aqiData, defaultLocation, error } = useCurrentData();

    const aqi = aqiData?.list[0].main.aqi;
    const timestamp = aqiData?.list[0].dt;

    if (!defaultLocation || !aqi || !timestamp) {
        return <></>;
    }

    const categories = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];

    const percent = ((5 - aqi) / 4) * 100;
    const selectedCat = categories[aqi - 1];

    return (
        <Pressable
            onPress={() => {
                {
                    config.BLUE_COLAB_API_CONFIG.validMatches.some(
                        (loc) => loc.name === defaultLocation.name
                    )
                        ? router.push('/(tabs)/home/odinData')
                        : router.push('/(tabs)/home/airQuality');
                }
            }}>
            <View className="px-4 pt-4">
                <LinearGradient
                    colors={
                        error
                            ? ['#ff2929', '#ffa8a8']
                            : isDark
                              ? ['#374151', '#374151']
                              : ['#fff', '#fff']
                    }
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={{
                        paddingTop: 4,
                        alignItems: 'center',
                        borderRadius: 20,
                    }}>
                    <View>
                        <Text className="text-center text-2xl font-bold text-white">
                            Live AQI Quick Look
                        </Text>
                    </View>

                    {error && (
                        <View>
                            <Text className="text-center text-xl font-bold text-white">
                                {error.message}
                            </Text>
                        </View>
                    )}

                    <View className="flex flex-row flex-wrap items-center justify-center gap-4 pt-4">
                        <View className="h-[200] w-[200]">
                            <View className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                                <>
                                    <Text className="text-center text-3xl font-bold dark:text-white">
                                        {aqi}
                                    </Text>
                                    <Text className="text-md text-center font-semibold dark:text-white">
                                        {selectedCat}
                                    </Text>
                                </>
                            </View>
                            <PolarChart percent={parseInt(`${percent}`)} isDark={false} />
                        </View>

                        <Text className="text-md  w-full text-center font-semibold dark:text-white">
                            Click to learn more about..
                        </Text>

                        <Text className="px-4  text-center text-xl font-semibold dark:text-white">
                            Air Quality Index and Weather Data
                        </Text>
                    </View>

                    <Timer timestamp={new Date(timestamp * 1000).toISOString()} />
                </LinearGradient>
            </View>
        </Pressable>
    );
}
