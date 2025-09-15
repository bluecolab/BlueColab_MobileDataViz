import { FontAwesome } from '@expo/vector-icons';
import { useRef } from 'react';
import { Dimensions, View, Text, TouchableOpacity } from 'react-native';

import FlipCard from '@/components/customCards/FlipCard';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { ErrorType } from '@/types/error.interface';
import { CleanedWaterData } from '@/types/water.interface';
import dataUtils from '@/utils/dataUtils';

import { MonthlyDataCardBack } from './MonthlyDataCardBack';
import { MonthlyDataCardFront } from './MonthlyDataCardFront';

interface MonthlyDataCardProps {
    loading: boolean;
    yAxisLabel: string;
    data: CleanedWaterData[] | undefined;
    error: ErrorType | undefined;
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
    defaultUnitConversion: boolean | undefined;
    defaultLocation: string | undefined;
    unitMap: Record<string, string | null>;
    alternateName?: string;
    selectedMonth: string;
}

export function MonthlyDataCard({
    loading,
    yAxisLabel,
    data,
    error,
    unit,
    meta,
    defaultTempUnit,
    defaultUnitConversion,
    defaultLocation,
    unitMap,
    alternateName,
    selectedMonth,
}: MonthlyDataCardProps) {
    const finalUnitToUse = unitMap[unit] === null ? alternateName : unit;

    const { generateDataSummary } = dataUtils();
    const dataSummary = generateDataSummary(
        data,
        loading,
        unit,
        defaultTempUnit,
        defaultUnitConversion,
        defaultLocation
    );

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
                    <Text className="rounded-3xl bg-white p-1 text-center text-2xl font-bold dark:bg-gray-700 dark:text-white">
                        {yAxisLabel}{' '}
                        {unitMap && finalUnitToUse !== 'pH'
                            ? `- ${
                                  finalUnitToUse === 'Temp'
                                      ? defaultTempUnit?.trim() === 'Fahrenheit'
                                          ? '°F'
                                          : unitMap[finalUnitToUse]
                                      : unitMap[finalUnitToUse ?? 'Temp']
                              }`
                            : ''}
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
                <View className="z-10 w-[95%] self-center">
                    <View className="h-[300]">
                        {/* Front View - Graph */}
                        <FlipCard
                            Front={
                                <MonthlyDataCardFront
                                    loading={loading}
                                    dailySummary={dataSummary.dailySummary}
                                    error={error}
                                    month={selectedMonth}
                                />
                            }
                            Back={
                                <MonthlyDataCardBack
                                    overallMin={dataSummary.overallMin}
                                    overallMax={dataSummary.overallMax}
                                    overallAvg={dataSummary.overallAvg}
                                    yAxisLabel={yAxisLabel}
                                    meta={meta}
                                />
                            }
                            flipCardRef={flipCardRef}
                            frontStyles={{ marginTop: 5, width: containerWidth, height: '100%' }}
                            backStyles={{ marginTop: 5, width: containerWidth }}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}
