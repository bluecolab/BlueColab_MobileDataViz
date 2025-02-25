import React, { createContext, useContext, useState, useEffect } from "react";
import { Appearance } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from "nativewind";

const ColorSchemeContext = createContext({});

const ColorSchemeProvider = ({ children }) => {
  const { setColorScheme } = useColorScheme();
  const [colorScheme, setColorSchemeState] = useState("system");  // Default to system
  const [isDark, setIsDark] = useState(Appearance.getColorScheme() === "dark");

  // Store the color scheme preference in AsyncStorage
  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('appearance', value);
      setColorScheme(value); // Update the color scheme immediately
    } catch (e) {
      console.error("Error saving color scheme:", e);
    }
  };

  // Get the color scheme preference from AsyncStorage
  const getData = async () => {
    try {
      const storedValue = await AsyncStorage.getItem('appearance');
      if (storedValue) {
        setColorSchemeState(storedValue);
        setIsDark(storedValue === "dark");
      } else {
        const systemScheme = Appearance.getColorScheme();
        setColorSchemeState(systemScheme);  // Default to system theme if not set
        setIsDark(systemScheme === "dark");  // Update isDark based on system theme
        storeData("system"); // Save the 'system' theme as the default in AsyncStorage
      }
    } catch (e) {
      console.error("Error reading color scheme:", e);
    }
  };

  useEffect(() => {
    let isMounted = true; // Flag to track whether the component is mounted

    getData(); // Retrieve stored color scheme on mount

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      const newScheme = colorScheme === "dark" ? "dark" : "light";
      if (isMounted) {
        setColorSchemeState(newScheme);
        setIsDark(newScheme === "dark");
        storeData(newScheme); // Persist the change in AsyncStorage
      }
    });

    return () => {
      isMounted = false; // Set the flag to false when the component unmounts
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (colorScheme) {
      setColorScheme(colorScheme);  // Update nativewind color scheme based on the context value
    }
  }, [colorScheme]);

  return (
    <ColorSchemeContext.Provider value={{ colorScheme, setColorScheme: storeData, isDark }}>
      {children}
    </ColorSchemeContext.Provider>
  );
};

export default ColorSchemeProvider;

// Custom hook to access the color scheme context and isDark value
export const useColorSchemeContext = () => useContext(ColorSchemeContext);
