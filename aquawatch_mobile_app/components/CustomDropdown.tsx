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
                                setModalVisible(false);
                                onSelect(String(itemValue));
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
