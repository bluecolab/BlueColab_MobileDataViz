import { useFont } from '@shopify/react-native-skia';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { AreaRange, CartesianChart, Line } from 'victory-native';

import roboto from '@/assets/fonts/roboto.ttf';
import { useIsDark } from '@/contexts/ColorSchemeContext';
import { DailySummaryType } from '@/hooks/useDataCleaner';

const getOrdinalSuffix = (num: number): string => {
    const lastDigit = num % 10;
    const lastTwoDigits = num % 100;

    if ([11, 12, 13].includes(lastTwoDigits)) {
        return `${num}th`; // Special case for 11th, 12th, and 13th
    }

    const suffixMap: Record<number, string> = {
        1: 'st',
        2: 'nd',
        3: 'rd',
    };

    return `${num}${suffixMap[lastDigit] || 'th'}`;
};

interface MonthlyDataCardFrontProp {
    dailySummary: DailySummaryType[];
    error: string;
    month: string;
}

export function MonthlyDataCardFront({ dailySummary, error, month }: MonthlyDataCardFrontProp) {
    const { isDark } = useIsDark();
    const font = useFont(roboto, 12);
    const [isFontLoaded, setIsFontLoaded] = useState(false);

    useEffect(() => {
        if (font) {
            setIsFontLoaded(true);
        }
    }, [font]);

    if (!isFontLoaded) {
        return <Text>Loading...</Text>; // Show a placeholder until the font is ready
    }

    if (dailySummary.length === 0 || error) {
        return (
            <View className="h-full rounded-3xl bg-white px-2 dark:bg-gray-700">
                <Text>Oops there was an error! (or just loading idk)</Text>
            </View>
        );
    }

    return (
        <View className="h-full rounded-3xl bg-white px-2 dark:bg-gray-700">
            {/* Bottom-Centered Text */}
            <Text className="absolute bottom-1 left-1/2 -translate-x-1/2 text-center text-black dark:text-white" key="month-label"> {/* Fix CssInterop upgrade. Key helps React track this element during re-renders. */}
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
                            color={isDark ? "rgba(73, 146, 255, 0.95)" : "rgba(0, 100, 255, 0.4)"}
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
