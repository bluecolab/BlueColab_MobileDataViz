import { View, Text } from 'react-native';

import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { ErrorType } from '@/types/error.interface';
import { DailySummaryType } from '@/utils/dataUtils';

import { EmptyGraph } from '../EmptyGraph';

import Graph from './Graph';

interface MonthlyDataCardFrontProp {
    loading: boolean;
    dailySummary: DailySummaryType[];
    error: ErrorType | undefined;
    month: string;
}

export function MonthlyDataCardFront({
    loading,
    dailySummary,
    error,
    month,
}: MonthlyDataCardFrontProp) {
    const { isDark, loading: fontLoading, font } = useColorScheme();

    if (fontLoading) {
        return <></>;
    }

    if (loading) {
        return (
            <EmptyGraph
                error={{
                    message: 'Loading...',
                    code: 0,
                }}
            />
        );
    } else if (error) {
        return <EmptyGraph error={error} />;
    } else if (dailySummary.length === 0) {
        return (
            <EmptyGraph
                error={{
                    message: 'Error: No data available',
                }}
            />
        );
    }

    return (
        <View className="h-full rounded-3xl bg-white px-2 dark:bg-gray-700">
            <Text
                className="absolute bottom-1 left-1/2 -translate-x-1/2 text-center text-black dark:text-white"
                key="month-label">
                {month}
            </Text>
            <Graph dailySummary={dailySummary} isDark={isDark} font={font} />
        </View>
    );
}
