import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a provider component
const GraphDataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [start_day, setStartDay] = useState(null);
  const [end_day, setEndDay] = useState(null);

  const [defaultLocation, setDefaultLocation] = useState(null);
  const [defaultTempUnit, setDefaultTempUnit] = useState(null);

  const locationMap = {
    'New York City': '01376520',
    'Piermont': '01376269',
    'West Point': '01374019',
    'Poughkeepsie': '01372043',
    'Albany': '01359165',
  }
  const fetchData = () => {
    console.log(year , month , start_day , end_day , defaultLocation);

    if (year && month && start_day && end_day && defaultLocation) {

      // based off the location, get valid data 
      // also make an api request for current data? 
      let baseURL = '';

      switch (defaultLocation) {
        case 'Choate Pond':
          baseURL = `https://colabprod01.pace.edu/api/influx/sensordata/Ada/range?stream=false&start_date=${year}-${month
            .toString()
            .padStart(2, "0")}-${start_day}T00%3A00%3A00%2B00%3A00&stop_date=${year}-${month
              .toString()
              .padStart(2, "0")}-${end_day}T23%3A59%3A59%2B00%3A00`;
          break;
        case 'New York City':
        case 'Piermont':
        case 'West Point':
        case 'Poughkeepsie':
        case 'Albany':
          baseURL = `https://nwis.waterservices.usgs.gov/nwis/iv/?sites=${locationMap[defaultLocation] ?? "01376269"}&startDT=${year}-${month}-${start_day}&endDT=${year}-${month}-${end_day}&format=json`
          break;
        default:
          baseURL = `https://colabprod01.pace.edu/api/influx/sensordata/Ada/range?stream=false&start_date=${year}-${month
            .toString()
            .padStart(2, "0")}-${start_day}T00%3A00%3A00%2B00%3A00&stop_date=${year}-${month
              .toString()
              .padStart(2, "0")}-${end_day}T23%3A59%3A59%2B00%3A00`;
          break;

      }

      axios
        .get(baseURL)
        .then((response) => {
          const apiData = response.data;
          console.log(baseURL);
          console.log(apiData);

          if (defaultLocation == 'Choate Pond') {
            const cleanedData = apiData.map((item) => {
              const { sensors, ...rest } = item;
              return { ...rest, ...sensors };
            });
            setData(cleanedData);
          } else {
            // setData(apiData);
          }

        })
        .catch((error) => {
          console.log(error)
          console.error("Error fetching data:", error);
          setData({ error: "Failed to load data" });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {


    setLoading(true);
    setData([]);
    fetchData();
  }, [year, month, start_day, end_day]);

  useEffect(() => {
    const getStoredDefaultLocation = async () => {
      try {
        const value = await AsyncStorage.getItem('default-location');
        console.log(value)
        if (value !== null) {
          console.log('Fire 1')
          setDefaultLocation(value);
        } else {
          console.log('Fire 2')
          setDefaultLocation("Albany");
        }
      } catch (e) {
        // error reading value
      }
    };

    getStoredDefaultLocation();

    const lastMonth = moment().subtract(1, "month");
    console.log(lastMonth,
      lastMonth.year(),
      lastMonth.month() + 1,
      lastMonth.daysInMonth()
    )
    setYear(lastMonth.year());
    setMonth(lastMonth.month() + 1); // Months are 0-based in moment 
    setStartDay(1);
    setEndDay(lastMonth.daysInMonth());
  }, []);

  return (
    <GraphDataContext.Provider
      value={{
        data,
        loading,
        defaultLocation,
        setDefaultLocation,
        setLoading,
        setYear,
        setMonth,
        setEndDay
      }}
    >
      {children}
    </GraphDataContext.Provider>
  );
};

export default GraphDataProvider;

export const GraphDataContext = createContext();
