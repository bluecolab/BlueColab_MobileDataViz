import { FontAwesome } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import PolarChart from './PolarChart';

import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { CleanedWaterData } from '@/types/water.interface';
import dataUtils from '@/utils/dataUtils';

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

    return (
        <View className="flex-1 items-center justify-center  rounded-3xl bg-white p-default dark:bg-gray-700 ">
            <View className="h-[250] w-[300]">
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
                    <View className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <Text className="text-3xl font-bold text-black dark:text-white">
                            {percentage}%
                        </Text>
                    </View>
                    
                    <View className="absolute inset-0">
                        <PolarChart percent={percentage} isDark={isDark} />
                    </View>
                </View>
            </View>
        </View>
    );
}
