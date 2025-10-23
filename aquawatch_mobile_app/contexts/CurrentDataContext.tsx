import { useQuery } from '@tanstack/react-query';
import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';

import { useGraphData } from '@/contexts/GraphDataContext';
import { config } from '@/hooks/useConfig';
import useGetAQIData from '@/hooks/useGetAQIData';
import useGetOdinData from '@/hooks/useGetOdinData';
import useGetWaterData from '@/hooks/useGetWaterData';
import { LocationType } from '@/types/config.interface';
import { CleanedWaterData, OdinData, OpenWeatherAQI } from '@/types/water.interface';

interface CurrentDataContextType {
    data: CleanedWaterData[] | undefined; // This stays the same
    airData?: OdinData | undefined;
    aqiData?: OpenWeatherAQI | undefined;
    error: Error | null;
    defaultLocation: LocationType | undefined;
    defaultTempUnit: string | undefined;
    loadingCurrent: boolean;
    refetchCurrent: () => void;
}

const CurrentDataContext = createContext({
    data: undefined,
    error: null,
    defaultLocation: undefined as LocationType | undefined,
    defaultTempUnit: undefined as string | undefined,
    loadingCurrent: false,
    refetchCurrent: () => {},
} as CurrentDataContextType);

export default function CurrentDataProvider({ children }: { children: ReactNode }) {
    const { defaultLocation, defaultTempUnit } = useGraphData();
    const { fetchData } = useGetWaterData();
    const { fetchOdinData } = useGetOdinData();
    const { fetchAQIData } = useGetAQIData();

    // Build a stable query key for current data
    const queryKey = useMemo(
        () => ['currentData', defaultLocation?.name, defaultTempUnit],
        [defaultLocation?.name, defaultTempUnit]
    );

    const { data, error, isFetching, isPending, refetch } = useQuery<CleanedWaterData[], Error>({
        queryKey,
        enabled: !!defaultLocation,
        queryFn: async () => {
            // DefaultLocation is guaranteed by enabled
            return await fetchData(defaultLocation as LocationType, true, 0, 0, 0, 0);
        },
        // Keep showing previous data while fetching new
        placeholderData: [],
        gcTime: 1000 * 60 * 5, // 5 minutes
        staleTime: 1000 * 30, // consider fresh for 30s; UI can override
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        retry: 1,
    });

    // Manual refetch exposed to consumers
    const refetchCurrent = () => {
        if (!defaultLocation) return;
        void refetch();
    };

    const { data: airData } = useQuery({
        queryKey: ['airData', defaultLocation],
        queryFn: () => fetchOdinData(),
        enabled: !!defaultLocation && defaultLocation.name === 'Choate Pond',
        refetchInterval: 15 * 60 * 1000,
    });

    const allLatLongs = [
        ...config.BLUE_COLAB_API_CONFIG.validMatches,
        ...config.USGS_WATER_SERVICES_API_CONFIG.validMatches,
    ];
    const locationWithCoords =
        allLatLongs.find(
            (loc) =>
                loc.name === defaultLocation?.name &&
                loc.lat !== undefined &&
                loc.long !== undefined
        ) ?? config.BLUE_COLAB_API_CONFIG.validMatches[0];

    const { data: aqiData } = useQuery({
        queryKey: ['aqiData', defaultLocation],
        queryFn: () =>
            fetchAQIData(locationWithCoords.lat as number, locationWithCoords.long as number),
        enabled: !!defaultLocation,
    });

    return (
        <CurrentDataContext.Provider
            value={{
                data: data ?? [],
                airData: airData,
                aqiData: aqiData,
                error: error ?? null,
                defaultLocation,
                defaultTempUnit,
                loadingCurrent: isFetching || isPending,
                refetchCurrent,
            }}>
            {children}
        </CurrentDataContext.Provider>
    );
}

export const useCurrentData = () => useContext(CurrentDataContext);
