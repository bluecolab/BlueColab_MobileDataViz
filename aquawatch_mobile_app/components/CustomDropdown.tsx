import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Platform } from 'react-native';

import { useColorScheme } from '@/contexts/ColorSchemeContext';

export default function CustomDropdown({
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

    if (Platform.OS === 'ios') {
        return (
            <View style={{ padding: 16 }}>
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={{
                        backgroundColor: isDark ? '#333333' : 'white',
                        padding: 12,
                        borderRadius: 8,
                    }}>
                    <Text style={{ color: isDark ? 'white' : 'black' }}>
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
                            style={{ backgroundColor: isDark ? '#333333' : 'white', padding: 16 }}>
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

    // Android: regular Picker
    return (
        <View style={{ padding: 16 }}>
            <Picker
                selectedValue={value}
                onValueChange={(itemValue) => onSelect(String(itemValue))}
                style={{
                    backgroundColor: isDark ? '#333333' : 'white',
                    color: isDark ? 'white' : 'black',
                    height: 50,
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
    );
}
