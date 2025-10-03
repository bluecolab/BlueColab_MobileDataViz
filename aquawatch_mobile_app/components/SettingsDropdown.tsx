import { Picker } from '@react-native-picker/picker';
import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Platform,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useColorScheme } from '@/contexts/ColorSchemeContext';

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

    const { height } = Dimensions.get('window');

    const backdropOpacity = useSharedValue(0);
    const modalTranslateY = useSharedValue(height); // Start off-screen

    const backdropAnimatedStyle = useAnimatedStyle(() => ({
        opacity: backdropOpacity.value,
    }));

    const modalAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: modalTranslateY.value }],
    }));

    const openModal = useCallback(() => {
        backdropOpacity.value = withTiming(1, { duration: 300 });
        modalTranslateY.value = withTiming(0, { duration: 200 });
    }, [backdropOpacity, modalTranslateY]);

    const closeModal = useCallback(() => {
        backdropOpacity.value = withTiming(0, { duration: 300 });
        modalTranslateY.value = withTiming(height, { duration: 300 });
        setModalVisible(false);
    }, [backdropOpacity, height, modalTranslateY]);

    useEffect(() => {
        if (modalVisible) {
            openModal();
        }
    }, [modalVisible, openModal]);

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
                    }}>
                    <Text
                        style={{
                            color: isDark ? 'white' : 'black',
                            fontSize: 16,
                            textAlign: 'right',
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {options.find((o) => o.value === value)?.label || label}
                    </Text>
                </TouchableOpacity>
                <Modal
                    visible={modalVisible}
                    transparent
                    animationType="none"
                    onRequestClose={() => setModalVisible(false)}>
                    <TouchableWithoutFeedback onPress={closeModal}>
                        <Animated.View
                            style={[
                                {
                                    flex: 1,
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                },
                                backdropAnimatedStyle,
                            ]}
                        />
                    </TouchableWithoutFeedback>

                    <Animated.View
                        style={[
                            {
                                position: 'absolute',
                                bottom: 0,
                                height: '40%',
                                width: '100%',
                                backgroundColor: isDark ? '#1a202c' : '#f1f1f1',
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                                padding: 20,
                            },
                            modalAnimatedStyle,
                        ]}>
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
                    </Animated.View>
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
