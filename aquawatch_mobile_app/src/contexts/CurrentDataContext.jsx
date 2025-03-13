import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGraphData } from './GraphDataContext';
import moment from 'moment';
import { useGetWaterData } from '@hooks';

const CurrentDataContext = createContext(null);

const CurrentDataProvider = ({ children }) => {
    const { defaultLocation, defaultTempUnit } = useGraphData();
    const { fetchData } = useGetWaterData();

    const [data, setData] = useState([]);
    const [loadingCurrent, setLoading] = useState(true);
    // const [error, setError] = useState(null);

    useEffect(() => {
        const checkTimeAndFetchData = () => {
            const currentTime = moment();
            const currentMinute = currentTime.minute();

            if (defaultLocation && [0, 15, 30, 45].includes(currentMinute)) {
                fetchData(defaultLocation,true, 0, 0, 0, 0, setData, setLoading);
            }
        };

        const intervalId = setInterval(() => {
            checkTimeAndFetchData();
        }, 60000);

        setLoading(true);
        if (defaultLocation)
            fetchData(defaultLocation,true, 0, 0, 0, 0, setData, setLoading);

        return () => clearInterval(intervalId);
    }, [defaultLocation, defaultTempUnit, fetchData]);

    return (
        <CurrentDataContext.Provider value={{ data, defaultLocation, defaultTempUnit, loadingCurrent }}>
            {children}
        </CurrentDataContext.Provider>
    );
};

export default CurrentDataProvider;

export const useCurrentData = () => useContext(CurrentDataContext);
