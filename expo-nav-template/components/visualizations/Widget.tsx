import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Animated,
    TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// status & color logic
const getStatusAndColor = (name: string, value: number) => {
    if (isNaN(value)) return { label: 'NA', color: 'text-gray-500' };
    switch (name) {
        case 'Water Temperature':
            if (value < 77) return { label: 'Good', color: 'text-green-600' };
            else if (value < 86)
                return { label: 'Warning', color: 'text-yellow-600' };
            else return { label: 'Bad', color: 'text-red-600' };

        case 'Conductivity':
            return value < 53999
                ? { label: 'Good', color: 'text-green-600' }
                : { label: 'Bad', color: 'text-red-600' };

        case 'Salinity':
            if (value < 4) return { label: 'Good', color: 'text-green-600' };
            else if (value < 9)
                return { label: 'Warning', color: 'text-yellow-600' };
            else return { label: 'Bad', color: 'text-red-600' };

        case 'pH':
            if (value < 4 || value > 11) return { label: 'Bad', color: 'text-red-600' };
            else if ((value >= 4 && value < 6) || (value > 8 && value <= 11))
                return { label: 'Warning', color: 'text-yellow-600' };
            else return { label: 'Good', color: 'text-green-600' };

        case 'Turbidity':
            if (value < 24) return { label: 'Good', color: 'text-green-600' };
            else if (value < 49)
                return { label: 'Warning', color: 'text-yellow-600' };
            else return { label: 'Bad', color: 'text-red-600' };

        case 'Oxygen':
            if (value >= 66 && value <= 199)
                return { label: 'Good', color: 'text-green-600' };
            else if ((value >= 41 && value < 66) || (value > 199 && value <= 299))
                return { label: 'Warning', color: 'text-yellow-600' };
            else return { label: 'Bad', color: 'text-red-600' };

        default:
            return { label: '', color: 'text-gray-500' };
    }
};

// flip‐card descriptions
const DESCRIPTIONS = {
    'Water Temperature':
        'The temperature of the water, in °F or °C. Affects oxygen solubility and aquatic life metabolism.',
    'Conductivity':
        'How well water conducts electricity (µS/cm). Higher values often mean more dissolved salts.',
    'Salinity': 'The amount of dissolved salts in water (ppt).',
    'pH':
        'A measure of acidity or alkalinity on a 0-14 scale (7 is neutral). Below 7 is acidic, above 7 is alkaline.',
    'Turbidity':
        'The cloudiness of water caused by suspended particles (NTU). High turbidity can harm habitats.',
    'Oxygen': 'Dissolved oxygen in water (mg/L). Essential for fish and other organisms.',
};
type DescriptionKeys = keyof typeof DESCRIPTIONS;


// your existing 6‐widget flip‐card
interface WidgetProp {
    name: DescriptionKeys,
    value: number | string
}

export function  Widget ({ name, value }: WidgetProp) {
    const numericValue = parseFloat(value.toString());
    const { label, color } = getStatusAndColor(name, numericValue);

    const anim = useRef(new Animated.Value(0)).current;
    const [flipped, setFlipped] = useState(false);

    const frontRotate = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });
    const backRotate = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
    });

    const doFlip = () => {
        Animated.timing(anim, {
            toValue: flipped ? 0 : 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setFlipped(!flipped));
    };

    return (
        <View className="w-1/2 p-4">
            <TouchableOpacity activeOpacity={0.9} onPress={doFlip}>
                {/* FRONT */}
                <Animated.View
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: [{ perspective: 1000 }, { rotateY: frontRotate }],
                    }}
                >
                    <View className="relative p-6 h-[120px] bg-white dark:bg-gray-700 rounded-3xl">
                        <TouchableOpacity
                            onPress={doFlip}
                            className="absolute top-3 right-3"
                        >
                            <FontAwesome name="info-circle" size={20} color="gray" />
                        </TouchableOpacity>

                        {/* -13px aligns water temperature with others */}
                        <Text
                            className={`text-md font-bold text-center dark:text-white ${name === 'Water Temperature' ? 'mt-[-13px]' : ''
                                }`}
                        >
                            {name}
                        </Text>
                        <View className="mt-4 items-center">
                            <Text className="text-base dark:text-white">{value}</Text>
                            <Text className={`text-sm italic ${color}`}>{label}</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* BACK */}
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backfaceVisibility: 'hidden',
                        transform: [{ perspective: 1000 }, { rotateY: backRotate }],
                    }}
                >
                    <ScrollView
                        className="p-4 h-[120px] bg-white  rounded-3xl dark:bg-gray-700"
                        contentContainerStyle={{ justifyContent: 'center' }}
                    >
                        <Text className="font-bold mb-1 text-center dark:text-white">{name}</Text>
                        <Text className="text-sm text-center dark:text-white">{DESCRIPTIONS[name]}</Text>
                    </ScrollView>
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

