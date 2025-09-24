import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

import { useGraphData } from '@/contexts/GraphDataContext';
import useGetWaterData from '@/hooks/useGetWaterData';
import { LocationType } from '@/types/config.interface';
import { CleanedWaterData } from '@/types/water.interface';
import { useQuery } from '@tanstack/react-query';

interface CurrentDataContextType {
    data: CleanedWaterData[] | undefined;
    error: Error | null;
    defaultLocation: LocationType | undefined;
    defaultTempUnit: string | undefined;
    loadingCurrent: boolean;
}

const CurrentDataContext = createContext({
    data: undefined,
    error: null,
    defaultLocation: undefined as LocationType | undefined,
    defaultTempUnit: undefined as string | undefined,
    loadingCurrent: false,
} as CurrentDataContextType);

export default function CurrentDataProvider({ children }: { children: ReactNode }) {
    const { defaultLocation, defaultTempUnit } = useGraphData();
    const { fetchData } = useGetWaterData();

    // The useQuery hook replaces useState, useEffect, and setInterval
    const {
        data,
        error,
        isLoading: loadingCurrent, // Alias isLoading to match your existing context
    } = useQuery({
        // 1. Query Key: Uniquely identifies this data.
        // It automatically refetches when `defaultLocation` changes.
        queryKey: ['currentWaterData', defaultLocation],

        // 2. Query Function: Must be a function that returns a promise.
        queryFn: () => fetchData(defaultLocation!, true, 0, 0, 0, 0),

        // 3. Options
        // The query will not run until `defaultLocation` exists.
        enabled: !!defaultLocation,

        // Replaces your setInterval logic to refetch every 15 minutes.
        // This is simpler and achieves the goal of keeping data fresh.
        refetchInterval: 15 * 60 * 1000,
    });

    return (
        <CurrentDataContext.Provider
            value={{ data, error, defaultLocation, defaultTempUnit, loadingCurrent }}>
            {children}
        </CurrentDataContext.Provider>
    );
}

export const useCurrentData = () => useContext(CurrentDataContext);
