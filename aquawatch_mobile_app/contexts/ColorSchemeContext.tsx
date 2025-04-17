import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';
import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import { Appearance } from 'react-native';

const ColorSchemeContext = createContext({
  isDark: false,
  colorSchemeSys: 'system',
  changeColor: (newColorScheme: ColorScheme) => {},
});

interface ColorSchemeProviderProps {
  children: ReactNode;
}

export enum ColorScheme {
  System = 'system',
  Light = 'light',
  Dark = 'dark',
}

export default function ColorSchemeProvider({
  children,
}: ColorSchemeProviderProps) {
  const { setColorScheme } = useColorScheme();
  const [isDark, setIsDark] = useState(Appearance.getColorScheme() === 'dark');
  const [colorSchemeSys, setColorSchemeSys] = useState('system');

  const changeColor = (newColorScheme: ColorScheme) => {
    const setStoredAppearance = async (value: ColorScheme) => {
      try {
        await AsyncStorage.setItem('default-appearance', value);
      } catch (e) {
        console.log(e);
      }
    };
    setStoredAppearance(newColorScheme);
    setColorSchemeSys(newColorScheme);
    setIsDark(
      newColorScheme === 'system'
        ? Appearance.getColorScheme() === 'dark'
        : newColorScheme === 'dark'
    );
    setColorScheme(newColorScheme);
  };

  useEffect(() => {
    const getStoredAppearance = async () => {
      try {
        const value = await AsyncStorage.getItem('default-appearance');
        if (value !== null) {
          console.log(`Stored value: ${value}`);
          setColorSchemeSys(value);
          setIsDark(
            value === 'system'
              ? Appearance.getColorScheme() === 'dark'
              : value === 'dark'
          );
          setColorScheme(value as ColorScheme);
        } else {
          console.log('Nothing stored');
          setColorSchemeSys('system');
          setIsDark(Appearance.getColorScheme() === 'dark');
        }
      } catch (e) {
        console.error(e);
      }
    };
    getStoredAppearance();

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorSchemeSys === 'system') setIsDark(colorScheme === 'dark');
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <ColorSchemeContext.Provider
      value={{
        isDark,
        colorSchemeSys,
        changeColor,
      }}>
      {children}
    </ColorSchemeContext.Provider>
  );
}

export const useIsDark = () => useContext(ColorSchemeContext);
