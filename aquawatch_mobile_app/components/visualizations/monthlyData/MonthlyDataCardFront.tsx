import { View, Text } from 'react-native';
import { AreaRange, CartesianChart, Line } from 'victory-native';

import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { ErrorType } from '@/types/error.interface';
import { DailySummaryType } from '@/utils/dataUtils';
import { getOrdinalSuffix } from '@/utils/getOrdinalSuffix';

import { EmptyGraph } from '../EmptyGraph';

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
                    message: 'No data available',
                }}
            />
        );
    }

    return (
        <View className="h-full rounded-3xl bg-white px-2 dark:bg-gray-700">
            {/* Bottom-Centered Text */}
            <Text
                className="absolute bottom-1 left-1/2 -translate-x-1/2 text-center text-black dark:text-white"
                key="month-label">
                {/* Key needed to disable CssInterop errors */}
                {month}
            </Text>
            <CartesianChart
                data={dailySummary}
                xKey="day"
                yKeys={['avg', 'min', 'max']}
                xAxis={{
                    font,
                    tickCount: 5,
                    lineWidth: 0,
                    formatXLabel: (label: any) => {
                        return getOrdinalSuffix(label);
                    },
                    labelColor: isDark ? 'white' : '#000000',
                }}
                yAxis={[
                    {
                        labelColor: isDark ? 'white' : '#000000',
                        font,
                    },
                ]}
                frame={{
                    lineColor: isDark ? 'white' : '#000000',
                    lineWidth: { top: 0, bottom: 4, left: 4, right: 0 },
                }}
                padding={{ left: 0, bottom: 20, top: 5, right: 5 }}>
                {({ points }) => (
                    <>
                        <AreaRange
                            upperPoints={points.max}
                            lowerPoints={points.min}
                            color={isDark ? 'rgba(73, 146, 255, 0.95)' : 'rgba(0, 100, 255, 0.4)'}
                            animate={{ type: 'timing' }}
                        />
                        <Line
                            points={points.avg}
                            color="blue"
                            strokeWidth={2}
                            animate={{ type: 'timing' }}
                        />
                    </>
                )}
            </CartesianChart>
        </View>
    );
}
