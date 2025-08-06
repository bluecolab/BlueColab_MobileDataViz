import { View, Text } from 'react-native';
import { PolarChart, Pie } from 'victory-native';

import { useIsDark } from '@/contexts/ColorSchemeContext';
import dataUtils from '@/utils/dataUtils';

const getColor = (percentage: number) =>
    percentage >= 0 && percentage < 25
        ? 'darkred'
        : percentage >= 25 && percentage < 50
          ? 'darkorange'
          : percentage >= 50 && percentage < 70
            ? 'yellow'
            : percentage >= 70 && percentage < 90
              ? 'green'
              : percentage >= 90 && percentage <= 100
                ? 'darkgreen'
                : 'red'; // Default color

interface WQICardFrontProps {
    data: any;
    loading: boolean;
    wqi?: number | string;
}

export default function WQICardFront({ data, loading, wqi }: WQICardFrontProps) {
    const { calculateWQI } = dataUtils();
    const { isDark } = useIsDark();

    const percentage = wqi ? Number.parseFloat(wqi.toString()) : calculateWQI(data, loading);

    const DATA = [
        {
            value: percentage,
            color: getColor(percentage),
            label: 'WQI',
        },
        {
            value: Math.max(0, 100 - percentage),
            color: 'lightgray',
            label: 'WQI',
        },
    ];
    return (
        <View style={{ height: 200 }}>
            <View className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Text className="text-3xl font-bold text-black dark:text-white">{percentage}%</Text>
            </View>

            <PolarChart data={DATA} labelKey="label" valueKey="value" colorKey="color">
                <Pie.Chart innerRadius="50%" startAngle={270}>
                    {() => (
                        <Pie.Slice>
                            <Pie.SliceAngularInset
                                angularInset={{
                                    angularStrokeWidth: 5,
                                    angularStrokeColor: isDark ? '#374151' : 'white', // TODO: Fix to Background color for the gaps
                                }}
                            />
                        </Pie.Slice>
                    )}
                </Pie.Chart>
            </PolarChart>
        </View>
    );
}
