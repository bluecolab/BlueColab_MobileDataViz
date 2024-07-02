import React, { useState } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from "./src/screens/HomeScreen";
import StoryScreen from "./src/screens/StoryScreen";
import WildlifeScreen from "./src/screens/WildlifeScreen";
import BlogScreen from "./src/screens/BlogScreen";
import Attributions from "./src/screens/Attributions";
import MiddleScreen from './src/screens/MiddleScreen'; 
import MonthlyData from "./src/screens/Data screens/MonthlyData";
import SecretScreen from "./src/screens/SecretScreen";
import { Image, TouchableOpacity, View } from 'react-native';
import { tabBarStyles, middleButtonStyles, iconStyles } from './stylesCard'; 
import waterDropIcon from './assets/free-water-drop-2-462137.png'; 
import homeIcon from './assets/HomeIcon.png'; 
import settingsIcon from './assets/NavGraphIcon.png';

// Create the stack navigators
const HomeStack = createStackNavigator();
const MiddleStack = createStackNavigator();
const SettingsStack = createStackNavigator();
const SecretStack = createStackNavigator();

// Stack navigator for the Home tab
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: true }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Story" component={StoryScreen} />
      <HomeStack.Screen name="Wildlife" component={WildlifeScreen} />
      <HomeStack.Screen name="Blog" component={BlogScreen} />
      <HomeStack.Screen name="Attributions" component={Attributions} />
    </HomeStack.Navigator>
  );
}

// Stack navigator for the Middle tab (Current Data)
function MiddleStackNavigator() {
  return (
    <MiddleStack.Navigator screenOptions={{ headerShown: true }}>
      <MiddleStack.Screen name="Current Data" component={MiddleScreen} />
    </MiddleStack.Navigator>
  );
}

// Stack navigator for the Settings tab (Monthly Data)
function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: true }}>
      <SettingsStack.Screen name="Monthly Data" component={MonthlyData} />
    </SettingsStack.Navigator>
  );
}

// Stack navigator for the Secret screen
function SecretStackNavigator() {
  return (
    <SecretStack.Navigator screenOptions={{ headerShown: true }}>
      <SecretStack.Screen name="Secret" component={SecretScreen} />
    </SecretStack.Navigator>
  );
}

// App component with bottom tab navigator containing stack navigators for each tab
export default function App() {
  const [pressCount, setPressCount] = useState(0);

  const handlePress = (onPress, navigation) => {
    setPressCount(prevCount => {
      const newCount = prevCount + 1;
      if (newCount === 7) {
        navigation.navigate("SecretScreen");
        return 0; // Reset the count after navigating to the secret screen
      }
      return newCount;
    });
    onPress(); // Execute the default onPress action
  };

  // Custom button for the middle tab in the bottom tab navigator
  const CustomTabBarButton = ({ children, onPress, navigation }) => (
    <TouchableOpacity onPress={() => handlePress(onPress, navigation)} style={middleButtonStyles.MiddleButtonContainer}>
      <View style={middleButtonStyles.customButton}>
        {children}
      </View>
    </TouchableOpacity>
  );

  // Create the bottom tab navigator
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ tabBarShowLabel: false, tabBarStyle: tabBarStyles.tabBar, headerShown: false }}>
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
          name="CurrentDataTab"
          component={MiddleStackNavigator}
          options={({ navigation }) => ({
            tabBarButton: (props) => (
              <CustomTabBarButton {...props} navigation={navigation}>
                <Image source={waterDropIcon} style={iconStyles.iconStyle} />
              </CustomTabBarButton>
            ),
          })}
        />
        <Tab.Screen
          name="SettingsTab"
          component={SettingsStackNavigator}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image source={settingsIcon} style={[iconStyles.iconStyle, { opacity: focused ? 1 : 0.5 }]} />
            ),
          }}
        />
        <Tab.Screen
          name="SecretScreen"
          component={SecretStackNavigator}
          options={{ tabBarButton: () => null }} // Hide the tab button for the secret screen
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
