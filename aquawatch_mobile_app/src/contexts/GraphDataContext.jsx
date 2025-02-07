import React, { createContext, useState, useEffect } from "react";
import axios from "axios";


// Create a provider component
const GraphDataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get("https://colabprod01.pace.edu/api/influx/sensordata/Alan/delta?days=30")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setData({ error: "Failed to load data" });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  
  return (
    <GraphDataContext.Provider value={{ data, loading }}>
      {children}
    </GraphDataContext.Provider>
  );
};

export default GraphDataProvider;

export const GraphDataContext = createContext();
