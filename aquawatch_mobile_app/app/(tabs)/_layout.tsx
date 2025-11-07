/* eslint-disable react/no-unstable-nested-components */
// ^ This comment is necessary to avoid warnings about unstable nested components in Expo Router
// particularly likes like this: tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,

import { FontAwesome } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import { Platform, Pressable, TouchableOpacity } from 'react-native';

import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useCurrentData } from '@/contexts/CurrentDataContext';

import { TabBarIcon } from '../../components/TabBarIcon';

function HeaderRefreshButton({ onPress, color }: { onPress: () => void; color: string }) {
    return (
        <TouchableOpacity onPress={onPress} accessibilityLabel="Refresh data" className="pr-4">
            <FontAwesome name="refresh" size={24} color={color} />
        </TouchableOpacity>
    );
}

/** The tab layout of the app. Here we define the tabs and their options.
 * @returns {JSX.Element}
 */
export default function TabLayout() {
    const { isDark } = useColorScheme();

    const { refetchCurrent } = useCurrentData();

    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: isDark ? '#2e2e3b' : 'white',
                },
                tabBarActiveTintColor: isDark ? 'white' : 'black',
                tabBarInactiveTintColor: isDark ? '#a1a1a1' : 'gray',
                animation: 'fade',
                sceneStyle: { backgroundColor: isDark ? '#1a202c' : '#f1f1f1' },
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
                    title: 'Home',
                    tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
                }}
            />
            {/* we set headerShown false as stacks handle their own headers */}

            {Platform.OS === 'web' ? (
                <Tabs.Screen
                    name="currentData"
                    options={{
                        title: 'Current Data',
                        headerTitle: 'Current Data',
                        headerStyle: {
                            backgroundColor: isDark ? '#2e2e3b' : 'white',
                        },
                        tabBarIcon: ({ color }) => <TabBarIcon name="tint" color={color} />,
                        headerTintColor: isDark ? 'white' : 'black',
                        headerRight: () => (
                            <HeaderRefreshButton
                                onPress={refetchCurrent}
                                color={isDark ? 'white' : 'black'}
                            />
                        ),
                    }}
                />
            ) : (
                <Tabs.Screen
                    name="currentData"
                    options={{
                        tabBarLabel: () => null, // Hides only this tab’s label
                        // title: 'Current Data',
                        tabBarIcon: ({ color }) => (
                            <Pressable
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
                            </Pressable>
                        ),
                    }}
                />
            )}

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
