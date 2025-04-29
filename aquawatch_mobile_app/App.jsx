import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, TouchableOpacity, View } from 'react-native';
import { AirQuality, Attributions, BlogScreen, HomeScreen, MonthlyData, StoryScreen, WildlifeScreen, Graph, CurrentData, Settings, Feedback, VersionHistory, Socials } from '@screens';
import { ColorSchemeProvider, GraphDataProvider, useIsDark, CurrentDataProvider } from '@contexts';
import waterDropIcon from './assets/free-water-drop-2-462137.png';
import homeIcon from './assets/HomeIcon_WB.png';
import homeIconDark from './assets/HomeIcon_BB.png';
import monthlyDataIcon from './assets/settings_WB.png';
import monthlyDataIconDark from './assets/settings_BB.png';
import './global.css';
import { StyleSheet } from 'react-native';

// Create the stack navigators
const HomeStack = createStackNavigator();
const MiddleStack = createStackNavigator();
const SettingsStack = createStackNavigator();

// Stack navigator for the Home tab
function HomeStackNavigator() {
    const { isDark } = useIsDark();
    return (
        <HomeStack.Navigator screenOptions={{
            headerShown: true, headerStyle: {
                backgroundColor: isDark ? '#2e2e3b' : 'white' ,
        
                elevation: 20,
            },
            headerTitleStyle: {
                color: isDark ? 'white' : 'black',  
            },
        }}>
            <HomeStack.Screen name="Home" component={HomeScreen} />
            <HomeStack.Screen name="Story" component={StoryScreen} />
            <HomeStack.Screen name="Wildlife" component={WildlifeScreen} />
            <HomeStack.Screen name="Blog" component={BlogScreen} />
            <HomeStack.Screen name="AQI" component={AirQuality} />
            <HomeStack.Screen name="Graph" component={Graph} />
            <HomeStack.Screen name="Current Data" component={CurrentData} />
            {/* <HomeStack.Screen name="Current Data" component={MiddleScreen} /> */}
            <HomeStack.Screen name="Monthly Data" component={MonthlyData} />
        </HomeStack.Navigator>
    );
}

// Stack navigator for the Middle tab (Data Hub)
function MiddleStackNavigator() {
    const { isDark } = useIsDark();
    return (
        <MiddleStack.Navigator screenOptions={{
            headerShown: true,
            headerStyle: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
                elevation: 20,
                backgroundColor: isDark ? '#2e2e3b' : 'white' ,
            },
            headerTitleStyle: {
                color: isDark ? 'white' : 'black',  
            },
        }}>
            <MiddleStack.Screen name="Current Data" component={CurrentData} />
        </MiddleStack.Navigator>
    );
}

// Stack navigator for the Monthly tab
function SettingsStackNavigator() {
    const { isDark }  = useIsDark();
    return (
        <SettingsStack.Navigator screenOptions={{
            headerShown: true,
            headerStyle: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
                elevation: 20,
                backgroundColor: isDark ? '#2e2e3b' : 'white' ,
            },
            headerTitleStyle: {
                color: isDark ? 'white' : 'black',  
            },
        }}>
            <SettingsStack.Screen name="Settings" component={Settings} />
            <SettingsStack.Screen name="Attributions" component={Attributions} />
            <SettingsStack.Screen name="Feedback" component={Feedback} />
            <SettingsStack.Screen name="Version History" component={VersionHistory} />
            <SettingsStack.Screen name="Socials" component={Socials} />

        </SettingsStack.Navigator>
    );
}

// Custom button for the middle tab in the bottom tab navigator
const CustomTabBarButton = ({ children, onPress }) => (
    <TouchableOpacity onPress={onPress} style={middleButtonStyles.MiddleButtonContainer}>
        <View style={middleButtonStyles.customButton}>
            {children}
        </View>
    </TouchableOpacity>
);

// Create the bottom tab navigator
const Tab = createBottomTabNavigator();

function MainNavigator() {
    const { isDark }  = useIsDark();

    return (
        <NavigationContainer>
            <Tab.Navigator screenOptions={{ tabBarShowLabel: false, tabBarStyle: isDark ? tabBarStyles.tabBarDark : tabBarStyles.tabBarLight , headerShown: false }}>
                <Tab.Screen
                    name="HomeTab"
                    component={HomeStackNavigator}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Image source={isDark ? homeIconDark : homeIcon} style={[iconStyles.iconStyle, { opacity: focused ? 1 : 0.5 }]} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="MiddleTab or not"
                    component={MiddleStackNavigator}
                    options={{
                        tabBarButton: (props) => (
                            <CustomTabBarButton {...props}>
                                <Image source={waterDropIcon} style={iconStyles.iconStyle} />
                            </CustomTabBarButton>
                        ),
                    }}
                />
                <Tab.Screen
                    name="SettingsTab"
                    component={SettingsStackNavigator}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Image source={
                                isDark ? monthlyDataIconDark : monthlyDataIcon} style={[iconStyles.iconStyle, { opacity: focused ? 1 : 0.5 }]} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <GraphDataProvider>
            <CurrentDataProvider>
                <ColorSchemeProvider>
                    <MainNavigator />
                </ColorSchemeProvider>
            </CurrentDataProvider>
        </GraphDataProvider>
    );
}

const tabBarStyles = StyleSheet.create({
    tabBarLight: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 0,
        backgroundColor: 'white',
        height: 60,
        alignItems: 'center',
    },
    tabBarDark: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 0,
        backgroundColor: '#2e2e3b',
        height: 60,
        alignItems: 'center',
    },
});

const middleButtonStyles = StyleSheet.create({
    MiddleButtonContainer: {
        position: 'absolute',
        top: -30,
        left: '50%',
        marginLeft: -30,
        width: 60,
        height: 60,
    },
    customButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#00D6FC',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#00D6FC',
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 4,
    },
});

export const iconStyles = StyleSheet.create({
    iconStyle: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
});
