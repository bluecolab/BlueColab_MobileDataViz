import { Tabs } from 'expo-router';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { TabBarIcon } from '../../components/TabBarIcon';

/**
 * @returns {JSX.Element}
 * @description The tab layout of the app. Here we define the tabs and their options.
 */
export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: 'black',
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen name="home" options={{ title: 'Home', headerShown: false }} />
            {/* we set headerShown false as stacks handle their own headers */}
            <Tabs.Screen
                name="currentData"
                options={{
                    tabBarButton: (props) => (
                        <TouchableOpacity
                            {...(props as TouchableOpacityProps)}
                            style={{
                                position: 'absolute',
                                top: -30,
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
                            {/* <Image
                source={waterDropIcon}
                style={{ width: 30, height: 30 }}
                resizeMode="contain"
              /> */}
                        </TouchableOpacity>
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
                }}
            />
        </Tabs>
    );
}
