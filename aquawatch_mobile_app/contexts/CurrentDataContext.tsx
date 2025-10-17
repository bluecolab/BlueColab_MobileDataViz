import { useQuery } from '@tanstack/react-query';
import { getMinutes } from 'date-fns';
import { createContext, useContext, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';

import { useGraphData } from '@/contexts/GraphDataContext';
import useGetOdinData from '@/hooks/useGetOdinData';
import useGetWaterData from '@/hooks/useGetWaterData';
import { LocationType } from '@/types/config.interface';
import { CleanedWaterData, OdinData } from '@/types/water.interface';

interface CurrentDataContextType {
    data: CleanedWaterData[] | undefined; // This stays the same
    airData?: OdinData | undefined;
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
    const { fetchDataPromise } = useGetWaterData();

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
            return await fetchDataPromise(defaultLocation as LocationType, true, 0, 0, 0, 0);
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

    // Quarter-hour aligned auto-refresh: every 60s check and refetch on 0/15/30/45
    useEffect(() => {
        if (!defaultLocation) return;
        const intervalId = setInterval(() => {
            const currentMinute = getMinutes(new Date());
            if ([0, 15, 30, 45].includes(currentMinute)) {
                void refetch();
            }
        }, 60_000);
        return () => clearInterval(intervalId);
    }, [defaultLocation, refetch]);

    return (
        <CurrentDataContext.Provider
            value={{
                data: data ?? [],
                error: error ? { message: error.message } : undefined,
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
