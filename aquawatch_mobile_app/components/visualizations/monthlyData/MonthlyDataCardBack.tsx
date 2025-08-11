import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import LinkComp from '@/components/LinkComp';
import { useColorScheme } from '@/contexts/ColorSchemeContext';

interface PercentageDotLineProps {
    percentage: number;
}

const PercentageDotLine: React.FC<PercentageDotLineProps> = ({ percentage }) => {
    const leftPosition = `${percentage}%`; // Ensures compatibility

    return (
        <View className="my-2 flex-1 items-center justify-center">
            <View className="relative h-1.5 w-4/5 bg-gray-500 dark:bg-gray-300">
                <View
                    className="absolute h-3.5 w-2.5 rounded-full bg-fuchsia-400"
                    style={{ left: parseFloat(leftPosition), top: -3 }}
                />
            </View>
        </View>
    );
};

interface MonthlyDataCardBackProps {
    overallMin: number | 'N/A';
    overallMax: number | 'N/A';
    overallAvg: number | 'N/A';
    yAxisLabel: string;
    meta: any;
}

export function MonthlyDataCardBack({
    overallMin,
    overallMax,
    overallAvg,
    yAxisLabel,
    meta,
}: MonthlyDataCardBackProps) {
    const { isDark } = useColorScheme();

    return (
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

            <Text className="text-center text-lg font-semibold dark:text-white">Quick Summary</Text>
            <View className="w-full flex-row items-center justify-center ">
                <View className="flex-1">
                    <Text className="text-center text-3xl font-bold dark:text-white">
                        {overallMin === 'N/A' ? overallMin : overallMin.toFixed(1)}
                    </Text>
                    <Text className="text-center dark:text-white">Low</Text>
                </View>
                <View className="flex-1">
                    <Text className="text-center text-3xl font-bold dark:text-white">
                        {overallAvg === 'N/A' ? overallAvg : overallAvg.toFixed(1)}
                    </Text>
                    <Text className="text-center dark:text-white">Average</Text>
                </View>
                <View className="flex-1">
                    <Text className="text-center text-3xl font-bold dark:text-white">
                        {overallMax === 'N/A' ? overallMax : overallMax.toFixed(1)}
                    </Text>
                    <Text className="text-center dark:text-white">High</Text>
                </View>
            </View>

            <Text className="text-center text-lg font-semibold dark:text-white">
                Skew of Average
            </Text>

            {overallAvg !== 'N/A' && overallMin !== 'N/A' && overallMax !== 'N/A' && (
                <PercentageDotLine
                    percentage={((overallAvg - overallMin) / (overallMax - overallMin)) * 100}
                />
            )}

            <View
                style={{
                    borderBottomWidth: 1,
                    borderBottomColor: isDark ? 'white' : 'black',
                    marginVertical: 10,
                }}
            />

            <Text className="text-lg font-semibold dark:text-white">What is {yAxisLabel}?</Text>
            <Text className="text-md dark:text-gray-300">{meta.description}</Text>
            <Text className="mt-4 text-lg font-semibold dark:text-white">Why does it matter?</Text>
            <Text className="text-md dark:text-gray-300">{meta?.reason}</Text>
            <Text className="pt-4 text-lg font-semibold dark:text-white">References</Text>
            {meta.ref &&
                meta.ref.map((ref: any, index: number) => (
                    <LinkComp key={index} label={ref.label} url={ref.url} />
                ))}
            <Text />
        </ScrollView>
    );
}
