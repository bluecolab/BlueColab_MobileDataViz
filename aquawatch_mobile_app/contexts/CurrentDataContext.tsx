import { DateTime } from 'luxon';
import { createContext, useContext, useState, useEffect } from 'react';

import { useGraphData } from '@/contexts/GraphDataContext';
import useGetWaterData from '@/hooks/useGetWaterData';

interface CurrentDataContextType {
    data: any[];
    defaultLocation?: string;
    defaultTempUnit?: string;
    loadingCurrent?: boolean;
}

const CurrentDataContext = createContext({
    data: [] as any[],
    defaultLocation: undefined as string | undefined,
    defaultTempUnit: undefined as string | undefined,
    loadingCurrent: false,
} as CurrentDataContextType);

export default function CurrentDataProvider({ children }: { children: React.ReactNode }) {
    const { defaultLocation, defaultTempUnit } = useGraphData();
    const { fetchData } = useGetWaterData();

    const [data, setData] = useState([]);
    const [loadingCurrent, setLoading] = useState(true);
    // const [error, setError] = useState(null);

    useEffect(() => {
        const checkTimeAndFetchData = () => {
            const currentTime = DateTime.now();
            const currentMinute = currentTime.minute;

            if (defaultLocation && [0, 15, 30, 45].includes(currentMinute)) {
                fetchData(defaultLocation, true, 0, 0, 0, 0, setData, setLoading);
            }
        };

        const intervalId = setInterval(() => {
            checkTimeAndFetchData();
        }, 60000);

        setLoading(true);
        if (defaultLocation) fetchData(defaultLocation, true, 0, 0, 0, 0, setData, setLoading);

        return () => clearInterval(intervalId);
    }, [defaultLocation, defaultTempUnit, fetchData]);

    return (
        <CurrentDataContext.Provider
            value={{ data, defaultLocation, defaultTempUnit, loadingCurrent }}>
            {children}
        </CurrentDataContext.Provider>
    );
}

export const useCurrentData = () => useContext(CurrentDataContext);
