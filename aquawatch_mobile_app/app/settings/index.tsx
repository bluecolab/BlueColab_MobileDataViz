import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';

import SettingsDropdown from '@/components/SettingsDropdown';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useUserSettings } from '@/contexts/UserSettingsContext';
import { ColorScheme } from '@/types/colorScheme.enum';
import { TemperatureUnit } from '@/types/temperature.enum';
import capitalize from '@/utils/capitalize';

function HeaderGoBackButton({ onPress, color }: { onPress: () => void; color: string }) {
    return (
        <Pressable onPress={onPress} accessibilityLabel="Settings" className="pr-4">
            <Ionicons
                name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
                size={24}
                color={color}
            />
        </Pressable>
    );
}

export default function Index() {
    const {
        defaultTemperatureUnit,
        showConvertedUnits,
        changeTemperatureUnit,
        changeConvertedUnits,
    } = useUserSettings();
    const { isDark, colorSchemeSys, changeColor } = useColorScheme();

    const tempUnitOptions = [
        { label: TemperatureUnit.Fahrenheit, value: '1' },
        { label: TemperatureUnit.Celsius, value: '2' },
    ];
    const [selectedTempUnitValue, setSelectedTempUnitValue] = useState(
        `${tempUnitOptions.findIndex((e) => e.label.toLowerCase().trim() === defaultTemperatureUnit?.toLowerCase().trim()) + 1}`
    );

    const onTemperatureUnitSelect = (value: string) => {
        const newTempUnit = tempUnitOptions.find((option) => option.value === value)?.label || '';
        changeTemperatureUnit(newTempUnit as TemperatureUnit);
        setSelectedTempUnitValue(value);
    };

    const appearanceOptions = [
        { label: capitalize(ColorScheme.system), value: '1' },
        { label: capitalize(ColorScheme.light), value: '2' },
        { label: capitalize(ColorScheme.dark), value: '3' },
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
        onTemperatureUnitSelect('1');
        changeConvertedUnits(false);
    };

    const headerLeft = useCallback(
        () => (
            <HeaderGoBackButton
                onPress={() => router.push('../')}
                color={isDark ? 'white' : 'black'}
            />
        ),
        [isDark]
    );

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Settings',
                    headerStyle: {
                        backgroundColor: isDark ? '#2C2C2E' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                    headerLeft,
                }}
            />
            <ScrollView className="dark:bg-darkBackground bg-lightBackground p-5">
                <View className="dark:bg-darkCardBackground rounded-3xl bg-white px-2 py-4">
                    <Text className="dark:text-darkText mr-4 text-2xl font-bold">
                        Configurations:
                    </Text>
                    <View
                        style={{
                            borderBottomWidth: 0.5,
                            borderBottomColor: isDark ? 'white' : 'black',
                            marginVertical: 5,
                        }}
                    />
                    <View className=" flex-row items-center justify-between py-2">
                        <Text className="dark:text-darkText ml-2 text-lg">
                            Show Converted Units:
                        </Text>
                        <Pressable
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
                        </Pressable>
                    </View>
                    <View
                        style={{
                            borderBottomWidth: isDark ? 0 : 0.5,
                            borderBottomColor: isDark ? 'white' : '',
                            marginVertical: 1,
                        }}
                    />
                    <SettingsDropdown
                        label="Temperature:"
                        options={tempUnitOptions}
                        value={selectedTempUnitValue}
                        onSelect={onTemperatureUnitSelect}
                    />
                    <View
                        style={{
                            borderBottomWidth: isDark ? 0 : 0.5,
                            borderBottomColor: isDark ? 'white' : '',
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
                            borderBottomWidth: isDark ? 0 : 0.5,
                            borderBottomColor: isDark ? 'white' : '',
                            marginVertical: 1,
                        }}
                    />
                    <View className="mt-2 flex-row justify-end">
                        <Pressable
                            onPress={() => resetToDefault()}
                            className="dark:bg-darkCardBackgroundLvl1 rounded-lg bg-gray-200 px-4 py-2">
                            <Text className="text-md dark:text-darkText text-right">Reset All</Text>
                        </Pressable>
                    </View>
                </View>
                <View className="dark:bg-darkCardBackground mt-4  rounded-3xl bg-white px-2 py-4">
                    <Text className="dark:text-darkText text-2xl  font-bold">Other:</Text>
                    <View
                        style={{
                            borderBottomWidth: 0.5,
                            borderBottomColor: isDark ? 'white' : 'black',
                            marginVertical: 5,
                        }}
                    />
                    <Pressable onPress={() => router.push('/settings/feedback')}>
                        <View className="flex-row items-center">
                            <Text className="dark:text-darkText mr-2 text-lg">Feedback</Text>
                            <FontAwesome
                                name="sign-in"
                                size={20}
                                color={isDark ? 'white' : 'grey'}
                            />
                        </View>
                    </Pressable>
                    <View
                        style={{
                            borderBottomWidth: isDark ? 0 : 0.5,
                            borderBottomColor: isDark ? 'white' : '',
                            marginVertical: 1,
                        }}
                    />
                    <Pressable onPress={() => router.push('/settings/versionHistory')}>
                        <View className="flex-row items-center">
                            <Text className="dark:text-darkText mr-2  text-lg">
                                Version History
                            </Text>
                            <FontAwesome
                                name="sign-in"
                                size={20}
                                color={isDark ? 'white' : 'grey'}
                            />
                        </View>
                    </Pressable>
                    <View
                        style={{
                            borderBottomWidth: isDark ? 0 : 0.5,
                            borderBottomColor: isDark ? 'white' : '',
                            marginVertical: 1,
                        }}
                    />
                    <Pressable onPress={() => router.push('/settings/attributions')}>
                        <View className="flex-row items-center">
                            <Text className="dark:text-darkText mr-2  text-lg">Attributions</Text>
                            <FontAwesome
                                name="sign-in"
                                size={20}
                                color={isDark ? 'white' : 'grey'}
                            />
                        </View>
                    </Pressable>
                    <View
                        style={{
                            borderBottomWidth: isDark ? 0 : 0.5,
                            borderBottomColor: isDark ? 'white' : '',
                            marginVertical: 1,
                        }}
                    />
                    <Pressable onPress={() => router.push('/settings/socials')}>
                        <View className="flex-row items-center">
                            <Text className="dark:text-darkText mr-2  text-lg">Socials</Text>
                            <FontAwesome
                                color={isDark ? 'white' : 'grey'}
                                name="sign-in"
                                size={20}
                            />
                        </View>
                    </Pressable>
                    <View
                        style={{
                            borderBottomWidth: isDark ? 0 : 0.5,
                            borderBottomColor: isDark ? 'white' : '',
                            marginVertical: 1,
                        }}
                    />
                </View>
            </ScrollView>
        </>
    );
}
