import { FontAwesome } from '@expo/vector-icons';
import { useMemo, useRef } from 'react';
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
    unitMap: Record<string, string | null>;
    alternateName?: string;
    selectedMonth: string;
    showConvertedUnits?: boolean;
}

export function MonthlyDataCard({
    loading,
    yAxisLabel,
    data,
    error,
    unit,
    meta,
    defaultTempUnit,
    unitMap,
    alternateName,
    selectedMonth,
    showConvertedUnits,
}: MonthlyDataCardProps) {
    const finalUnitToUse = unitMap[unit] === null ? alternateName : unit;
    const { generateDataSummary } = dataUtils();

    // Conversion helpers for historical data
    const uscmToPpt = (uscm: number) => uscm * 0.00055;
    const fnuToNtu = (fnu: number) => fnu;
    const psuToPpt = (psu: number) => psu;

    // Apply conversions only to the active unit when toggled on
    const convertedData = useMemo(() => {
        if (!showConvertedUnits || !data) return data;

        return data.map((item) => {
            const next = { ...item };
            switch (unit) {
                case 'Cond':
                    if (typeof item.Cond === 'number' && unitMap.Cond === 'µS/cm') {
                        next.Cond = uscmToPpt(item.Cond);
                    }
                    break;
                case 'Turb':
                    if (typeof item.Turb === 'number' && unitMap.Turb === 'FNU') {
                        next.Turb = fnuToNtu(item.Turb);
                    }
                    break;
                case 'Sal':
                    if (typeof item.Sal === 'number' && unitMap.Sal === 'PSU') {
                        next.Sal = psuToPpt(item.Sal);
                    }
                    break;
                default:
                    break;
            }
            return next;
        });
    }, [showConvertedUnits, data, unit, unitMap]);

    const dataSummary = generateDataSummary(convertedData, loading, unit, defaultTempUnit);

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
                            ? (() => {
                                  if (finalUnitToUse === 'Temp') {
                                      return `- ${
                                          defaultTempUnit?.trim() === 'Fahrenheit'
                                              ? '°F'
                                              : unitMap[finalUnitToUse]
                                      }`;
                                  }

                                  let displayUnit = unitMap[finalUnitToUse ?? 'Temp'];
                                  if (showConvertedUnits) {
                                      if (finalUnitToUse === 'Cond' && unitMap.Cond === 'µS/cm') {
                                          displayUnit = 'ppt';
                                      } else if (
                                          finalUnitToUse === 'Turb' &&
                                          unitMap.Turb === 'FNU'
                                      ) {
                                          displayUnit = 'NTU';
                                      } else if (
                                          finalUnitToUse === 'Sal' &&
                                          unitMap.Sal === 'PSU'
                                      ) {
                                          displayUnit = 'ppt';
                                      }
                                  }
                                  return `- ${displayUnit}`;
                              })()
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
