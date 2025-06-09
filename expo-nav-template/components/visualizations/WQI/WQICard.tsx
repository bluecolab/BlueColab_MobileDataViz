import { FontAwesome } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { View, Text, Animated, Dimensions, TouchableOpacity } from 'react-native';

import { useIsDark } from '@/contexts/ColorSchemeContext';
import WQICardFront from './WQICardFront';
import { WQICardBack } from './WQICardBack';

interface WQICardProps {
    loading: boolean,
    data: any,
    size?: number
}

export function WQICard({ loading, data}: WQICardProps) {
    const { width } = Dimensions.get('window');
    const containerWidth = width * 0.95;
    const { isDark } = useIsDark();
    const flipAnimation = useRef(new Animated.Value(0)).current;
    const [flipped, setFlipped] = useState(false);

    const startAnimation = () => {
        Animated.timing(flipAnimation, {
            toValue: flipped ? 0 : 1,
            duration: 500,
            useNativeDriver: true, // RotateY doesn't support native driver
        }).start(() => setFlipped(!flipped));
    };

    const frontInterpolate = flipAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
    });

    return (
        <View style={{ width, marginTop: 10 }}>
            <View className="elevation-[5]">
                {/* Title Bar */}
                <View className="w-[95%] self-center">
                    <Text className="rounded-3xl bg-white p-1 text-center text-3xl font-bold dark:bg-gray-700 dark:text-white">
                        WQI
                    </Text>
                    <TouchableOpacity className="absolute right-2 top-1" onPress={startAnimation}>
                        <FontAwesome
                            name="info-circle"
                            size={32}
                            color={isDark ? 'white' : 'grey'}
                        />
                    </TouchableOpacity>
                </View>

                {/* Graph Container */}
                <View className="z-10 self-center">
                    <View className="h-[250]">
                        {/* Front View - Graph */}
                        <Animated.View
                            style={{
                                marginTop: 5,
                                height: '100%',
                                width: containerWidth,
                                position: 'absolute',
                                justifyContent: 'center',
                                alignSelf: 'center',
                                backfaceVisibility: 'hidden',
                                transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
                            }}>
                             <View className="flex-1 items-center justify-center  rounded-3xl bg-white p-default dark:bg-gray-700 ">
                                <View className='h-[300] w-[300] mt-[100]'>
                                    <WQICardFront data={data} loading={loading}/>
                                </View>
                            </View>
                        </Animated.View>

                        {/* Back View - Information Card */}
                        <Animated.View
                            style={{
                                marginTop: 5,
                                height: '100%',
                                width: containerWidth,
                                position: 'absolute',
                                justifyContent: 'center',
                                alignSelf: 'center',
                                backfaceVisibility: 'hidden',
                                transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
                            }}
                            pointerEvents={flipped ? 'auto' : 'none'}>
                                <WQICardBack />
                        </Animated.View>
                    </View>
                </View>
            </View>
        </View>
    );
};
