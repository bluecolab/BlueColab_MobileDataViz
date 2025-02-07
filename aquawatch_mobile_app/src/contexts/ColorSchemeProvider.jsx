import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';

const ColorSchemeContext = createContext(false);

const ColorSchemeProvider = ({ children }) => {
  // Initialize isDark as true if the device's color scheme is 'dark'
  const [isDark, setIsDark] = useState(Appearance.getColorScheme() === 'dark');

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDark(colorScheme === 'dark');
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <ColorSchemeContext.Provider value={isDark}>
      {children}
    </ColorSchemeContext.Provider>
  );
};

export default ColorSchemeProvider;

// Custom hook to use the isDark boolean
export const useIsDark = () => useContext(ColorSchemeContext);
