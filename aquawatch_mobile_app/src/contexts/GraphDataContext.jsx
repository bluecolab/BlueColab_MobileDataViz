import React, { createContext, useState, useEffect, useContext } from 'react';
import { DateTime } from 'luxon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGetWaterData } from '@hooks';

const GraphDataContext = createContext(null);

const GraphDataProvider = ({ children }) => {
    const { fetchData } = useGetWaterData();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [year, setYear] = useState(null);
    const [month, setMonth] = useState(null);
    const [start_day, setStartDay] = useState(null);
    const [end_day, setEndDay] = useState(null);

    const [defaultLocation, setDefaultLocation] = useState(null); // the saved location in settings
    const [selectedLocation, setSelectedLocation] = useState(null); // if the user changed location. this is updated
    const [defaultTempUnit, setDefaultTempUnit] = useState(null);

    const changeUnit = (newUnit) => {
        const setStoredTempUnit  = async (value) => {
            try {
                await AsyncStorage.setItem('default-temp-unit', value);
            } catch(e) {
                console.log(e);
            }
        };
        setStoredTempUnit(newUnit);
        setDefaultTempUnit(newUnit);
    };

    const changeLocation = (newLocation) => {
        const setStoredLocation  = async (value) => {
            try {
                await AsyncStorage.setItem('default-location', value);
            } catch(e) {
                console.log(e);
            }
        };
        setStoredLocation (newLocation);
        setDefaultLocation(newLocation);
    };

    useEffect(() => {
        setLoading(true);
        setData([]);
        if (year && month && start_day && end_day && defaultLocation) {
            fetchData(selectedLocation ?? defaultLocation, false, year, month, start_day, end_day, setData, setLoading );
        }
    }, [year, month, start_day, end_day, defaultLocation, selectedLocation]); 

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

        getStoredDefaultLocation();
        getStoredDefaultTempUnit();

        const lastMonth = DateTime.now().minus({ months: 1 });
        setYear(lastMonth.year);
        setMonth(lastMonth.month + 1);
        setStartDay(1);
        setEndDay(lastMonth.daysInMonth);
    }, []);

    return (
        <GraphDataContext.Provider
            value={{
                data,
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
            }}
        >
            {children}
        </GraphDataContext.Provider>
    );
};

export default GraphDataProvider;

export const useGraphData = () => useContext(GraphDataContext);
