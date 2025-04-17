/**
 * @file (tabs)/_layout.tsx - The the root layout and represents the entry point for navigation. Describes the top-level navigator (i.e. tabs) for the app. Initialization code for loading fonts, interacting with the splash screen, or adding context providers goes here.
 * Read more: https://docs.expo.dev/router/basics/layout/#root-layout
 */
import { Tabs } from 'expo-router';

import { TabBarIcon } from '../../components/TabBarIcon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          href: null, // 👈 hides it from the tab bar
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
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
