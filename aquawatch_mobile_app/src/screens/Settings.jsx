import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SettingsDropdown } from "@components";
import { useIsDark } from "@contexts";
import { FontAwesome } from "@expo/vector-icons";


export default function Settings() {
  const {isDark, colorScheme}  = useIsDark();

  const [selectedLocation, setSelectedLocation] = useState("1");
  const locationOptions = [
    { label: 'Choate Pond', value: '1' },
    { label: 'Hudson River Location 1', value: '2' },
    { label: 'Hudson River Location 2', value: '3' },
    { label: 'Hudson River Location 3', value: '4' },
  ];
  const onLocationSelect = (value) => {
    setSelectedLocation(value);
  };

  const [selectedTempUnit, setSelectedTempUnit] = useState("1");
  const tempUnitOptions = [
    { label: 'Fahrenheit ', value: '1' },
    { label: 'Celsius', value: '2' },
  ];
  const onTempUnitSelect = (value) => {
    setSelectedTempUnit(value);
  };

  const appearanceOptions = [
    { label: 'System', value: '1' },
    { label: 'Light', value: '2' },
    { label: 'Dark', value: '3' },
  ];

  const [selectedAppearance, setSelectedAppearance] = useState(
    `${(appearanceOptions.findIndex((e) => e.label.toLowerCase() === colorScheme.toLowerCase()) + 1)}`
  );

  const onAppearanceSelect = (value) => {
    setSelectedAppearance(value);  
    // Map the selected value to the corresponding color scheme
    let newColorScheme;
    switch (value) {
      case '1': // Device (system theme)
        newColorScheme = 'system';
        break;
      case '2': // Light
        newColorScheme = 'light';
        break;
      case '3': // Dark
        newColorScheme = 'dark';
        break;
      default:
        newColorScheme = 'system'; // Default to system if no match
        break;
    }
  
    // Set the color scheme using nativewind
    // setColorScheme(newColorScheme);
  };

  const resetToDefault = () => {
    onAppearanceSelect("1");
    onTempUnitSelect("1");
    onLocationSelect("1");
  }

  return (
    <ScrollView className="bg-defaultbackground dark:bg-defaultdarkbackground p-5">
      <View className="bg-white dark:bg-gray-700 px-2 py-4 rounded-3xl">
        <Text className="text-2xl font-bold mr-4 dark:text-white">Configurations:</Text>
        <View style={{ borderBottomWidth: 1, borderBottomColor: isDark ? 'white' : 'black', marginVertical: 5 }} />
        <SettingsDropdown label="Default Location" options={locationOptions} value={selectedLocation} onSelect={onLocationSelect} />
        <View style={{ borderBottomWidth: 1, borderBottomColor: isDark ? 'white' : 'lightgray', marginVertical: 1 }} />
        <SettingsDropdown label="Default Temperature Unit:" options={tempUnitOptions} value={selectedTempUnit} onSelect={onTempUnitSelect} />
        <View style={{ borderBottomWidth: 1, borderBottomColor: isDark ? 'white' : 'lightgray', marginVertical: 1 }} />
        <SettingsDropdown label="Appearance:" options={appearanceOptions} value={selectedAppearance} onSelect={onAppearanceSelect} />
        <View style={{ borderBottomWidth: 1, borderBottomColor: isDark ? 'white' : 'lightgray', marginVertical: 1 }} />
        <View className="flex-row justify-end mt-2">
          <TouchableOpacity onPress={() => resetToDefault()} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
            <Text className="text-md text-right dark:text-white">Reset All</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="bg-white dark:bg-gray-700  px-2 py-4 rounded-3xl mt-4">
        <Text className="text-2xl font-bold  dark:text-white">Other:</Text>
        <View style={{ borderBottomWidth: 1, borderBottomColor: isDark ? 'white' : 'black', marginVertical: 5 }} />
        <TouchableOpacity>
          <View className="flex-row items-center">
            <Text className="text-lg mr-2  dark:text-white">Feedback</Text>
            <FontAwesome name="sign-in" size={20} color={isDark ? "white" : "grey"}  />
          </View>
        </TouchableOpacity>
        <View style={{ borderBottomWidth: 1, borderBottomColor: isDark ? 'white' : 'lightgray', marginVertical: 1 }} />
        <TouchableOpacity>
          <View className="flex-row items-center">
            <Text className="text-lg mr-2  dark:text-white">Version History</Text>
            <FontAwesome name="sign-in" size={20} color={isDark ? "white" : "grey"} />
          </View>
        </TouchableOpacity>
        <View style={{ borderBottomWidth: 1, borderBottomColor: isDark ? 'white' : 'lightgray', marginVertical: 1 }} />
        <TouchableOpacity>
        
          <View className="flex-row items-center">
            <Text className="text-lg mr-2  dark:text-white">Attributions</Text>
            <FontAwesome name="sign-in" size={20} color={isDark ? "white" : "grey"} />
          </View>
        </TouchableOpacity>
        <View style={{ borderBottomWidth: 1, borderBottomColor: isDark ? 'white' : 'lightgray', marginVertical: 1 }} />
        <TouchableOpacity>
          <View className="flex-row items-center">
            <Text className="text-lg mr-2  dark:text-white">Socials</Text>
            <FontAwesome 
              color={isDark ? "white" : "grey"} 
              name="sign-in" size={20} />
          </View>
        </TouchableOpacity>
        <View style={{ borderBottomWidth: 1, borderBottomColor: isDark ? 'white' : 'lightgray', marginVertical: 1 }} />

      </View>
    </ScrollView>
  );
}
