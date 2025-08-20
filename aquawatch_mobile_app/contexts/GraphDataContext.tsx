import AsyncStorage from '@react-native-async-storage/async-storage';
import { subMonths, getYear, getMonth, getDaysInMonth } from 'date-fns';
import React, { createContext, useState, useEffect, useContext } from 'react';

import useGetWaterData from '@/hooks/useGetWaterData';
import { CleanedWaterData } from '@/types/water.interface';

interface GraphDataContextType {
    data: CleanedWaterData[] | undefined;
    error: { message: string } | undefined;
    loading: boolean;
    defaultLocation: string | undefined;
    defaultTempUnit: string | undefined;
    selectedLocationTemp: string | undefined;
    changeLocation: (newLocation: string) => void;
    setLoading: (newValue: boolean) => void;
    setYear: (newValue: number | undefined) => void;
    setMonth: (newValue: number | undefined) => void;
    setEndDay: (newValue: number | undefined) => void;
    setDefaultLocation: (newValue: string | undefined) => void;
    changeUnit: (newUnit: string) => void;
    setSelectedLocationTemp: (newValue: string | undefined) => void;
}

const GraphDataContext = createContext({
    data: undefined,
    error: undefined,
    loading: false,
    defaultLocation: undefined as string | undefined,
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

    const [data, setData] = useState<CleanedWaterData[] | undefined>([]);
    const [error, setError] = useState<{ message: string } | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);

    const [year, setYear] = useState<number>();
    const [month, setMonth] = useState<number>();
    const [start_day, setStartDay] = useState<number>();
    const [end_day, setEndDay] = useState<number>();

    const [defaultLocation, setDefaultLocation] = useState<string>(); // the saved location in settings
    const [selectedLocation, setSelectedLocation] = useState<string>(); // if the user changed location. this is updated
    const [defaultTempUnit, setDefaultTempUnit] = useState<string>();

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

    const changeLocation = (newLocation: string) => {
        const setStoredLocation = async (value: string) => {
            try {
                await AsyncStorage.setItem('default-location', value);
            } catch (e) {
                console.log(e);
            }
        };
        void setStoredLocation(newLocation);
        setDefaultLocation(newLocation);
    };

    useEffect(() => {
        setLoading(true);
        setData([]);
        if (year && month && start_day && end_day && defaultLocation) {
            fetchData(
                selectedLocation ?? defaultLocation,
                false,
                year,
                month,
                start_day,
                end_day,
                setData,
                setLoading,
                setError
            );
        }
    }, [year, month, start_day, end_day, defaultLocation, selectedLocation, fetchData]);

    useEffect(() => {
        const getStoredDefaultLocation = async () => {
            try {
                const value = await AsyncStorage.getItem('default-location');
                if (value !== null) {
                    console.log(`Stored value: ${value}`);
                    setDefaultLocation(value);
                } else {
                    setDefaultLocation('Choate Pond');
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
        setMonth(getMonth(lastMonth) + 1); // `getMonth` is 0-indexed, so add 1
        setStartDay(1);
        setEndDay(getDaysInMonth(lastMonth));
    }, []);

    return (
        <GraphDataContext.Provider
            value={{
                data,
                error,
                loading,
                defaultLocation,
                defaultTempUnit,
                selectedLocationTemp: selectedLocation,
                changeLocation,
                setLoading,
                setYear,
                setMonth,
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
