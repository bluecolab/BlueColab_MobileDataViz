import axios, { isAxiosError } from 'axios';
import { useNetworkState } from 'expo-network';
import { useCallback, useMemo } from 'react';

import { config, useAPIConfig } from '@/hooks/useConfig';
import { LocationType } from '@/types/location.type';
import {
    CleanedWaterData,
    WaterServicesData,
    ParameterName,
    TimeSeries,
    BlueCoLabData,
} from '@/types/water.interface';
import getMetadata from '@/utils/getMetadata';

export default function useGetWaterData() {
    const { usgsParameterMappings, stationIds } = getMetadata();
    const { BLUE_COLAB_API_CONFIG } = config;
    const { getAPIUrl } = useAPIConfig();

    const networkState = useNetworkState();

    const USGSParameterMappingsEnum = useMemo(
        () =>
            Object.fromEntries(
                Object.entries(usgsParameterMappings).map(([key, value]) => [key, value])
            ) as { [key: string]: string },
        [usgsParameterMappings]
    );

    /**
     * Rounds a timestamp to the nearest 15-minute interval
     * @param timestamp - ISO 8601 timestamp string
     * @returns Rounded timestamp string
     */
    const roundToNearest15Minutes = useCallback((timestamp: string): string => {
        const date = new Date(timestamp);
        const minutes = date.getMinutes();
        const roundedMinutes = Math.round(minutes / 15) * 15;

        date.setMinutes(roundedMinutes);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date.toISOString();
    }, []);

    const cleanHudsonRiverData = useCallback(
        (rawData: WaterServicesData) => {
            if (!rawData?.value?.timeSeries) {
                console.error('Here Invalid data format');
                return [];
            }

            const parsedData: CleanedWaterData[] = [];

            rawData.value.timeSeries.forEach((series: TimeSeries) => {
                const paramCode = series.variable.variableCode[0].value;
                const paramName = USGSParameterMappingsEnum[paramCode];

                if (!paramName) return; // Skip unneeded parameters

                const valuesList =
                    series.values[0].value.length > 0
                        ? series.values[0].value
                        : (series.values[1]?.value ?? []);

                valuesList.forEach((entry) => {
                    const rawTimestamp = entry.dateTime;
                    const timestamp = roundToNearest15Minutes(rawTimestamp);
                    const value = parseFloat(entry.value);

                    let existingEntry = parsedData.find((data) => data.timestamp === timestamp);

                    if (!existingEntry) {
                        existingEntry = {
                            timestamp,
                        } as CleanedWaterData;
                        parsedData.push(existingEntry);
                    }
                    (existingEntry as any)[paramName as ParameterName] = value;
                });
            });

            return parsedData;
        },
        [USGSParameterMappingsEnum, roundToNearest15Minutes]
    );

    const cleanChoatePondData = useCallback((rawData: BlueCoLabData[]) => {
        return rawData.map((item: BlueCoLabData) => {
            const { sensors, timestamp } = item;
            return { timestamp, ...sensors } as CleanedWaterData;
        });
    }, []);

    // Legacy setter-based fetch function (used by GraphDataContext, etc.)
    const fetchData = useCallback(
        async (
            defaultLocation: LocationType,
            isCurrentData: boolean,
            year: number,
            month: number,
            start_day: number,
            end_day: number
        ): Promise<CleanedWaterData[]> => {
            if (networkState.isInternetReachable === false) {
                throw new Error('No internet connection');
            }

            const url = getAPIUrl(
                defaultLocation,
                isCurrentData,
                year,
                month,
                start_day,
                end_day,
                stationIds
            );

            try {
                const response = await axios.get(url);
                const apiData = response.data;
                const isBlueColab = BLUE_COLAB_API_CONFIG.validMatches.some(
                    (loc) => loc.name === defaultLocation.name
                );
                const isUSGS = config.USGS_WATER_SERVICES_API_CONFIG.validMatches.some(
                    (loc) => loc.name === defaultLocation.name
                );

                if (isBlueColab) {
                    return cleanChoatePondData(apiData);
                }
                if (isUSGS) {
                    return cleanHudsonRiverData(apiData);
                }

                // Fallback mirrors getAPIUrl() else branch which uses BlueCoLab default measurement
                return cleanChoatePondData(apiData);
            } catch (error) {
                // Log the original error for debugging
                console.error('Data fetching error:', error);

                // Re-throw a new, user-friendly error for React Query to catch
                if (isAxiosError(error)) {
                    if (error.response?.status === 404) {
                        throw new Error('No data available for the selected date range.');
                    }
                    if (error.response) {
                        throw new Error(`HTTP Error: ${error.response.status}`);
                    }
                    if (error.request) {
                        throw new Error('No response from server. Check your network connection.');
                    }
                }
                throw new Error('An unknown error occurred while fetching data.');
            }
        },
        [
            getAPIUrl,
            stationIds,
            networkState.isInternetReachable,
            BLUE_COLAB_API_CONFIG.validMatches,
            cleanChoatePondData,
            cleanHudsonRiverData,
        ]
    );

    return {
        fetchData, // Export the new promise-based function
    };
}
