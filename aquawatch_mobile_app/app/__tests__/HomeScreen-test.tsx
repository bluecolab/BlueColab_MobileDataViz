import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CurrentDataProvider from '@/contexts/CurrentDataContext';
import HomeScreen from '@/app/(tabs)/home/index';

const Tab = createBottomTabNavigator();

describe('<HomeScreen />', () => {
    it('renders without crashing', () => {
        render(
            <NavigationContainer>
                <CurrentDataProvider>
                    <Tab.Navigator>
                        <Tab.Screen name="Home" component={HomeScreen} />
                    </Tab.Navigator>
                </CurrentDataProvider>
            </NavigationContainer>
        );
    });
});
