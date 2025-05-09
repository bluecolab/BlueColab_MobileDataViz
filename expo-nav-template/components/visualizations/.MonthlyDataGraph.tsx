import { FontAwesome } from '@expo/vector-icons';
import { useFont } from '@shopify/react-native-skia';
import React, { useRef, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
// import { LineChart } from 'react-native-gifted-charts';
// import { Line, CartesianChart, AreaRange } from 'victory-native';

import inter from '@/assets/fonts/Inter-Medium.ttf';
import LinkComp from '@/components/LinkComp';
// import EmptyGraph from '@/components/visualizations/EmptyGraph';
import { useIsDark } from '@/contexts/ColorSchemeContext';
import useDataCleaner from '@/hooks/useDataCleaner';

const {
    VictoryChart,
    VictoryArea,
    VictoryLine,
    VictoryAxis,
    VictoryLabel,
} = require('victory-native');

const { width } = Dimensions.get('window');

const PercentageDotLine = ({ percentage }: { percentage: number }) => {
    return (
        <View className="my-2 flex-1 items-center justify-center">
            <View className="relative h-1.5 w-4/5 bg-gray-500 dark:bg-gray-300">
                <View
                    className="absolute h-3.5 w-2.5 rounded-full bg-fuchsia-400"
                    style={{ left: `${percentage}%`, top: -3 }}
                />
            </View>
        </View>
    );
};

interface MonthlyDataGraphProps {
    loading: boolean;
    yAxisLabel: string;
    data: any;
    unit: string;
    meta: {
        description: string;
        reason: string;
        ref: {
            label: string;
            link: string;
        }[];
    };
    defaultTempUnit: string | undefined;
    unitMap: Record<string, string | null>;
    alternateName?: string;
}

export default function MonthlyDataGraph({
    loading,
    yAxisLabel,
    data,
    unit,
    meta,
    defaultTempUnit,
    unitMap,
    alternateName,
}: MonthlyDataGraphProps) {
    const { clean } = useDataCleaner();
    const font = useFont(inter, 12);

    console.log('MonthlyDataGraph', {
        // loading,
        yAxisLabel,
        // data,
        // unit,
        // meta,
        // defaultTempUnit,
        // unitMap,
        // alternateName,
    });

    const finalUnitToUse = unitMap[unit] === null ? alternateName : unit;
    const containerWidth = width * 0.95;
    const { isDark } = useIsDark();
    const flipAnimation = useRef(new Animated.Value(0)).current;
    const [flipped, setFlipped] = useState(false);

    const startAnimation = () => {
        Animated.timing(flipAnimation, {
            toValue: flipped ? 0 : 1,
            duration: 500,
            useNativeDriver: true, // RotateY doesn't support native driver
        }).start(() => setFlipped(!flipped));
    };

    const frontInterpolate = flipAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
    });

    const { dailySummary, overallMin, overallMax, overallAvg, tickValues } = clean(
        data,
        loading,
        finalUnitToUse,
        defaultTempUnit
    );

    // Convert to desired format
    const avgs = dailySummary.map((entry) => ({
        label: entry.day.toISOString().split('T')[0], // 'YYYY-MM-DD'
        value: entry.avg,
    }));

    // const min = dailySummary.map((entry) => ({
    //     label: entry.day.toISOString().split('T')[0], // 'YYYY-MM-DD'
    //     value: entry.min,
    // }));

    // const max = dailySummary.map((entry) => ({
    //     label: entry.day.toISOString().split('T')[0], // 'YYYY-MM-DD'
    //     value: entry.max,
    // }));

    const minMaxMid = dailySummary.map((entry) => ({
        label: entry.day.toISOString().split('T')[0], // 'YYYY-MM-DD'
        y: entry.min,
        y0: entry.max,
        avg: entry.avg,
    }));

    // const max = dailySummary.map((entry) => ({
    //     label: entry.day.toISOString().split('T')[0], // 'YYYY-MM-DD'
    //     value: entry.max,
    // }));

    console.log(avgs);

    // return (

    // );
    return (
        <View style={{ width, marginTop: 10 }}>
            <View className="elevation-[5]">
                {/* Title Bar */}
                <View className="w-[95%] self-center">
                    <Text className="rounded-3xl bg-white p-1 text-center text-2xl font-bold dark:bg-gray-700 dark:text-white">
                        {yAxisLabel}{' '}
                        {unitMap && finalUnitToUse !== 'pH'
                            ? `- ${
                                  finalUnitToUse === 'Temp'
                                      ? defaultTempUnit?.trim() === 'Fahrenheit'
                                          ? '°F'
                                          : unitMap[finalUnitToUse ?? 'Temp']
                                      : unitMap[finalUnitToUse ?? 'Temp']
                              }`
                            : ''}
                    </Text>
                    <TouchableOpacity className="absolute right-2 top-1" onPress={startAnimation}>
                        <FontAwesome
                            name="info-circle"
                            size={32}
                            color={isDark ? 'white' : 'grey'}
                        />
                    </TouchableOpacity>
                </View>

                {/* Graph Container */}
                <View className="z-10 w-[95%] self-center">
                    <View className="h-[310]">
                        {/* Front View - Graph */}
                        <Animated.View
                            style={{
                                marginTop: 5,
                                height: '100%',
                                width: containerWidth,
                                position: 'absolute',
                                justifyContent: 'center',
                                alignSelf: 'center',
                                backfaceVisibility: 'hidden',
                                transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
                            }}>
                            <View className="h-full rounded-3xl bg-white px-2 dark:bg-gray-700">
                                {loading ? (
                                    // <EmptyGraph />
                                    <></>
                                ) : data?.error ? (
                                    // <EmptyGraph text={data?.error} />
                                    <></>
                                ) : !Array.isArray(data) ? (
                                    // <EmptyGraph text="No data :(" />
                                    <></>
                                ) : avgs.length ? (
                                    <VictoryChart
                                        padding={{ left: 60, top: 20, right: 50, bottom: 50 }}>
                                        <VictoryAxis
                                            label="Time"
                                            tickValues={tickValues}
                                            tickFormat={(t: any) =>
                                                `${t ? t.getMonth() + 1 : ''}/${t ? t.getDate() : ''}`
                                            }
                                            style={{
                                                axis: { stroke: isDark ? '#fff' : '#000' },
                                                axisLabel: { fill: isDark ? '#fff' : '#000' },
                                                tickLabels: {
                                                    fontSize: 12,
                                                    padding: 5,
                                                    fill: isDark ? '#fff' : '#000',
                                                },
                                            }}
                                        />
                                        <VictoryAxis
                                            dependentAxis
                                            label={yAxisLabel}
                                            style={{
                                                axis: { stroke: isDark ? '#fff' : '#000' },
                                                axisLabel: { fill: isDark ? '#fff' : '#000' },
                                                tickLabels: { fill: isDark ? '#fff' : '#000' },
                                            }}
                                            axisLabelComponent={
                                                <VictoryLabel dy={-20} angle={270} />
                                            }
                                        />
                                        <VictoryArea
                                            data={minMaxMid}
                                            x="day"
                                            y0="y0"
                                            y="y"
                                            style={{
                                                data: {
                                                    fill: isDark
                                                        ? 'rgba(73, 146, 255, 0.95)'
                                                        : 'rgba(0, 100, 255, 0.4)',
                                                },
                                            }}
                                        />
                                        <VictoryLine
                                            data={minMaxMid}
                                            x="day"
                                            y="avg"
                                            style={{
                                                data: {
                                                    stroke: isDark
                                                        ? 'rgb(0, 0, 138)'
                                                        : 'rgb(0, 0, 255)',
                                                },
                                            }}
                                        />
                                    </VictoryChart>
                                ) : (
                                    // <EmptyGraph text="No data for parameter at this month." />
                                    <></>
                                )}
                            </View>
                        </Animated.View>

                        {/* Back View - Information Card */}
                        <Animated.View
                            style={{
                                marginTop: 5,
                                height: '100%',
                                width: containerWidth,
                                position: 'absolute',
                                justifyContent: 'center',
                                alignSelf: 'center',
                                backfaceVisibility: 'hidden',
                                transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
                            }}
                            pointerEvents={flipped ? 'auto' : 'none'}>
                            <ScrollView
                                nestedScrollEnabled
                                className="h-full rounded-3xl bg-white p-4 dark:bg-gray-700">
                                <View
                                    style={{
                                        borderBottomWidth: 1,
                                        borderBottomColor: isDark ? 'white' : 'black',
                                        marginVertical: 10,
                                    }}
                                />

                                <Text className="text-center text-lg font-semibold dark:text-white">
                                    Quick Summary
                                </Text>
                                <View className="w-full flex-row items-center justify-center ">
                                    <View className="flex-1">
                                        <Text className="text-center text-3xl font-bold dark:text-white">
                                            {overallMin.toFixed(1)}
                                        </Text>
                                        <Text className="text-center dark:text-white">Low</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-center text-3xl font-bold dark:text-white">
                                            {overallAvg.toFixed(1)}
                                        </Text>
                                        <Text className="text-center dark:text-white">Average</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-center text-3xl font-bold dark:text-white">
                                            {overallMax.toFixed(1)}
                                        </Text>
                                        <Text className="text-center dark:text-white">High</Text>
                                    </View>
                                </View>

                                <Text className="text-center text-lg font-semibold dark:text-white">
                                    Skew of Average
                                </Text>

                                <PercentageDotLine
                                    percentage={
                                        ((overallAvg - overallMin) / (overallMax - overallMin)) *
                                        100
                                    }
                                />

                                <View
                                    style={{
                                        borderBottomWidth: 1,
                                        borderBottomColor: isDark ? 'white' : 'black',
                                        marginVertical: 10,
                                    }}
                                />

                                <Text className="text-lg font-semibold dark:text-white">
                                    What is {yAxisLabel}?
                                </Text>
                                <Text className="text-md dark:text-gray-300">
                                    {meta.description}
                                </Text>
                                <Text className="mt-4 text-lg font-semibold dark:text-white">
                                    Why does it matter?
                                </Text>
                                <Text className="text-md dark:text-gray-300">{meta?.reason}</Text>
                                <Text className="pt-4 text-lg font-semibold dark:text-white">
                                    References
                                </Text>
                                {meta.ref &&
                                    meta.ref.map((ref, index) => (
                                        <LinkComp key={index} label={ref.label} url={ref.link} />
                                    ))}
                                <Text />
                            </ScrollView>
                        </Animated.View>
                    </View>
                </View>
            </View>
        </View>
    );
}
