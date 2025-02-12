import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

// Create a provider component
const GraphDataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [start_day, setStartDay] = useState(null);
  const [end_day, setEndDay] = useState(null);

  const fetchData = () => {
    if (year && month && start_day && end_day) {
      const base_url = `https://colabprod01.pace.edu/api/influx/sensordata/Alan/idk/range?stream=false&start_date=${year}-${month
        .toString()
        .padStart(2, "0")}-${start_day}T00%3A00%3A00%2B00%3A00&stop_date=${year}-${month
        .toString()
        .padStart(2, "0")}-${end_day}T23%3A59%3A59%2B00%3A00`;
      console.log(base_url)
      axios
        .get(base_url)
        .then((response) => {
          const apiData = response.data;

          // Flatten the data structure by merging "sensors" into each item
          const cleanedData = apiData.map((item) => {
            const { sensors, ...rest } = item;
            return { ...rest, ...sensors };
          });

          setData(cleanedData);
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
    const lastMonth = moment().subtract(1, "month");
    console.log(lastMonth,
      lastMonth.year(),
      lastMonth.month() + 1,
      lastMonth.daysInMonth()
    )
    setYear(lastMonth.year());
    setMonth(lastMonth.month() + 1); // Months are 0-based
    setStartDay(1);
    setEndDay(lastMonth.daysInMonth());
  }, []);
  
  return (
    <GraphDataContext.Provider
    value={{
      data,
      loading,
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
