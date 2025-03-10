import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGraphData } from './GraphDataContext';
import axios from 'axios';
import moment from 'moment';

const CurrentDataContext = createContext(null);

const CurrentDataProvider = ({ children }) => {
    const { defaultLocation, defaultTempUnit } = useGraphData();
    const [data, setData] = useState([]);
    const [loadingCurrent, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const locationMap = {
        'New York City': '01376520',
        'Piermont': '01376269',
        'West Point': '01374019',
        'Poughkeepsie': '01372043',
        'Albany': '01359165',
    };

    useEffect(() => {
        const parameterMap = {
            '00010': 'Temp',  
            '00301': 'DOpct', 
            '90860': 'Sal',    
            '00095': 'Cond',  
            '63680': 'Turb',  
            '00400': 'pH',    
        };

        function cleanHudsonRiverData(rawData) {
            if (!rawData?.value?.timeSeries) {
                console.error('Invalid data format');
                return [];
            }

            const parsedData = {};

            rawData.value.timeSeries.forEach(series => {
                const paramCode = series.variable.variableCode[0].value;
                const paramName = parameterMap[paramCode];

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
            if (defaultLocation) {
                let baseURL = '';
                switch (defaultLocation) {
                case 'Choate Pond':
                    baseURL = 'https://colabprod01.pace.edu/api/influx/sensordata/Ada/delta?days=1';
                    break;
                case 'New York City':
                case 'Piermont':
                case 'West Point':
                case 'Poughkeepsie':
                case 'Albany':
                    baseURL = `https://waterservices.usgs.gov/nwis/iv/?sites=${locationMap[defaultLocation] ?? '01376269'}&period=P2D&format=json`;
                    break;
                default:
                    baseURL = 'https://colabprod01.pace.edu/api/influx/sensordata/Ada/delta?days=1';
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

        const checkTimeAndFetchData = () => {
            const currentTime = moment();
            const currentMinute = currentTime.minute();

            if ([0, 15, 30, 45].includes(currentMinute)) {
                fetchData();
            }
        };

        const intervalId = setInterval(() => {
            checkTimeAndFetchData();
        }, 30000); // 1 seconds

        setLoading(true);
        fetchData();

        return () => clearInterval(intervalId);
    }, [defaultLocation, defaultTempUnit]);

    return (
        <CurrentDataContext.Provider value={{ data, defaultLocation, defaultTempUnit }}>
            {children}
        </CurrentDataContext.Provider>
    );
};

export default CurrentDataProvider;

export const useCurrentData = () => useContext(CurrentDataContext);
