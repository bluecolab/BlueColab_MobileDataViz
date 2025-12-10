import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import { subMonths, getYear, getMonth, getDaysInMonth } from 'date-fns';
import React, { createContext, useState, useEffect, useContext } from 'react';

import useGetClosestStation from '@/hooks/useClosestStation';
import { config } from '@/hooks/useConfig';
import useGetWaterData from '@/hooks/useGetWaterData';
import { LocationType } from '@/types/location.type';
import { CleanedWaterData } from '@/types/water.interface';

interface GraphDataContextType {
    data: CleanedWaterData[] | undefined;
    data2?: CleanedWaterData[] | undefined;
    error: { message: string } | undefined;
    error2?: { message: string } | undefined;
    loading: boolean;
    loading2?: boolean;
    defaultLocation: LocationType | undefined;
    defaultLocationName: string | undefined;
    defaultTempUnit: string | undefined;
    selectedLocationTemp: string | undefined;
    selectedLocationTemp2?: string | undefined;
    showConvertedUnits: boolean;
    normalizeComparative: boolean;
    changeLocation: (newLocation: LocationType) => void;
    setLoading: (newValue: boolean) => void;
    setYear: (newValue: number | undefined) => void;
    setMonth: (newValue: number | undefined) => void;
    setEndDay: (newValue: number | undefined) => void;
    setYear2: (newValue: number | undefined) => void;
    setMonth2: (newValue: number | undefined) => void;
    setEndDay2: (newValue: number | undefined) => void;
    setDefaultLocation: (newValue: LocationType | undefined) => void;
    changeTemperatureUnit: (newUnit: string) => void;
    changeConvertedUnits: (enabled: boolean) => void;
    setNormalizeComparative: (enabled: boolean) => void;
    setSelectedLocationTemp: (newValue: LocationType | undefined) => void;
    setSelectedLocationTemp2: (newValue: LocationType | undefined) => void;
}

