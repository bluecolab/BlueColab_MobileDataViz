import { View, Text } from 'react-native';
import { CartesianChart, Line } from 'victory-native';

import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { ErrorType } from '@/types/error.interface';
import { getOrdinalSuffix } from '@/utils/getOrdinalSuffix';

export function EmptyGraph({ error }: { error: ErrorType }) {
    const { isDark, loading, font } = useColorScheme();

    if (loading) {
        return <></>;
    }

    const dailySummary = Array.from({ length: 30 }, (_, i) => {
        return {
            day: i + 1,
            avg: undefined,
            min: undefined,
            max: undefined,
        };
    });

    return (
        <View className="h-full rounded-3xl bg-white px-2 dark:bg-gray-700">
            <Text className="text-center text-black dark:text-white">{error.message}</Text>
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
                domain={{
                    y: [0, 100],
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
