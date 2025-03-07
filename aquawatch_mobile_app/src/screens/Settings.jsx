import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SettingsDropdown } from "@components";
import { useIsDark, useGraphData } from "@contexts";
import { FontAwesome } from "@expo/vector-icons";


export default function Settings({navigation}) {
  const { changeLocation, changeUnit, defaultLocation, defaultTempUnit  } = useGraphData();
  const {isDark, colorSchemeSys,  changeColor}  = useIsDark();

  const handleAttributionPress = () => {
    navigation.navigate("Attributions");
  }
  const handleFeedbackPress = () => {
    navigation.navigate("Feedback");
  }
  const handleVersionHistoryPress = () => {
    navigation.navigate("Version History");
  }
  const handleSocialsPress = () => {
    navigation.navigate("Socials");
  }

  const locationOptions = [
    { label: 'Choate Pond', value: '1'},
    { label: 'Piermont', value: '2'},
    { label: 'West Point', value: '3'},
    { label: 'Poughkeepsie', value: '4'},
    { label: 'New York City', value: '5'},
    { label: 'Albany', value: '6'},
  ]

  const [selectedLocation, setSelectedLocation] = useState(
    `${(locationOptions.findIndex((e) => e.label.toLowerCase() === defaultLocation.toLowerCase()) + 1)}`
  );

  const onLocationSelect = (value) => {
    const newLocation = locationOptions.find(option => option.value === value)?.label || '';
    changeLocation(newLocation);
    setSelectedLocation(value);
  };

  const tempUnitOptions = [
    { label: 'Fahrenheit ', value: '1' },
    { label: 'Celsius', value: '2' },
  ];
  const [selectedTempUnit, setSelectedTempUnit] = useState(
    `${(tempUnitOptions.findIndex((e) => e.label.toLowerCase() === defaultTempUnit.toLowerCase()) + 1)}`
  );

  const onTempUnitSelect = (value) => {
    const newTempUnit = tempUnitOptions.find(option => option.value === value)?.label || '';
    changeUnit(newTempUnit);
    setSelectedTempUnit(value);
  };

  const appearanceOptions = [
    { label: 'System', value: '1' },
    { label: 'Light', value: '2' },
    { label: 'Dark', value: '3' },
  ];
  const [selectedAppearance, setSelectedAppearance] = useState(
    `${(appearanceOptions.findIndex((e) => e.label.toLowerCase() === colorSchemeSys.toLowerCase()) + 1)}`
  );
  const onAppearanceSelect = (value) => {
    setSelectedAppearance(value);  
    const newColorScheme = appearanceOptions.find(option => option.value === value)?.label.toLowerCase() || '';
    changeColor(newColorScheme);
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
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: isDark ? 'white' : 'black', marginVertical: 5 }} />
        <SettingsDropdown label="Default Location" options={locationOptions} value={selectedLocation} onSelect={onLocationSelect} />
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: isDark ? 'white' : 'lightgray', marginVertical: 1 }} />
        <SettingsDropdown label="Unit:" options={tempUnitOptions} value={selectedTempUnit} onSelect={onTempUnitSelect} />
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: isDark ? 'white' : 'lightgray', marginVertical: 1 }} />
        <SettingsDropdown label="Appearance:" options={appearanceOptions} value={selectedAppearance} onSelect={onAppearanceSelect} />
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: isDark ? 'white' : 'lightgray', marginVertical: 1 }} />
        <View className="flex-row justify-end mt-2">
          <TouchableOpacity onPress={() => resetToDefault()} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
            <Text className="text-md text-right dark:text-white">Reset All</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="bg-white dark:bg-gray-700  px-2 py-4 rounded-3xl mt-4">
        <Text className="text-2xl font-bold  dark:text-white">Other:</Text>
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: isDark ? 'white' : 'black', marginVertical: 5 }} />
        <TouchableOpacity onPress={handleFeedbackPress}> 
          <View className="flex-row items-center">
            <Text className="text-lg mr-2  dark:text-white">Feedback</Text>
            <FontAwesome name="sign-in" size={20} color={isDark ? "white" : "grey"}  />
          </View>
        </TouchableOpacity>
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: isDark ? 'white' : 'lightgray', marginVertical: 1 }} />
        <TouchableOpacity onPress={handleVersionHistoryPress}>
          <View className="flex-row items-center">
            <Text className="text-lg mr-2  dark:text-white">Version History</Text>
            <FontAwesome name="sign-in" size={20} color={isDark ? "white" : "grey"} />
          </View>
        </TouchableOpacity>
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: isDark ? 'white' : 'lightgray', marginVertical: 1 }} />
        <TouchableOpacity onPress={handleAttributionPress}>
          <View className="flex-row items-center">
            <Text className="text-lg mr-2  dark:text-white">Attributions</Text>
            <FontAwesome name="sign-in" size={20} color={isDark ? "white" : "grey"} />
          </View>
        </TouchableOpacity>
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: isDark ? 'white' : 'lightgray', marginVertical: 1 }} />
        <TouchableOpacity onPress={handleSocialsPress}>
          <View className="flex-row items-center">
            <Text className="text-lg mr-2  dark:text-white">Socials</Text>
            <FontAwesome 
              color={isDark ? "white" : "grey"} 
              name="sign-in" size={20} />
          </View>
        </TouchableOpacity>
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: isDark ? 'white' : 'lightgray', marginVertical: 1 }} />

      </View>
    </ScrollView>
  );
}