const GraphDataContext = createContext({
    data: undefined,
    data2: undefined,
    error: undefined,
    error2: undefined,
    loading: false,
    loading2: false,
    defaultLocation: undefined as LocationType | undefined,
    defaultTempUnit: undefined as string | undefined,
    defaultLocationName: undefined as string | undefined,
    selectedLocationTemp: undefined as string | undefined,
    selectedLocationTemp2: undefined as string | undefined,
    showConvertedUnits: false,
    normalizeComparative: false,
    changeLocation: () => {},
    setLoading: () => {},
    setYear: () => {},
    setMonth: () => {},
    setEndDay: () => {},
    setYear2: () => {},
    setMonth2: () => {},
    setEndDay2: () => {},
    setDefaultLocation: () => {},
    changeTemperatureUnit: () => {},
    setSelectedLocationTemp: () => {},
    setSelectedLocationTemp2: () => {},
    changeConvertedUnits: () => {},
    setNormalizeComparative: () => {},
} as GraphDataContextType);
export default function GraphDataProvider({ children }: { children: React.ReactNode }) {
    const { fetchData } = useGetWaterData();

    // 1. State for server data is removed. No more useState for data, error, loading.
    // const [data, setData] = useState<CleanedWaterData[] | undefined>([]);
    // const [error, setError] = useState<{ message: string } | undefined>(undefined);
    // const [loading, setLoading] = useState<boolean>(true);

    const closestStation = useGetClosestStation();

    // 2. State for user selections (filters) remains the same.
    const [year, setYear] = useState<number>();
    const [month, setMonth] = useState<number>();
    const [startDay, setStartDay] = useState<number>();
    const [endDay, setEndDay] = useState<number>();
    // Secondary month/year/day range for comparison
    const [year2, setYear2] = useState<number>();
    const [month2, setMonth2] = useState<number>();
    const [startDay2, setStartDay2] = useState<number>();
    const [endDay2, setEndDay2] = useState<number>();
    const [defaultLocation, setDefaultLocation] = useState<LocationType>();
    const [defaultLocationName, setDefaultLocationName] = useState<string>();

    const [selectedLocation, setSelectedLocation] = useState<LocationType>();
    const [defaultTempUnit, setDefaultTempUnit] = useState<string>();
    const [showConvertedUnits, setShowConvertedUnits] = useState<boolean>(false);
    const [normalizeComparative, setNormalizeComparativeState] = useState<boolean>(false);
    const [selectedLocation2, setSelectedLocation2] = useState<LocationType>();

    // Determine the active location to be used in the query.
    const activeLocation = selectedLocation ?? defaultLocation;
    const activeLocation2 = selectedLocation2;

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

    // Second dataset for comparison (optional)
    const {
        data: data2,
        error: error2,
        isLoading: loading2,
    } = useQuery({
        queryKey: ['graphWaterData2', activeLocation2, year2, month2, startDay2, endDay2],
        queryFn: () => fetchData(activeLocation2!, false, year2!, month2!, startDay2!, endDay2!),
        enabled: !!(activeLocation2 && year2 && month2 && startDay2 && endDay2),
    });

    const changeTemperatureUnit = (newUnit: string) => {
        const setStoredTempUnit = async (value: string) => {
            try {
                await AsyncStorage.setItem('default-temp-unit', value);
            } catch (e) {
                console.error(e);
            }
        };
        void setStoredTempUnit(newUnit);
        setDefaultTempUnit(newUnit);
    };

    const changeLocation = (newLocation: LocationType) => {
        if (newLocation.name == config.USGS_WATER_SERVICES_API_CONFIG.validMatches[0].name) {
            setDefaultLocation(closestStation.closestStation);
        } else {
            const setStoredLocation = async (value: LocationType) => {
                try {
                    await AsyncStorage.setItem('default-location', JSON.stringify(value));
                } catch (e) {
                    console.error(e);
                }
            };
            void setStoredLocation(newLocation);
            setDefaultLocation(newLocation);
        }
    };

    const setNormalizeComparative = (enabled: boolean) => {
        const setStored = async (value: boolean) => {
            try {
                await AsyncStorage.setItem('normalize-comparative', JSON.stringify(value));
            } catch (e) {
                console.error(e);
            }
        };
        void setStored(enabled);
        setNormalizeComparativeState(enabled);
    };

    // The initial useEffect to load settings and set the default date remains the same.

    const changeConvertedUnits = (enabled: boolean) => {
        const setStoredConvertedUnits = async (value: boolean) => {
            try {
                await AsyncStorage.setItem('show-converted-units', JSON.stringify(value));
            } catch (e) {
                console.error(e);
            }
        };
        void setStoredConvertedUnits(enabled);
        setShowConvertedUnits(enabled);
    };

    useEffect(() => {
        const getStoredDefaultLocation = async () => {
            try {
                setDefaultLocation({ name: 'Choate Pond', lat: 41.127494, long: -73.808235 });

                // const value = await AsyncStorage.getItem('default-location');
                // if (value !== null) {
                //     const station: LocationType = JSON.parse(value);
                //     if (
                //         station.name == config.USGS_WATER_SERVICES_API_CONFIG.validMatches[0].name
                //     ) {
                //         setDefaultLocation(closestStation.closestStation);
                //     } else {
                //         setDefaultLocation(station);
                //     }
                // } else {
                //     setDefaultLocation({ name: 'Choate Pond', lat: 41.127494, long: -73.808235 });
                // }
            } catch (e) {
                console.error(e);
            }
        };

        const getStoredDefaultLocationName = async () => {
            try {
                const value = await AsyncStorage.getItem('default-location');
                if (value !== null) {
                    const station: LocationType = JSON.parse(value);
                    setDefaultLocationName(station.name);
                }
            } catch (e) {
                console.error(e);
            }
        };

        const getStoredDefaultTempUnit = async () => {
            try {
                const value = await AsyncStorage.getItem('default-temp-unit');
                if (value !== null) {
                    setDefaultTempUnit(value);
                } else {
                    setDefaultTempUnit('Fahrenheit');
                }
            } catch (e) {
                console.error(e);
            }
        };

        const getStoredConvertedUnits = async () => {
            try {
                const value = await AsyncStorage.getItem('show-converted-units');
                if (value !== null) {
                    setShowConvertedUnits(JSON.parse(value));
                } else {
                    setShowConvertedUnits(false);
                }
            } catch (e) {
                console.error(e);
            }
        };

        const getStoredNormalizeComparative = async () => {
            try {
                const value = await AsyncStorage.getItem('normalize-comparative');
                if (value !== null) {
                    setNormalizeComparativeState(JSON.parse(value));
                } else {
                    setNormalizeComparativeState(false);
                }
            } catch (e) {
                console.error(e);
            }
        };

        void getStoredDefaultLocation();
        void getStoredDefaultTempUnit();
        void getStoredConvertedUnits();
        void getStoredNormalizeComparative();
        void getStoredDefaultLocationName();

        const lastMonth = subMonths(new Date(), 1);
        setYear(getYear(lastMonth));
        setMonth(getMonth(lastMonth) + 1);
        setStartDay(1);
        setEndDay(getDaysInMonth(lastMonth));

        // Initialize secondary date range to mirror primary by default
        const lastMonth2 = subMonths(new Date(), 1);
        setYear2(getYear(lastMonth2));
        setMonth2(getMonth(lastMonth2) + 1);
        setStartDay2(1);
        setEndDay2(getDaysInMonth(lastMonth2));
    }, [closestStation.closestStation]);

    return (
        <GraphDataContext.Provider
            value={{
                // Values from useQuery
                data,
                data2,
                error: error ? { message: error.message } : undefined,
                error2: error2 ? { message: error2.message } : undefined,
                loading,
                loading2,
                // State and setters that remain
                defaultLocation,
                defaultLocationName,
                defaultTempUnit,
                showConvertedUnits,
                selectedLocationTemp: selectedLocation?.name,
                selectedLocationTemp2: selectedLocation2?.name,
                changeLocation,
                setYear,
                setMonth,
                setYear2,
                setMonth2,
                normalizeComparative,
                setLoading: () => {},
                setEndDay,
                setEndDay2,
                setDefaultLocation,
                changeTemperatureUnit,
                setSelectedLocationTemp: setSelectedLocation,
                setSelectedLocationTemp2: setSelectedLocation2,
                changeConvertedUnits,
                setNormalizeComparative,
            }}>
            {children}
        </GraphDataContext.Provider>
    );
}

export const useGraphData = () => useContext(GraphDataContext);
