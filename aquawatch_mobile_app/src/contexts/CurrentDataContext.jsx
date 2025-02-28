import React, { createContext, useContext, useState } from "react";

const CurrentDataContext = createContext(null);

const CurrentDataProvider = ({ children }) => {
  const [currentData, setCurrentData] = useState(null);

  

  return (
    <CurrentDataContext.Provider value={{ currentData, setCurrentData }}>
      {children}
    </CurrentDataContext.Provider>
  );
};

export default CurrentDataProvider;

export const useCurrentData = () => useContext(CurrentDataContext);
