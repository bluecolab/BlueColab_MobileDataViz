import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import { subMonths, getYear, getMonth, getDaysInMonth } from 'date-fns';
import React, { createContext, useState, useEffect, useContext } from 'react';

import useGetWaterData from '@/hooks/useGetWaterData';
import { LocationType } from '@/types/config.interface';
import { CleanedWaterData } from '@/types/water.interface';
// ... other imports

interface GraphDataContextType {
    data: CleanedWaterData[] | undefined;
    error: { message: string } | undefined;
    loading: boolean;
    defaultLocation: LocationType | undefined;
    defaultTempUnit: string | undefined;
    selectedLocationTemp: string | undefined;
    changeLocation: (newLocation: LocationType) => void;
    setLoading: (newValue: boolean) => void;
    setYear: (newValue: number | undefined) => void;
    setMonth: (newValue: number | undefined) => void;
    setEndDay: (newValue: number | undefined) => void;
    setDefaultLocation: (newValue: LocationType | undefined) => void;
    changeUnit: (newUnit: string) => void;
    setSelectedLocationTemp: (newValue: LocationType | undefined) => void;
}

const GraphDataContext = createContext({
    data: undefined,
    error: undefined,
    loading: false,
    defaultLocation: undefined as LocationType | undefined,
    defaultTempUnit: undefined as string | undefined,
    selectedLocationTemp: undefined as string | undefined,
    changeLocation: () => {},
    setLoading: () => {},
    setYear: () => {},
    setMonth: () => {},
    setEndDay: () => {},
    setDefaultLocation: () => {},
    changeUnit: () => {},
    setSelectedLocationTemp: () => {},
} as GraphDataContextType);
export default function GraphDataProvider({ children }: { children: React.ReactNode }) {
    const { fetchData } = useGetWaterData();

    // 1. State for server data is removed. No more useState for data, error, loading.
    // const [data, setData] = useState<CleanedWaterData[] | undefined>([]);
    // const [error, setError] = useState<{ message: string } | undefined>(undefined);
    // const [loading, setLoading] = useState<boolean>(true);

    // 2. State for user selections (filters) remains the same.
    const [year, setYear] = useState<number>();
    const [month, setMonth] = useState<number>();
    const [startDay, setStartDay] = useState<number>();
    const [endDay, setEndDay] = useState<number>();
    const [defaultLocation, setDefaultLocation] = useState<LocationType>();
    const [selectedLocation, setSelectedLocation] = useState<LocationType>();
    const [defaultTempUnit, setDefaultTempUnit] = useState<string>();

    // Determine the active location to be used in the query.
    const activeLocation = selectedLocation ?? defaultLocation;

    // 3. The useQuery hook replaces the main data-fetching useEffect.
    const {
        data,
        error,
        isLoading: loading, // Alias isLoading to loading
    } = useQuery({
        // The query key includes all variables that the data depends on.
        // React Query will automatically refetch when any of these change.
        queryKey: ['graphWaterData', activeLocation, year, month, startDay, endDay],

        // The query function calls your fetcher with the current state values.
        queryFn: () => fetchData(activeLocation!, false, year!, month!, startDay!, endDay!),

        // This query will only run when all its dependencies have values.
        enabled: !!(activeLocation && year && month && startDay && endDay),
    });

    const changeUnit = (newUnit: string) => {
        const setStoredTempUnit = async (value: string) => {
            try {
                await AsyncStorage.setItem('default-temp-unit', value);
            } catch (e) {
                console.log(e);
            }
        };
        void setStoredTempUnit(newUnit);
        setDefaultTempUnit(newUnit);
    };

    const changeLocation = (newLocation: LocationType) => {
        const setStoredLocation = async (value: LocationType) => {
            try {
                await AsyncStorage.setItem('default-location', JSON.stringify(value));
            } catch (e) {
                console.log(e);
            }
        };
        void setStoredLocation(newLocation);
        setDefaultLocation(newLocation);
    };

    // The initial useEffect to load settings and set the default date remains the same.
    useEffect(() => {
        const getStoredDefaultLocation = async () => {
            try {
                const value = await AsyncStorage.getItem('default-location');
                if (value !== null) {
                    console.log(`Stored value: ${value}`);
                    setDefaultLocation(JSON.parse(value));
                } else {
                    setDefaultLocation({ name: 'Choate Pond', lat: 41.127494, long: -73.808235 });
                }
            } catch (e) {
                console.error(e);
            }
        };

        const getStoredDefaultTempUnit = async () => {
            try {
                const value = await AsyncStorage.getItem('default-temp-unit');
                if (value !== null) {
                    console.log(`Stored value: ${value}`);
                    setDefaultTempUnit(value);
                } else {
                    setDefaultTempUnit('Fahrenheit');
                }
            } catch (e) {
                console.error(e);
            }
        };

        void getStoredDefaultLocation();
        void getStoredDefaultTempUnit();

        const lastMonth = subMonths(new Date(), 1);
        setYear(getYear(lastMonth));
        setMonth(getMonth(lastMonth) + 1);
        setStartDay(1);
        setEndDay(getDaysInMonth(lastMonth));
    }, []);

    return (
        <GraphDataContext.Provider
            value={{
                // Values from useQuery
                data,
                error: error ? { message: error.message } : undefined,
                loading,
                // State and setters that remain
                defaultLocation,
                defaultTempUnit,
                selectedLocationTemp: selectedLocation?.name,
                changeLocation,
                setYear,
                setMonth,
                // Note: You probably don't need to expose setLoading anymore
                // as React Query handles it. It's kept here for compatibility.
                setLoading: () => {},
                setEndDay,
                setDefaultLocation,
                changeUnit,
                setSelectedLocationTemp: setSelectedLocation,
            }}>
            {children}
        </GraphDataContext.Provider>
    );
}

export const useGraphData = () => useContext(GraphDataContext);
