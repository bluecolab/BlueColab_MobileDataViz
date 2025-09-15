import { getMinutes } from 'date-fns';
import React, { createContext, useContext, useState, useEffect } from 'react';

import { useGraphData } from '@/contexts/GraphDataContext';
import useGetWaterData from '@/hooks/useGetWaterData';
import { CleanedWaterData } from '@/types/water.interface';

interface CurrentDataContextType {
    data: CleanedWaterData[] | undefined;
    error: { message: string } | undefined;
    defaultLocation: string | undefined;
    defaultTempUnit: string | undefined;
    defaultUnitConversion: boolean | undefined;
    loadingCurrent: boolean;
}

const CurrentDataContext = createContext({
    data: undefined,
    error: undefined,
    defaultLocation: undefined as string | undefined,
    defaultTempUnit: undefined as string | undefined,
    defaultUnitConversion: undefined as boolean | undefined,
    loadingCurrent: false,
} as CurrentDataContextType);

export default function CurrentDataProvider({ children }: { children: React.ReactNode }) {
    const { defaultLocation, defaultTempUnit, defaultUnitConversion } = useGraphData();
    const { fetchData } = useGetWaterData();

    const [data, setData] = useState<CleanedWaterData[] | undefined>([]);
    const [error, setError] = useState<{ message: string } | undefined>(undefined);
    const [loadingCurrent, setLoading] = useState(true);

    useEffect(() => {
        const checkTimeAndFetchData = () => {
            const currentMinute = getMinutes(new Date());

            if (defaultLocation && [0, 15, 30, 45].includes(currentMinute)) {
                setData([]);
                fetchData(defaultLocation, true, 0, 0, 0, 0, setData, setLoading, setError);
            }
        };

        const intervalId = setInterval(() => {
            checkTimeAndFetchData();
        }, 60000);

        setLoading(true);
        if (defaultLocation) {
            setData([]);
            fetchData(defaultLocation, true, 0, 0, 0, 0, setData, setLoading, setError);
        }

        return () => clearInterval(intervalId);
    }, [defaultLocation, defaultTempUnit, defaultUnitConversion, fetchData]);

    return (
        <CurrentDataContext.Provider
            value={{ data, error, defaultLocation, defaultTempUnit, defaultUnitConversion, loadingCurrent }}>
            {children}
        </CurrentDataContext.Provider>
    );
}

export const useCurrentData = () => useContext(CurrentDataContext);
