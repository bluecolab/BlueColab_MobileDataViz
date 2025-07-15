import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { DateTime } from 'luxon';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '@/app/(tabs)/home/index';
import CurrentDataProvider from '@/contexts/CurrentDataContext';

const Tab = createBottomTabNavigator();

// Mock assets for require
jest.mock('@/assets/homescreen/PXL_20221014_204618892.jpg', () => 1);
jest.mock('@/assets/homescreen/turtle.jpg', () => 2);
jest.mock('@/assets/homescreen/sky.jpg', () => 3);
jest.mock('@/assets/homescreen/waterSplash2.jpg', () => 4);
jest.mock('@/assets/homescreen/IMG_9274.jpg', () => 5);

// Mock HomeScreenCard and QuickCurrentData for isolation
jest.mock('@/components/HomeScreenCard', () => {
    const { Text } = require('react-native');
    return (props: any) => (
        <>
            {props.title && <Text>{props.title}</Text>}
            {props.buttonText && <Text>{props.buttonText}</Text>}
        </>
    );
});
jest.mock('@/components/visualizations/QuickCurrentData', () => {
    const { Text } = require('react-native');
    return () => <Text>QuickCurrentData</Text>;
});
jest.mock('@/contexts/CurrentDataContext', () => {
    return {
        __esModule: true,
        useCurrentData: () => ({ defaultLocation: 'TestLocation' }),
        default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    };
});

jest.mock('@/contexts/ColorSchemeContext', () => ({
    useIsDark: jest.fn(),
}));

jest.mock('@/contexts/ColorSchemeContext', () => {
    return {
        __esModule: true,
        useIsDark: jest.fn(),
        default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    };
});

let stackScreenOptions: any = null;
jest.mock('expo-router', () => ({
    Stack: {
        Screen: (props: any) => {
            stackScreenOptions = props.options;
            return null;
        },
    },
}));

import ColorSchemeProvider, { useIsDark } from '@/contexts/ColorSchemeContext';

describe('<HomeScreen />', () => {
    it('renders without crashing', () => {
        (useIsDark as jest.Mock).mockReturnValue({ isDark: false });

        render(
            <NavigationContainer>
                <ColorSchemeProvider>
                    <CurrentDataProvider>
                        <Tab.Navigator>
                            <Tab.Screen name="Home" component={HomeScreen} />
                        </Tab.Navigator>
                    </CurrentDataProvider>
                </ColorSchemeProvider>
            </NavigationContainer>
        );
    });

    it('shows the default location data text', () => {
        (useIsDark as jest.Mock).mockReturnValue({ isDark: false });

        const { getByText } = render(
            <NavigationContainer>
                <ColorSchemeProvider>
                    <CurrentDataProvider>
                        <Tab.Navigator>
                            <Tab.Screen name="Home" component={HomeScreen} />
                        </Tab.Navigator>
                    </CurrentDataProvider>
                </ColorSchemeProvider>
            </NavigationContainer>
        );
        expect(getByText('TestLocation Data!')).toBeTruthy();
    });

    it('shows the Historic Data card', () => {
        const lastMonth = DateTime.now().minus({ months: 1 }).toFormat('MMMM yyyy');
        (useIsDark as jest.Mock).mockReturnValue({ isDark: false });

        const { getByText } = render(
            <NavigationContainer>
                <ColorSchemeProvider>
                    <CurrentDataProvider>
                        <Tab.Navigator>
                            <Tab.Screen name="Home" component={HomeScreen} />
                        </Tab.Navigator>
                    </CurrentDataProvider>
                </ColorSchemeProvider>
            </NavigationContainer>
        );
        expect(getByText('Historic Data')).toBeTruthy();
        expect(getByText(`${lastMonth} Data`)).toBeTruthy();
    });

    it('shows the From Blue CoLab section', () => {
        (useIsDark as jest.Mock).mockReturnValue({ isDark: false });

        const { getByText } = render(
            <NavigationContainer>
                <ColorSchemeProvider>
                    <CurrentDataProvider>
                        <Tab.Navigator>
                            <Tab.Screen name="Home" component={HomeScreen} />
                        </Tab.Navigator>
                    </CurrentDataProvider>
                </ColorSchemeProvider>
            </NavigationContainer>
        );
        expect(getByText('From Blue CoLab')).toBeTruthy();
        expect(getByText('Discover')).toBeTruthy();
        expect(getByText('Discover Wildlife')).toBeTruthy();
        expect(getByText('Look!')).toBeTruthy();
        expect(getByText('Read Blogs')).toBeTruthy();
    });
});

describe('Color Scheme Context', () => {
    beforeEach(() => {
        stackScreenOptions = null; // Reset before each test
    });

    it('sets dark header styles when isDark is true', () => {
        (useIsDark as jest.Mock).mockReturnValue({ isDark: true });
        render(<HomeScreen />);
        expect(stackScreenOptions).toBeTruthy();
        expect(stackScreenOptions.headerStyle.backgroundColor).toBe('#2e2e3b');
        expect(stackScreenOptions.headerTintColor).toBe('white');
    });

    it('sets light header styles when isDark is false', () => {
        (useIsDark as jest.Mock).mockReturnValue({ isDark: false });
        render(<HomeScreen />);
        expect(stackScreenOptions).toBeTruthy();
        expect(stackScreenOptions.headerStyle.backgroundColor).toBe('white');
        expect(stackScreenOptions.headerTintColor).toBe('black');
    });
});
