import { useRef, useState } from "react";
import { Animated, Dimensions, View, Text, TouchableOpacity } from "react-native";
import { useIsDark } from "@/contexts/ColorSchemeContext";
import { FontAwesome } from "@expo/vector-icons";
import useDataCleaner from "@/hooks/useDataCleaner";
import { MonthlyDataCardBack } from "./MonthlyDataCardBack";
import { MonthlyDataCardFront } from "./MonthlyDataCardFront";

interface MonthlyDataCardProps {
    loading: boolean;
    yAxisLabel: string;
    data: any;
    unit: string;
    meta: {
        description: string;
        reason: string;
        ref: {
            label: string;
            link: string;
        }[];
    };
    defaultTempUnit: string | undefined;
    unitMap: Record<string, string | null>;
    alternateName?: string;
    selectedMonth: string
}

export function MonthlyDataCard({
    loading,
    yAxisLabel,
    data,
    unit,
    meta,
    defaultTempUnit,
    unitMap,
    alternateName,
    selectedMonth
}: MonthlyDataCardProps ) {
    const finalUnitToUse = unitMap[unit] === null ? alternateName : unit;

    const { clean } = useDataCleaner();
    const dataSummary = clean(data, loading, unit, defaultTempUnit );

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
                    <Text className="rounded-3xl bg-white p-1 text-center text-2xl font-bold dark:bg-gray-700 dark:text-white">
                        {yAxisLabel}{' '}
                        {unitMap && finalUnitToUse !== 'pH'
                            ? `- ${
                                  finalUnitToUse === 'Temp'
                                      ? defaultTempUnit?.trim() === 'Fahrenheit'
                                          ? '°F'
                                          : unitMap[finalUnitToUse]
                                      : unitMap[finalUnitToUse ?? "Temp"]
                              }`
                            : ''}
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
                <View className="z-10 w-[95%] self-center">
                    <View className="h-[300]">
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
                                <MonthlyDataCardFront 
                                    dailySummary={dataSummary.dailySummary} 
                                    error={dataSummary.error}
                                    month={selectedMonth}
                                />                            
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
                                <MonthlyDataCardBack 
                                    overallMin={dataSummary.overallMin} 
                                    overallMax={dataSummary.overallMax}
                                    overallAvg={dataSummary.overallAvg}
                                    yAxisLabel={yAxisLabel}
                                    meta={meta} />
                        </Animated.View>
                    </View>
                </View>
            </View>
        </View>
    );
}
