import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, TouchableOpacity, View } from 'react-native';
import { AirQuality, Attributions, BlogScreen, HomeScreen, MiddleScreen, MonthlyData, StoryScreen, WildlifeScreen } from '@screens';
import { tabBarStyles, middleButtonStyles, iconStyles } from './stylesCard'; 
import waterDropIcon from './assets/free-water-drop-2-462137.png'; 
import homeIcon from './assets/HomeIcon.png'; 
import monthlyDataIcon from './assets/NavGraphIcon.png';

// Create the stack navigators
const HomeStack = createStackNavigator();
const MiddleStack = createStackNavigator();
const MonthlyDataStack = createStackNavigator();

// Stack navigator for the Home tab
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: true }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Story" component={StoryScreen} />
      <HomeStack.Screen name="Wildlife" component={WildlifeScreen} />
      <HomeStack.Screen name="Blog" component={BlogScreen} />
      <HomeStack.Screen name="Attributions" component={Attributions} />
      <HomeStack.Screen name="AQI" component={AirQuality} />
    </HomeStack.Navigator>
  );
}

// Stack navigator for the Middle tab (Data Hub)
function MiddleStackNavigator() {
  return (
    <MiddleStack.Navigator screenOptions={{ headerShown: true }}>
      <MiddleStack.Screen name="Current Data" component={MiddleScreen} />
    </MiddleStack.Navigator>
  );
}

// Stack navigator for the Monthly tab
function MonthlyDataStackNavigator() {
  return (
    <MonthlyDataStack.Navigator screenOptions={{ headerShown: true }}>
      <MonthlyDataStack.Screen name="Monthly Data" component={MonthlyData} />
    </MonthlyDataStack.Navigator>
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
      <Tab.Navigator screenOptions={{ tabBarShowLabel: false, tabBarStyle: tabBarStyles.tabBar, headerShown: false  }}>
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
          name="MonthlyDataTab"
          component={MonthlyDataStackNavigator}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image source={monthlyDataIcon} style={[iconStyles.iconStyle, { opacity: focused ? 1 : 0.5 }]} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
