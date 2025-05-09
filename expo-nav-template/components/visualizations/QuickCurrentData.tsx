// /components/QuickCurrentData.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { DateTime } from 'luxon';
import React, { useState, useEffect } from 'react';
import { Text, View, Dimensions, TouchableOpacity } from 'react-native';

import { useCurrentData } from '@/contexts/CurrentDataContext';
import useGetMetadata from '@/hooks/useGetMetadata';

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
            const currentTime = DateTime.now();
            const timestampDateTime =
                timestamp === 'Loading' ? DateTime.now() : DateTime.fromISO(timestamp);

            if (timestampDateTime.isValid) {
                const diffInSeconds = currentTime.diff(timestampDateTime, 'seconds');
                setMinutes(diffInSeconds.seconds);
            } else {
                console.error('Invalid timestamp', timestamp);
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
    const { data, defaultLocation, defaultTempUnit } = useCurrentData();
    const { units } = useGetMetadata();

    // For current data, the API returns last 2 days of data
    // We only want the last data point for the quick view
    const last = data[data.length - 1];

    // We extract the data from the last data point
    // TODO: Add better handling when 'last' is undefined or if individual parameters are undefined
    const dopct = last?.DOpct?.toFixed(2) ?? last?.DO?.toFixed(2) ?? 'NA';
    const ph = last?.pH?.toFixed(2) ?? 'NA';
    const temp = last?.Temp ?? 'NA';
    const convertedTemp =
        temp === 'NA'
            ? 'NA'
            : (defaultTempUnit ? defaultTempUnit.trim() : 'Fahrenheit') === 'Fahrenheit'
              ? (temp * (9 / 5) + 32)?.toFixed(2)
              : temp;
    const cond = last?.Cond?.toFixed(2) ?? 'NA';
    const turb = last?.Turb?.toFixed(2) ?? 'NA';
    const sal = last?.Sal?.toFixed(2) ?? 'NA';
    const timestamp = last?.timestamp ?? 'Loading';

    // WQI Calculation
    const const_dopct = !isNaN(dopct) ? 0.34 * dopct : 0;
    const const_ph = !isNaN(ph) ? 0.22 * ph : 0;
    const const_temp = !isNaN(temp) ? 0.2 * temp : 0;
    const const_cond = !isNaN(cond) ? 0.08 * cond : 0;
    const const_turb = !isNaN(turb) ? 0.16 * turb : 0;
    const wqi = const_dopct + const_ph + const_temp + const_cond + const_turb;
    const unitMap = units[defaultLocation as 'Choate Pond'];

    return (
        <TouchableOpacity onPress={() => router.push('/(tabs)/currentData')}>
            <View className="px-4 pt-4">
                <LinearGradient
                    colors={['#00104d', '#3fb8ab']}
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

                    <View className="flex flex-row flex-wrap items-center justify-center gap-4 pt-4">
                        <ParamView
                            param={convertedTemp}
                            name="Temperature"
                            unit={
                                (defaultTempUnit ? defaultTempUnit.trim() : 'Fahrenheit') ===
                                'Fahrenheit'
                                    ? '°F'
                                    : unitMap
                                      ? unitMap['Temp']
                                      : ''
                            }
                        />
                        <ParamView param={ph} name="pH" unit={unitMap ? unitMap['pH'] : ''} />
                        <ParamView
                            param={dopct}
                            name="Dissolved O2"
                            unit={unitMap ? (unitMap['DOpct'] ?? unitMap['DO']) : ''}
                        />
                        <ParamView
                            param={turb}
                            name="Turbidity"
                            unit={unitMap ? unitMap['Turb'] : ''}
                        />
                        <ParamView
                            param={cond}
                            name="Conductivity"
                            unit={unitMap ? unitMap['Cond'] : ''}
                        />
                        <ParamView
                            param={sal}
                            name="Salinity"
                            unit={unitMap ? unitMap['Sal'] : ''}
                        />
                        {defaultLocation === 'Choate Pond' ? (
                            <ParamView param={!isNaN(wqi) ? wqi?.toFixed(2) : 'NA'} name="WQI" />
                        ) : (
                            <></>
                        )}
                    </View>

                    <Timer timestamp={timestamp} />
                </LinearGradient>
            </View>
        </TouchableOpacity>
    );
}
