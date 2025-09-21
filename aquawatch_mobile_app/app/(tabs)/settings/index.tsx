import { FontAwesome } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

import SettingsDropdown from '@/components/SettingsDropdown';
import { ColorScheme, useColorScheme } from '@/contexts/ColorSchemeContext';
import { useGraphData } from '@/contexts/GraphDataContext';
import getMetadata from '@/utils/getMetadata';

export default function Index() {
    const {
        changeLocation,
        changeTemperatureUnit,
        defaultLocation,
        defaultTempUnit,
        showConvertedUnits,
        changeConvertedUnits,
    } = useGraphData();
    const { isDark, colorSchemeSys, changeColor } = useColorScheme();
    const { locationOptions } = getMetadata();

    const [selectedLocation, setSelectedLocation] = useState(
        `${locationOptions.findIndex((e) => e.label.toLowerCase() === defaultLocation?.name?.toLowerCase()) + 1}`
    );

    const onLocationSelect = (value: string) => {
        const newLocation = locationOptions.find((option) => option.value === value)?.label || '';
        changeLocation({ name: newLocation });
        setSelectedLocation(value);
    };

    const tempUnitOptions = [
        { label: 'Fahrenheit ', value: '1' },
        { label: 'Celsius', value: '2' },
    ];
    const [selectedTempUnit, setSelectedTempUnit] = useState(
        `${tempUnitOptions.findIndex((e) => e.label.toLowerCase().trim() === defaultTempUnit?.toLowerCase().trim()) + 1}`
    );

    const onTempUnitSelect = (value: string) => {
        const newTempUnit = tempUnitOptions.find((option) => option.value === value)?.label || '';
        changeTemperatureUnit(newTempUnit);
        setSelectedTempUnit(value);
    };

    const appearanceOptions = [
        { label: 'System', value: '1' },
        { label: 'Light', value: '2' },
        { label: 'Dark', value: '3' },
    ];
    const [selectedAppearance, setSelectedAppearance] = useState(
        `${appearanceOptions.findIndex((e) => e.label.toLowerCase() === colorSchemeSys.toLowerCase()) + 1}`
    );
    const onAppearanceSelect = (value: string) => {
        setSelectedAppearance(value);
        const newColorScheme =
            (appearanceOptions
                .find((option) => option.value === value)
                ?.label.toLowerCase() as ColorScheme) || 'system';
        changeColor(newColorScheme);
    };

    const resetToDefault = () => {
        onAppearanceSelect('1');
        onTempUnitSelect('1');
        onLocationSelect('1');
        changeConvertedUnits(false);
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Settings',
                    headerStyle: {
                        backgroundColor: isDark ? '#2e2e3b' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                }}
            />
            <ScrollView className="bg-defaultbackground p-5 dark:bg-defaultdarkbackground">
                <View className="rounded-3xl bg-white px-2 py-4 dark:bg-gray-700">
                    <Text className="mr-4 text-2xl font-bold dark:text-white">Configurations:</Text>
                    <View
                        style={{
                            borderBottomWidth: 0.5,
                            borderBottomColor: isDark ? 'white' : 'black',
                            marginVertical: 5,
                        }}
                    />
                    <SettingsDropdown
                        label="Default Location"
                        options={locationOptions}
                        value={selectedLocation}
                        onSelect={onLocationSelect}
                    />
                    <View
                        style={{
                            borderBottomWidth: 0.5,
                            borderBottomColor: isDark ? 'white' : 'lightgray',
                            marginVertical: 1,
                        }}
                    />
                    <View className=" flex-row items-center justify-between py-2">
                        <Text className="ml-2 text-lg dark:text-white">Show Converted Units</Text>
                        <TouchableOpacity
                            onPress={() => changeConvertedUnits(!showConvertedUnits)}
                            style={{
                                backgroundColor: showConvertedUnits ? '#2563eb' : '#e5e7eb',
                                borderRadius: 16,
                                paddingVertical: 6,
                                paddingHorizontal: 16,
                            }}>
                            <Text style={{ color: showConvertedUnits ? 'white' : 'black' }}>
                                {showConvertedUnits ? 'Converted' : 'Original'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            borderBottomWidth: 0.5,
                            borderBottomColor: isDark ? 'white' : 'lightgray',
                            marginVertical: 1,
                        }}
                    />
                    <SettingsDropdown
                        label="Unit:"
                        options={tempUnitOptions}
                        value={selectedTempUnit}
                        onSelect={onTempUnitSelect}
                    />
                    <View
                        style={{
                            borderBottomWidth: 0.5,
                            borderBottomColor: isDark ? 'white' : 'lightgray',
                            marginVertical: 1,
                        }}
                    />
                    <SettingsDropdown
                        label="Appearance:"
                        options={appearanceOptions}
                        value={selectedAppearance}
                        onSelect={onAppearanceSelect}
                    />
                    <View
                        style={{
                            borderBottomWidth: 0.5,
                            borderBottomColor: isDark ? 'white' : 'lightgray',
                            marginVertical: 1,
                        }}
                    />
                    <View className="mt-2 flex-row justify-end">
                        <TouchableOpacity
                            onPress={() => resetToDefault()}
                            className="rounded-lg bg-gray-200 px-4 py-2 dark:bg-gray-700">
                            <Text className="text-md text-right dark:text-white">Reset All</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="mt-4 rounded-3xl  bg-white px-2 py-4 dark:bg-gray-700">
                    <Text className="text-2xl font-bold  dark:text-white">Other:</Text>
                    <View
                        style={{
                            borderBottomWidth: 0.5,
                            borderBottomColor: isDark ? 'white' : 'black',
                            marginVertical: 5,
                        }}
                    />
                    <TouchableOpacity onPress={() => router.push('/settings/feedback')}>
                        <View className="flex-row items-center">
                            <Text className="mr-2 text-lg dark:text-white">Feedback</Text>
                            <FontAwesome
                                name="sign-in"
                                size={20}
                                color={isDark ? 'white' : 'grey'}
                            />
                        </View>
                    </TouchableOpacity>
                    <View
                        style={{
                            borderBottomWidth: 0.5,
                            borderBottomColor: isDark ? 'white' : 'lightgray',
                            marginVertical: 1,
                        }}
                    />
                    <TouchableOpacity onPress={() => router.push('/settings/versionHistory')}>
                        <View className="flex-row items-center">
                            <Text className="mr-2 text-lg  dark:text-white">Version History</Text>
                            <FontAwesome
                                name="sign-in"
                                size={20}
                                color={isDark ? 'white' : 'grey'}
                            />
                        </View>
                    </TouchableOpacity>
                    <View
                        style={{
                            borderBottomWidth: 0.5,
                            borderBottomColor: isDark ? 'white' : 'lightgray',
                            marginVertical: 1,
                        }}
                    />
                    <TouchableOpacity onPress={() => router.push('/settings/attributions')}>
                        <View className="flex-row items-center">
                            <Text className="mr-2 text-lg  dark:text-white">Attributions</Text>
                            <FontAwesome
                                name="sign-in"
                                size={20}
                                color={isDark ? 'white' : 'grey'}
                            />
                        </View>
                    </TouchableOpacity>
                    <View
                        style={{
                            borderBottomWidth: 0.5,
                            borderBottomColor: isDark ? 'white' : 'lightgray',
                            marginVertical: 1,
                        }}
                    />
                    <TouchableOpacity onPress={() => router.push('/settings/socials')}>
                        <View className="flex-row items-center">
                            <Text className="mr-2 text-lg  dark:text-white">Socials</Text>
                            <FontAwesome
                                color={isDark ? 'white' : 'grey'}
                                name="sign-in"
                                size={20}
                            />
                        </View>
                    </TouchableOpacity>
                    <View
                        style={{
                            borderBottomWidth: 0.5,
                            borderBottomColor: isDark ? 'white' : 'lightgray',
                            marginVertical: 1,
                        }}
                    />
                </View>
            </ScrollView>
        </>
    );
}
