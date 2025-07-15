/* eslint-disable react/no-unstable-nested-components */
// ^ This comment is necessary to avoid warnings about unstable nested components in Expo Router
// particularly likes like this: tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,

import { router, Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';

import { TabBarIcon } from '../../components/TabBarIcon';

import { useIsDark } from '@/contexts/ColorSchemeContext';

/**
 * @returns {JSX.Element}
 * @description The tab layout of the app. Here we define the tabs and their options.
 */
export default function TabLayout() {
    const { isDark } = useIsDark();

    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: isDark ? '#2e2e3b' : 'white',
                },
                tabBarActiveTintColor: isDark ? 'white' : 'black',
                tabBarInactiveTintColor: isDark ? '#a1a1a1' : 'gray',
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    href: null,
                }}
            />

            <Tabs.Screen
                name="home"
                options={{
                    headerShown: false,
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
                }}
            />
            {/* set headerShown false to allow stacks to handle their own headers */}
            <Tabs.Screen
                name="currentData"
                options={{
                    tabBarLabel: () => null, // Hides only this tab’s label
                    tabBarIcon: ({ color }) => (
                        <TouchableOpacity
                            onPress={() => router.push('/currentData')} // Navigate to the desired screen
                            style={{
                                position: 'absolute',
                                top: -40,
                                left: '50%',
                                marginLeft: -30,
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                                backgroundColor: '#00D6FC',
                                justifyContent: 'center',
                                alignItems: 'center',
                                elevation: 6,
                            }}>
                            <TabBarIcon name="tint" color={color} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    headerShown: false,
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
                }}
            />
        </Tabs>
    );
}
