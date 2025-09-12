import { FontAwesome } from '@expo/vector-icons';
import { useRef } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';

import FlipCard from '@/components/customCards/FlipCard';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { CleanedWaterData } from '@/types/water.interface';

import { WQICardBack } from './WQICardBack';
import WQICardFront from './WQICardFront';

interface WQICardProps {
    loading: boolean;
    data: CleanedWaterData[] | undefined;
    wqi?: number | string;
    size?: number;
}

export function WQICard({ loading, data, wqi }: WQICardProps) {
    const { width } = Dimensions.get('window');
    const containerWidth = width * 0.95;
    const { isDark } = useColorScheme();

    const flipCardRef = useRef<{ flip: () => void }>(null);
    const flipCard = () => flipCardRef.current?.flip();

    return (
        <View style={{ width, marginTop: 10 }}>
            <View className="elevation-[5]">
                {/* Title Bar */}
                <View className="w-[95%] self-center">
                    <Text className="rounded-3xl bg-white p-1 text-center text-3xl font-bold dark:bg-gray-700 dark:text-white">
                        WQI
                    </Text>
                    <TouchableOpacity className="absolute right-2 top-1" onPress={flipCard}>
                        <FontAwesome
                            name="info-circle"
                            size={32}
                            color={isDark ? 'white' : 'grey'}
                        />
                    </TouchableOpacity>
                </View>

                {/* Graph Container */}
                <View className="z-10 self-center">
                    <View>
                        {/* Front View - Graph */}
                        <FlipCard
                            Front={
                                <View className="flex-1 items-center justify-center  rounded-3xl bg-white p-default dark:bg-gray-700 ">
                                    <View className="h-[200] w-[300]">
                                        <WQICardFront data={data} loading={loading} wqi={wqi} />
                                    </View>
                                </View>
                            }
                            Back={
                                <View className="h-[200]">
                                    <WQICardBack />
                                </View>
                            }
                            flipCardRef={flipCardRef}
                            frontStyles={{ marginTop: 5, width: containerWidth }}
                            backStyles={{ marginTop: 5, width: containerWidth }}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}
