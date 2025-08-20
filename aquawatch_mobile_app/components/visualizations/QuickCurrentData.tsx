// /components/QuickCurrentData.tsx
import { differenceInSeconds } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Text, View, Dimensions, TouchableOpacity } from 'react-native';

import { useCurrentData } from '@/contexts/CurrentDataContext';
import { config } from '@/hooks/useConfig';
import { extractLastData } from '@/utils/extractLastData';

const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth - 100) / 2; // Adjust 32px for padding/margins

interface ParamViewProps {
    param: string | number;
    name: string;
    unit?: string;
}

/**
 * @param param - The actual value to display
 * @param name - The name of the parameter to display
 * @param unit - The unit of the parameter to display
 * @returns {JSX.Element}
 * @description The view for each individual parameter (i.e. the single grid item).
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

/**
 * @param timestamp - The timestamp for the data point
 * @returns {JSX.Element}
 * @description The timer component that displays the time since the last data point was received.
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
 * @returns {JSX.Element}
 * @description The quick current data component. It displays the current data in a quick grid-view format.
 */
export default function QuickCurrentData() {
    // All data is received from the context provider
    const { data, defaultLocation, defaultTempUnit, loadingCurrent, error } = useCurrentData();

    if (!defaultLocation) {
        return <></>;
    }

    const lastDataPoint = extractLastData(
        data,
        defaultLocation,
        defaultTempUnit,
        loadingCurrent,
        error
    );

    return (
        <TouchableOpacity onPress={() => router.push('/(tabs)/currentData')}>
            <View className="px-4 pt-4">
                <LinearGradient
                    colors={error ? ['#ff2929', '#ffa8a8'] : ['#00104d', '#3fb8ab']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={{
                        paddingTop: 4,
                        alignItems: 'center',
                        borderRadius: 20,
                    }}>
                    <View>
                        <Text className="text-center text-2xl font-bold text-white">
                            Live Data Quick Look
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
                        {config.BLUE_COLAB_API_CONFIG.validMatches.includes(defaultLocation) ? (
                            <ParamView param={lastDataPoint.wqi} name="WQI" />
                        ) : (
                            <></>
                        )}
                    </View>

                    <Timer timestamp={lastDataPoint.timestamp} />
                </LinearGradient>
            </View>
        </TouchableOpacity>
    );
}
