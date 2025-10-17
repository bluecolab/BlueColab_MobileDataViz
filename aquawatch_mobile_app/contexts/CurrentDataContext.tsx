import { useQuery } from '@tanstack/react-query';
import { createContext, useContext } from 'react';
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
    const { fetchOdinData } = useGetOdinData();

    const {
        data: waterData,
        error,
        isLoading: loadingCurrent,
    } = useQuery({
        queryKey: ['waterData', defaultLocation],
        queryFn: () => fetchData(defaultLocation!, true, 0, 0, 0, 0),
        enabled: !!defaultLocation,
        refetchInterval: 15 * 60 * 1000,
    });

    const { data: airData } = useQuery({
        queryKey: ['airData', defaultLocation],
        queryFn: () => fetchOdinData(),
        enabled: !!defaultLocation && defaultLocation.name === 'Choate Pond',
        refetchInterval: 15 * 60 * 1000,
    });

    return (
        <CurrentDataContext.Provider
            value={{
                data: waterData,
                airData: airData,
                error,
                defaultLocation,
                defaultTempUnit,
                loadingCurrent,
            }}>
            {children}
        </CurrentDataContext.Provider>
    );
}

export const useCurrentData = () => useContext(CurrentDataContext);
