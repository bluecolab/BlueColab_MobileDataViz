import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocationMetaProvider } from '@hooks';

const GraphDataContext = createContext(null);

const GraphDataProvider = ({ children }) => {
    const {
        stationIds,
        usgsParameterMappings } = useLocationMetaProvider();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [year, setYear] = useState(null);
    const [month, setMonth] = useState(null);
    const [start_day, setStartDay] = useState(null);
    const [end_day, setEndDay] = useState(null);

    const [defaultLocation, setDefaultLocation] = useState(null);
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
        function cleanHudsonRiverData(rawData) {
            if (!rawData?.value?.timeSeries) {
                console.error('Invalid data format');
                return [];
            }
    
            const parsedData = {};

            rawData.value.timeSeries.forEach(series => {
                const paramCode = series.variable.variableCode[0].value;
                const paramName = usgsParameterMappings[paramCode];

                if (!paramName) return; // Skip unneeded parameters

                const valuesList = series.values[0].value.length > 0 ?  series.values[0].value : series.values[1]?.value ?? []; 

                valuesList.forEach(entry => {
                    const timestamp = entry.dateTime;
                    const value = parseFloat(entry.value);
    
                    if (!parsedData[timestamp]) {
                        parsedData[timestamp] = { timestamp };
                    }
                    parsedData[timestamp][paramName] = value;
                });
            });
    
            return Object.values(parsedData);
        }

        const fetchData = () => {
            if (year && month && start_day && end_day && defaultLocation) {  
                let baseURL = '';
  
                switch (defaultLocation) {
                case 'Choate Pond':
                    baseURL = `https://colabprod01.pace.edu/api/influx/sensordata/Ada/range?stream=false&start_date=${year}-${month
                        .toString()
                        .padStart(2, '0')}-${start_day}T00%3A00%3A00%2B00%3A00&stop_date=${year}-${month
                        .toString()
                        .padStart(2, '0')}-${end_day}T23%3A59%3A59%2B00%3A00`;
                    break;
                case 'New York City':
                case 'Piermont':
                case 'West Point':
                case 'Poughkeepsie':
                case 'Albany':
                case 'Cohoes':
                case 'Gowanda':
                    baseURL = `https://waterservices.usgs.gov/nwis/iv/?sites=${stationIds[defaultLocation] ?? '01376269'}&startDT=${year}-${month}-${start_day}&endDT=${year}-${month}-${end_day}&format=json`;
                    break;
                default:
                    baseURL = `https://colabprod01.pace.edu/api/influx/sensordata/Ada/range?stream=false&start_date=${year}-${month
                        .toString()
                        .padStart(2, '0')}-${start_day}T00%3A00%3A00%2B00%3A00&stop_date=${year}-${month
                        .toString()
                        .padStart(2, '0')}-${end_day}T23%3A59%3A59%2B00%3A00`;
                    break;
                }
  
                axios
                    .get(baseURL)
                    .then((response) => {
                        const apiData = response.data;
                        console.log(baseURL);
                        if (defaultLocation === 'Choate Pond') {
                            const cleanedData = apiData.map((item) => {
                                const { sensors, ...rest } = item;
                                return { ...rest, ...sensors };
                            });
                            setData(cleanedData);
                        } else {
                            const cleanedData = cleanHudsonRiverData(apiData);
                            setData(cleanedData);
                        }
                    })
                    .catch((error) => {
                        console.error('Error fetching data:', error);
                        setData({ error: 'Failed to load data' });
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
        };

        setLoading(true);
        if (defaultLocation) {
            setData([]);
            fetchData();
        }
    }, [year, month, start_day, end_day, defaultLocation]); 

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

        const lastMonth = moment().subtract(1, 'month');
        setYear(lastMonth.year());
        setMonth(lastMonth.month() + 1);
        setStartDay(1);
        setEndDay(lastMonth.daysInMonth());
    }, []);

    return (
        <GraphDataContext.Provider
            value={{
                data,
                loading,
                defaultLocation,
                defaultTempUnit,
                changeLocation,
                setLoading,
                setYear,
                setMonth,
                setEndDay,
                setDefaultLocation,
                changeUnit,
            }}
        >
            {children}
        </GraphDataContext.Provider>
    );
};

export default GraphDataProvider;

export const useGraphData = () => useContext(GraphDataContext);
