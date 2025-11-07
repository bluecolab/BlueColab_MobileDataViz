import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Platform } from 'react-native';

import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { ErrorType } from '@/types/error.interface';
import { DailySummaryType } from '@/utils/dataUtils';

import { EmptyGraph } from '../EmptyGraph';

import Graph from './Graph';
import GraphVictory from './Graph-web';

interface MonthlyDataCardFrontProp {
    loading: boolean;
    dailySummary: DailySummaryType[];
    error: ErrorType | undefined;
    month: string;
    title: string;
    legend?: React.ReactNode;
}

export function MonthlyDataCardFront({
    loading,
    dailySummary,
    error,
    month,
    title,
    legend,
}: MonthlyDataCardFrontProp) {
    const { isDark, loading: fontLoading, font } = useColorScheme();

    if (fontLoading && !(Platform.OS === 'web')) {
        return <></>;
    }

    if (loading) {
        return (
            <View className="z-10 h-[340] w-[95%] self-center">
                <EmptyGraph
                    error={{
                        message: 'Loading...',
                        code: 0,
                    }}
                />
            </View>
        );
    } else if (error) {
        return <EmptyGraph error={error} />;
    } else if (dailySummary.length === 0) {
        return (
            <View className="z-10 h-[340] w-[95%] self-center">
                <EmptyGraph
                    error={{
                        message: 'Error: No data available',
                    }}
                />
            </View>
        );
    }

    return (
        <View className="h-[340] rounded-3xl bg-white px-2 dark:bg-gray-700">
            <View className="w-full self-center">
                <Text className="rounded-3xl bg-white p-1 text-center text-2xl font-bold dark:bg-gray-700 dark:text-white">
                    {title}
                </Text>
                {!legend && (
                    <FontAwesome
                        className="absolute right-0 top-2"
                        name="info-circle"
                        size={32}
                        color={isDark ? 'white' : 'grey'}
                    />
                )}
            </View>

            {legend ? <View className="mt-1 items-center">{legend}</View> : null}
            <Text
                className="absolute bottom-1 left-1/2 -translate-x-1/2 text-center text-black dark:text-white"
                key="month-label">
                {month}
            </Text>
            {Platform.OS === 'web' ? (
                <GraphVictory dailySummary={dailySummary} isDark={isDark} />
            ) : (
                <Graph dailySummary={dailySummary} isDark={isDark} font={font} />
            )}
        </View>
    );
}
