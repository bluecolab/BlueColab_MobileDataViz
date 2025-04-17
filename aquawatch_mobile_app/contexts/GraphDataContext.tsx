import AsyncStorage from '@react-native-async-storage/async-storage';
import { DateTime } from 'luxon';
import React, { createContext, useState, useEffect, useContext } from 'react';

import useGetWaterData from '@/hooks/useGetWaterData';

interface GraphDataContextType {
  data: Record<string, { timestamp: string; [key: string]: number | string }>[];
  loading: boolean;
  defaultLocation?: string;
  defaultTempUnit?: string;
  selectedLocationTemp?: string;
  changeLocation: (newLocation: string) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setYear: React.Dispatch<React.SetStateAction<number | undefined>>;
  setMonth: React.Dispatch<React.SetStateAction<number | undefined>>;
  setEndDay: React.Dispatch<React.SetStateAction<number | undefined>>;
  setDefaultLocation: React.Dispatch<React.SetStateAction<string | undefined>>;
  changeUnit: (newUnit: string) => void;
  setSelectedLocationTemp: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
}

const GraphDataContext = createContext<GraphDataContextType | null>(null);

interface GraphDataProviderProps {
  children: React.ReactNode;
}

const GraphDataProvider = ({ children }: GraphDataProviderProps) => {
  const { fetchData } = useGetWaterData();

  const [data, setData] = useState<
    Record<string, { timestamp: string; [key: string]: number | string }>[]
  >([]);

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
    setStoredTempUnit(newUnit);
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
    setStoredLocation(newLocation);
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
        setLoading
      );
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
    setMonth(lastMonth.month);
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
      }}>
      {children}
    </GraphDataContext.Provider>
  );
};

export default GraphDataProvider;

export const useGraphData = () => useContext(GraphDataContext);
