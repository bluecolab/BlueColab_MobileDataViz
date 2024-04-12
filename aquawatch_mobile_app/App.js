import React, { useState } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { createAppContainer } from "react-navigation"; // Only needed if using React Navigation 4.x
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "./src/screens/HomeScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import BlogScreen from "./src/screens/BlogScreen";
import DataChoate from "./src/screens/Data screens/DataChoate";
import DataPough from "./src/screens/Data screens/DataPough";
import DataWP from "./src/screens/Data screens/DataWP";
import DataYonk from "./src/screens/Data screens/DataYonk";
import WeatherScreen from "./src/screens/WeatherScreen";
import StoryScreen from "./src/screens/StoryScreen";
import DataHub from "./src/screens/DataHub"; 
import WildlifeScreen from "./src/screens/WildlifeScreen";
import AiScreen from "./src/screens/AiScreen";
import AiScreenTemp from "./src/screens/AiScreenNoServer";
import Attributions from "./src/screens/Attributions";
import MiddleScreen from './MiddleScreen'; 
import SettingsScreen from './SettingsScreen'; 
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Image, TouchableOpacity, View } from 'react-native';
import { tabBarStyles, middleButtonStyles, iconStyles } from './stylesCard'; 
import waterDropIcon from './free-water-drop-2-462137.png'; 
import homeIcon from './HomeIcon.png'; 
import settingsIcon from './SettingsIcon.png';


/*
import React, { useState } from 'react';
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "./src/screens/HomeScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import BlogScreen from "./src/screens/BlogScreen";
import DataChoate from "./src/screens/Data screens/DataChoate";
import DataPough from "./src/screens/Data screens/DataPough";
import DataWP from "./src/screens/Data screens/DataWP";
import DataYonk from "./src/screens/Data screens/DataYonk";
import WeatherScreen from "./src/screens/WeatherScreen";
import StoryScreen from "./src/screens/StoryScreen";
import DataHub from "./src/screens/DataHub";
import WildlifeScreen from "./src/screens/WildlifeScreen";
import AiScreen from "./src/screens/AiScreen";
import AiScreenTemp from "./src/screens/AiScreenNoServer";
import Attributions from "./src/screens/Attributions";
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
*/
//THIS IS THE APP ENTRY POINT

// //fonts literally just dont work
// const fetchFonts = () => {
//   return Font.loadAsync({
//     'Nunito': require('./assets/fonts/Nunito/static/Nunito-Black.ttf'),
//     // Add more fonts if needed
//   });
// };

//the navigator declares names for each page and we use these names 
//throughout the app as the navigation names
/* const navigator = createStackNavigator(
  {
    Wel: WelcomeScreen,
    Home: HomeScreen,
    Choate: DataChoate,
    Weather: WeatherScreen,
    Story: StoryScreen,
    Hub: DataHub,
    Wildlife: WildlifeScreen,
    Pough: DataPough,
    WP: DataWP,
    Yonk: DataYonk,
    Blog: BlogScreen,
    Ai: AiScreenTemp,
    Attributions: Attributions
  },
  {
    initialRouteName: 'Wel',
    defaultNavigationOptions: {
      title: 'AquaWatch Mobile',
    },
  }
);

export default createAppContainer(navigator);
*/

// Create the stack navigators
const HomeStack = createStackNavigator();
const MiddleStack = createStackNavigator();
const SettingsStack = createStackNavigator();

// Stack navigator for the Home tab
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Story" component={StoryScreen} />
      <HomeStack.Screen name="Wildlife" component={WildlifeScreen} />
      <HomeStack.Screen name="Weather" component={WeatherScreen} />
      <HomeStack.Screen name="Blog" component={BlogScreen} />
      <HomeStack.Screen name="Attributions" component={Attributions} />
    </HomeStack.Navigator>
  );
}

// Stack navigator for the Middle tab (if you have multiple screens here)
function MiddleStackNavigator() {
  return (
    <MiddleStack.Navigator screenOptions={{ headerShown: false }}>
      <MiddleStack.Screen name="Choate" component={DataChoate} />
    </MiddleStack.Navigator>
  );
}

// Stack navigator for the Settings tab
function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="Ai" component={AiScreenTemp} />
      
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

// App component with bottom tab navigator containing stack navigators for each tab
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ tabBarShowLabel: false, tabBarStyle: tabBarStyles.tabBar }}>
        <Tab.Screen 
          name="HomeTab"
          component={HomeStackNavigator}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image source={homeIcon} style={[iconStyles.iconStyle, { opacity: focused ? 1 : 0.5 }]} />
            ),
          }}
        />
        <Tab.Screen
          name="MiddleTab"
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
                <Image source={settingsIcon} style={[iconStyles.iconStyle, { opacity: focused ? 1 : 0.5 }]} /> //{ opacity: focused ? 1 : 0.5 } change opacity when selected
              ),
            }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

