// /components/QuickCurrentData.tsx
import { differenceInSeconds } from 'date-fns';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { Text, View, Dimensions, Pressable, ImageBackground } from 'react-native';

import { useCurrentData } from '@/contexts/CurrentDataContext';
import { useGraphData } from '@/contexts/~GraphDataContext';
import { config } from '@/hooks/useConfig';
import { extractLastData } from '@/utils/extractLastData';

import PolarChart from './WQI/PolarChart';

const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth - 100) / 2; // Adjust 32px for padding/margins

interface ParamViewProps {
    param: string | number;
    name: string;
    unit?: string;
}

/** The view for each individual parameter (i.e. the single grid item).
 * @param param - The actual value to display
 * @param name - The name of the parameter to display
 * @param unit - The unit of the parameter to display
 * @returns {JSX.Element}
 */
const ParamView = ({ param, name, unit }: ParamViewProps) => {
    return (
        <View style={{ width: itemWidth }} className="flex items-center justify-center rounded-lg ">
            <Text className="text-center  text-2xl text-white">
                {String(param)} {unit ? String(unit) : ''}
            </Text>
            {name === 'WQI' && <Text className="text-base text-white">/100</Text>}
            <Text className="text-center text-lg  text-white">{name}</Text>
        </View>
    );
};

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
export default function QuickCurrentData({ showConvertedUnits }: { showConvertedUnits?: boolean }) {
    const backgroundImage = require('@/assets/homescreen/waterBG.jpg');
    // All data is received from the context provider
    const { data, airData, defaultLocation, defaultTempUnit, loadingCurrent, error } =
        useCurrentData();
    // Read global toggle from GraphDataContext as the source of truth
    const { showConvertedUnits: showConvertedUnitsGlobal } = useGraphData();
    const effectiveShowConverted = showConvertedUnits ?? showConvertedUnitsGlobal;

    if (!defaultLocation) {
        return <></>;
    }

    const lastDataPoint = extractLastData(
        data,
        airData,
        defaultLocation,
        defaultTempUnit,
        loadingCurrent,
        error,
        effectiveShowConverted
    );

    return (
        <Pressable onPress={() => router.push('/currentData')}>
            <View className="rounded-[20px] px-4 pt-4">
                <ImageBackground
                    source={backgroundImage}
                    resizeMode="cover"
                    style={{
                        paddingTop: 4,
                        alignItems: 'center',
                        borderRadius: 20,
                        overflow: 'hidden',
                    }}>
                    <View className="rounded-[20px] px-4 pt-4">
                        <Text className="text-center text-2xl font-bold text-white">
                            {config.BLUE_COLAB_WATER_API_CONFIG.validMatches.some(
                                (loc) => loc.name === defaultLocation.name
                            )
                                ? 'Live Water Quality Index'
                                : 'Live Data Quick Look'}
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
                        {config.BLUE_COLAB_WATER_API_CONFIG.validMatches.some(
                            (loc) => loc.name === defaultLocation.name
                        ) ? (
                            <View className="h-[200] w-[200]">
                                <View className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                                    <Text className="text-3xl font-bold text-white">
                                        {lastDataPoint.wqi}%
                                    </Text>
                                </View>
                                <PolarChart
                                    percent={parseInt(`${lastDataPoint.wqi}`)}
                                    isDark={false}
                                />
                            </View>
                        ) : (
                            <>
                                <ParamView
                                    param={lastDataPoint.temp}
                                    name="Temperature"
                                    unit={lastDataPoint.tempUnit}
                                />
                                <ParamView param={lastDataPoint.pH} name="pH" unit={''} />
                                <ParamView
                                    param={lastDataPoint.do}
                                    name="Dissolved O2"
                                    unit={lastDataPoint.doUnit}
                                />
                                <ParamView
                                    param={lastDataPoint.turb}
                                    name="Turbidity"
                                    unit={lastDataPoint.turbUnit}
                                />
                                <ParamView
                                    param={lastDataPoint.cond}
                                    name="Conductivity"
                                    unit={lastDataPoint.condUnit}
                                />
                                <ParamView
                                    param={lastDataPoint.sal}
                                    name="Salinity"
                                    unit={lastDataPoint.salUnit}
                                />
                            </>
                        )}
                    </View>

                    <Timer timestamp={lastDataPoint.timestamp} />
                </ImageBackground>
            </View>
        </Pressable>
    );
}
