import { useMemo, useRef } from 'react';
import { Dimensions, View, Pressable } from 'react-native';

import FlipCard from '@/components/customCards/FlipCard';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useGraphData } from '@/contexts/GraphDataContext';
import { ErrorType } from '@/types/error.interface';
import { CleanedWaterData } from '@/types/water.interface';
import dataUtils from '@/utils/dataUtils';
import normalize from '@/utils/normalize';

import { MonthlyDataCardBack } from './MonthlyDataCardBack';
import { MonthlyDataCardFront } from './MonthlyDataCardFront';

const titleLabel = (
    unitMap: Record<string, string | null>,
    finalUnitToUse: string | undefined,
    showConvertedUnits: boolean | undefined,
    defaultTempUnit: string | undefined,
    yAxisLabel: string
): string => {
    if (!unitMap || finalUnitToUse === 'pH') return `${yAxisLabel}`;

    if (finalUnitToUse === 'Temp') {
        return `${yAxisLabel} - ${defaultTempUnit?.trim() === 'Fahrenheit' ? '°F' : unitMap[finalUnitToUse]}`;
    }

    let displayUnit = unitMap[finalUnitToUse ?? 'Temp'];
    if (showConvertedUnits) {
        if (finalUnitToUse === 'Cond' && unitMap.Cond === 'µS/cm') {
            displayUnit = 'ppt';
        } else if (finalUnitToUse === 'Turb' && unitMap.Turb === 'FNU') {
            displayUnit = 'NTU';
        } else if (finalUnitToUse === 'Sal' && unitMap.Sal === 'PSU') {
            displayUnit = 'ppt';
        }
    }
    return `${yAxisLabel} - ${displayUnit}`;
};

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
    normalizeComparative?: boolean;
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
    normalizeComparative,
}: MonthlyDataCardProps) {
    const finalUnitToUse = unitMap[unit] === null ? alternateName : unit;
    const { generateDataSummary } = dataUtils();
    const { normalizeDailySummary } = normalize();
    const { normalizeComparative: normalizeComparativeFromContext } = useGraphData();

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

    const rawDataSummary = generateDataSummary(convertedData, loading, unit, defaultTempUnit);
    const isNormalized = (normalizeComparative ?? normalizeComparativeFromContext) && !loading;
    const normalizedDaily = useMemo(() => {
        if (!isNormalized) return rawDataSummary.dailySummary;
        const { daily } = normalizeDailySummary(rawDataSummary.dailySummary);
        return daily;
    }, [isNormalized, rawDataSummary.dailySummary, normalizeDailySummary]);

    const { width } = Dimensions.get('window');
    const containerWidth = width * 0.95;

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
                                  const normalizedLabel = isNormalized ? ' (normalized 0–1)' : '';
                                  return `- ${displayUnit}${normalizedLabel}`;
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
                <View className="z-10 h-[340] w-[95%] self-center">
                    {/* Front View - Graph */}
                    <FlipCard
                        Front={
                            <Pressable onPress={flipCard} style={{ flex: 1 }}>
                                <MonthlyDataCardFront
                                    loading={loading}
                                    dailySummary={normalizedDaily}
                                    error={error}
                                    month={selectedMonth}
                                    title={titleLabel(
                                        unitMap,
                                        finalUnitToUse,
                                        showConvertedUnits,
                                        defaultTempUnit,
                                        yAxisLabel
                                    )}
                                />
                            </Pressable>
                        }
                        Back={
                            <Pressable onPress={flipCard} style={{ flex: 1 }}>
                                <MonthlyDataCardBack
                                    overallMin={rawDataSummary.overallMin}
                                    overallMax={rawDataSummary.overallMax}
                                    overallAvg={rawDataSummary.overallAvg}
                                    yAxisLabel={yAxisLabel}
                                    meta={meta}
                                    flipCard={flipCard}
                                    title={titleLabel(
                                        unitMap,
                                        finalUnitToUse,
                                        showConvertedUnits,
                                        defaultTempUnit,
                                        yAxisLabel
                                    )}
                                />
                            </Pressable>
                        }
                        flipCardRef={flipCardRef}
                        frontStyles={{ marginTop: 5, width: containerWidth, height: '100%' }}
                        backStyles={{ marginTop: 5, width: containerWidth }}
                    />
                </View>
            </View>
        </View>
    );
}
