import AsyncStorage from '@react-native-async-storage/async-storage';
import { SkFont, useFont } from '@shopify/react-native-skia';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';

import roboto from '@/assets/fonts/roboto.ttf';

const ColorSchemeContext = createContext<{
    isDark: boolean;
    font?: SkFont | null;
    loading: boolean;
    colorSchemeSys: string;
    changeColor: (newColorScheme: ColorScheme) => void;
}>({
    isDark: false,
    font: null,
    loading: true,
    colorSchemeSys: 'system',
    changeColor: () => {},
});

export default function ColorSchemeProvider({ children }: { children: ReactNode }) {
    const { setColorScheme } = useNativeWindColorScheme();
    const [isDark, setIsDark] = useState<boolean>(Appearance.getColorScheme() === 'dark');
    const [loading, setLoading] = useState<boolean>(true);
    const [colorSchemeSys, setColorSchemeSys] = useState<string>('system');

    const font = useFont(roboto, 12);

    const changeColor = (newColorScheme: ColorScheme) => {
        const setStoredAppearance = async (value: ColorScheme) => {
            try {
                await AsyncStorage.setItem('default-appearance', value);
            } catch (e) {
                console.log(e);
            }
        };
        void setStoredAppearance(newColorScheme);
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
        void getStoredAppearance();

        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            if (colorSchemeSys === 'system') setIsDark(colorScheme === 'dark');
        });

        if (font) {
            setLoading(false);
        }

        return () => {
            subscription.remove();
        };
    }, [colorSchemeSys, font, setColorScheme]);

    return (
        <ColorSchemeContext.Provider
            value={{
                isDark,
                font,
                loading,
                colorSchemeSys,
                changeColor,
            }}>
            {children}
        </ColorSchemeContext.Provider>
    );
}

export const useColorScheme = () => useContext(ColorSchemeContext);

export enum ColorScheme {
    light = 'light',
    dark = 'dark',
    system = 'system',
}
