import React, { createContext, useContext, useState, useEffect } from "react";
import { Appearance } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from "nativewind";

const ColorSchemeContext = createContext(false);

const ColorSchemeProvider = ({ children }) => {
  const { setColorScheme } = useColorScheme();
  const [isDark, setIsDark] = useState(Appearance.getColorScheme() === "dark");
  const [colorSchemeSys, setColorSchemeSys ] = useState("system"); 

  const changeColor = (newColorScheme) => {
    const setStoredAppearance  = async (value) => {
      try {
        await AsyncStorage.setItem('default-appearance', value);
      } catch(e) {
        // save error
      }
    }
    setStoredAppearance (newColorScheme);
    setColorSchemeSys(newColorScheme);
    setIsDark(newColorScheme === "system" ? Appearance.getColorScheme() === "dark" : newColorScheme === "dark");
    setColorScheme(newColorScheme);
  }

  useEffect(() => {
    const getStoredAppearance = async () => {
      try {
        const value = await AsyncStorage.getItem('default-appearance');
        if (value !== null) {
          console.log(`Stored value: ${value}`);
          setColorSchemeSys(value);
          setIsDark(value === "system" ? Appearance.getColorScheme() === "dark" : value === "dark");
          setColorScheme(value);
        } else {
          console.log(`Nothing stored`);
          setColorSchemeSys("system");
          setIsDark(Appearance.getColorScheme() === "dark");
        }
      } catch (e) {
        console.error(e);
      }
    };
    getStoredAppearance();

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorSchemeSys === "system") setIsDark(colorScheme === "dark");
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <ColorSchemeContext.Provider value={{
      isDark,
      colorSchemeSys,
      changeColor
      }}>
      {children}
    </ColorSchemeContext.Provider>
  );
};

export default ColorSchemeProvider;

export const useIsDark = () => useContext(ColorSchemeContext);
