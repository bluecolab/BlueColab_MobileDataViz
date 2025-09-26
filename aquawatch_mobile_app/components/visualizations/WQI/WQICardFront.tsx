import { FontAwesome } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { PolarChart, Pie } from 'victory-native';

import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { CleanedWaterData } from '@/types/water.interface';
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
    data: CleanedWaterData[] | undefined;
    loading: boolean;
    wqi?: number | string;
}

export default function WQICardFront({ data, loading, wqi }: WQICardFrontProps) {
    const { calculateWQI } = dataUtils();
    const { isDark } = useColorScheme();

    const filteredData = (data as CleanedWaterData[]).filter(
        (item) => item.Cond !== undefined
    ) as any;
    const percentage = wqi
        ? Number.parseFloat(wqi.toString())
        : calculateWQI(filteredData, loading);

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
        <View>
            <View className="w-[95%] self-center">
                <Text className="rounded-3xl bg-white p-1 text-center text-3xl font-bold dark:bg-gray-700 dark:text-white">
                    WQI
                </Text>
                <FontAwesome
                    className="absolute right-0 top-3"
                    name="info-circle"
                    size={32}
                    color={isDark ? 'white' : 'grey'}
                />
            </View>
            <View style={{ height: 200 }}>
                <View className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Text className="text-3xl font-bold text-black dark:text-white">
                        {percentage}%
                    </Text>
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
        </View>
    );
}
