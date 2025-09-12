import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Platform } from 'react-native';

import { useColorScheme } from '@/contexts/ColorSchemeContext';

// ...existing imports...

export default function SettingsDropdown({
    label,
    options,
    value,
    onSelect,
}: {
    label: string;
    options: { label: string; value: string }[];
    value: string | number;
    onSelect: (value: string) => void;
}) {
    const { isDark } = useColorScheme();
    const [modalVisible, setModalVisible] = useState(false);

    // iOS: Show a button, open Picker in a modal
    if (Platform.OS === 'ios') {
        return (
            <View
                style={{
                    padding: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                <Text
                    style={{
                        color: isDark ? 'white' : 'black',
                        fontSize: 16,
                        flexShrink: 1,
                        marginRight: 8,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {label}
                </Text>
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={{
                        backgroundColor: isDark ? '#333333' : 'white',
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        minWidth: 150, // Increased width
                        maxWidth: 220, // Optional: set a max width
                        alignItems: 'center',
                    }}>
                    <Text
                        style={{
                            color: isDark ? 'white' : 'black',
                            fontSize: 16,
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {options.find((o) => o.value === value)?.label || label}
                    </Text>
                </TouchableOpacity>
                <Modal
                    visible={modalVisible}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            backgroundColor: 'rgba(0,0,0,0.3)',
                        }}
                        activeOpacity={1}
                        onPressOut={() => setModalVisible(false)}>
                        <View
                            style={{
                                backgroundColor: isDark ? '#333333' : 'white',
                                padding: 16,
                            }}>
                            <Picker
                                selectedValue={value}
                                onValueChange={(itemValue) => {
                                    onSelect(String(itemValue));
                                    setModalVisible(false);
                                }}
                                style={{
                                    color: isDark ? 'white' : 'black',
                                }}>
                                {options.map((option) => (
                                    <Picker.Item
                                        key={option.value}
                                        label={option.label}
                                        value={option.value}
                                        color={isDark ? 'white' : 'black'}
                                    />
                                ))}
                            </Picker>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        );
    }

    // Android: Show Picker inline, label left, picker right
    return (
        <View
            style={{
                padding: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
            <Text
                style={{
                    color: isDark ? 'white' : 'black',
                    fontSize: 16,
                    flexShrink: 1,
                    marginRight: 8,
                }}
                numberOfLines={1}
                ellipsizeMode="tail">
                {label}
            </Text>
            <View style={{ minWidth: 150, maxWidth: 220, flex: 1 }}>
                <Picker
                    selectedValue={value}
                    onValueChange={(itemValue) => onSelect(String(itemValue))}
                    style={{
                        backgroundColor: isDark ? '#333333' : 'white',
                        color: isDark ? 'white' : 'black',
                        height: 60,
                        width: '100%',
                    }}>
                    {options.map((option) => (
                        <Picker.Item
                            key={option.value}
                            label={option.label}
                            value={option.value}
                            color={isDark ? 'white' : 'black'}
                        />
                    ))}
                </Picker>
            </View>
        </View>
    );
}
