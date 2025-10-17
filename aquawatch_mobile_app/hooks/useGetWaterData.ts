import axios, { isAxiosError } from 'axios';
import { useNetworkState } from 'expo-network';
import { useCallback, useMemo } from 'react';

import { config, useAPIConfig } from '@/hooks/useConfig';
import { LocationType } from '@/types/config.interface';
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
                    const timestamp = entry.dateTime;
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
        [USGSParameterMappingsEnum]
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

            console.log('Fetching with React Query:', url);

            if (networkState.isInternetReachable === false) {
                setError({
                    message: 'Error: No internet connection',
                });
                setLoading(false);
                return;
            }

            axios
                .get(url)
                .then((response) => {
                    const apiData = response.data;
                    if (
                        BLUE_COLAB_API_CONFIG.validMatches.some(
                            (loc) => loc.name === defaultLocation.name
                        )
                    ) {
                        const cleanedData = cleanChoatePondData(apiData);
                        setData(cleanedData);
                    } else {
                        const cleanedData = cleanHudsonRiverData(apiData);
                        setData(cleanedData);
                    }
                })
                .catch((error) => {
                    if (isAxiosError(error)) {
                        if (error.response) {
                            if ((error.response.data as any)?.status === 404)
                                setError({
                                    message:
                                        'Error: No data available, select a different date range',
                                    code: 404,
                                });
                            else
                                setError({
                                    message: `Error: HTTP Error: ${error.response.status}`,
                                });
                        } else if (error.request) {
                            setError({
                                message: 'Error: No response from server, check WiFi connection',
                            });
                        } else {
                            setError({
                                message: `Error: A unknown error occurred, try restarting the app.`,
                            });
                        }
                        console.error('Axios error: ', error);
                    } else {
                        console.error('Non-Axios error: ', error);
                        setError({ message: 'Unknown error occurred' });
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [
            BLUE_COLAB_API_CONFIG.validMatches,
            cleanChoatePondData,
            cleanHudsonRiverData,
            getAPIUrl,
            networkState.isInternetReachable,
            stationIds,
        ]
    );

    // Promise-based fetcher for React Query
    const fetchDataPromise = useCallback(
        async (
            defaultLocation: LocationType,
            isCurrentData: boolean,
            year: number,
            month: number,
            start_day: number,
            end_day: number
        ): Promise<CleanedWaterData[]> => {
            const url = getAPIUrl(
                defaultLocation,
                isCurrentData,
                year,
                month,
                start_day,
                end_day,
                stationIds
            );

            if (networkState.isInternetReachable === false) {
                throw new Error('Error: No internet connection');
            }

            try {
                const response = await axios.get(url);
                const apiData = response.data;
                if (
                    BLUE_COLAB_API_CONFIG.validMatches.some(
                        (loc) => loc.name === defaultLocation.name
                    )
                ) {
                    return cleanChoatePondData(apiData);
                }
                return cleanHudsonRiverData(apiData);
            } catch (error) {
                if (isAxiosError(error)) {
                    if ((error as any).response) {
                        const resp = (error as any).response;
                        if (resp.data?.status === 404) {
                            throw new Error(
                                'Error: No data available, select a different date range'
                            );
                        }
                        throw new Error(`Error: HTTP Error: ${resp.status}`);
                    } else if ((error as any).request) {
                        throw new Error('Error: No response from server, check WiFi connection');
                    }
                    throw new Error('Error: A unknown error occurred, try restarting the app.');
                }
                throw new Error('Unknown error occurred');
            }
        },
        [
            BLUE_COLAB_API_CONFIG.validMatches,
            cleanChoatePondData,
            cleanHudsonRiverData,
            getAPIUrl,
            networkState.isInternetReachable,
            stationIds,
        ]
    );

    return {
        fetchData,
        fetchDataPromise,
    };
}
