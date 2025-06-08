import { useIsDark } from '@/contexts/ColorSchemeContext';
import { FontAwesome } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { VictoryChart, VictoryArea, VictoryLine, VictoryAxis, VictoryLabel } from 'victory-native';

import EmptyGraph from './EmptyGraph';
import LinkComp from '../LinkComp';

const { width } = Dimensions.get('window');

function MonthlyDataGraph({
    loading,
    yAxisLabel,
    data,
    unit,
    meta,
    defaultTempUnit,
    unitMap,
    alternateName,
}) {
    const finalUnitToUse = unitMap[unit] === null ? alternateName : unit;
    const containerWidth = width * 0.95;
    const { isDark } = useIsDark();
    const flipAnimation = useRef(new Animated.Value(0)).current;
    const [flipped, setFlipped] = useState(false);

    const PercentageDotLine = ({ percentage }) => {
        const dotPosition = `${percentage}%`; // Calculate dot's position based on percentage

        return (
            <View className="my-2 flex-1 items-center justify-center">
                <View className="relative h-1.5 w-4/5 bg-gray-500 dark:bg-gray-300">
                    <View
                        className="absolute h-3.5 w-2.5 rounded-full bg-fuchsia-400"
                        style={{ left: dotPosition, top: -3 }}
                    />
                </View>
            </View>
        );
    };

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

    let chartData = [];
    let tickValues = [];
    let overallMin = 0;
    let overallMax = 0;
    let overallAvg = 0;

    if (Array.isArray(data) && !loading) {
        const groupedData = data.reduce((acc, item) => {
            const date = new Date(item.timestamp).toISOString().split('T')[0];
            const value =
                finalUnitToUse === 'Temp' && defaultTempUnit.trim() === 'Fahrenheit'
                    ? item[finalUnitToUse] * (9 / 5) + 32
                    : item[finalUnitToUse];
            if (!acc[date]) acc[date] = [];
            acc[date].push(value);

            return acc;
        }, {});

        chartData = Object.keys(groupedData).map((date) => ({
            day: new Date(date),
            avg: groupedData[date].reduce((sum, v) => sum + v, 0) / groupedData[date].length,
            y0: Math.min(...groupedData[date]),
            y: Math.max(...groupedData[date]),
        }));

        chartData.forEach((ele) => {
            ele.avg = !isNaN(ele.avg) && ele.avg !== -999999 ? ele.avg : null;
            ele.y = !isNaN(ele.y) && ele.y !== -999999 ? ele.y : null;
            ele.y0 = !isNaN(ele.y0) && ele.y0 !== -999999 ? ele.y0 : null;
        });

        // Calculate overall min, max, and average
        const allValues = Object.values(groupedData)
            .flat()
            .filter((value) => value !== undefined && !Number.isNaN(value));
        overallMin = Math.min(...allValues);
        overallMax = Math.max(...allValues);
        overallAvg = allValues.reduce((sum, value) => sum + value, 0) / allValues.length;

        tickValues = chartData
            .map(({ day }, index) => (index % 5 === 0 ? day : null))
            .filter(Boolean);
    }

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
                                      ? defaultTempUnit.trim() === 'Fahrenheit'
                                          ? '°F'
                                          : unitMap[finalUnitToUse]
                                      : unitMap[finalUnitToUse]
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
                                    <>Eggs</>
                                ) : data?.error ? (
                                    <>Eggs</>
                                ) : !Array.isArray(data) ? (
                                    <>Eggs</>
                                ) : chartData.length ? (
                                    
                                    <Text></Text>
                                ) : (
                                    <EmptyGraph text="No data for parameter at this month." />
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
                                        <LinkComp key={index} label={ref.label} url={ref.url} />
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

export default MonthlyDataGraph;
