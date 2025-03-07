import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useIsDark } from '@contexts';

const SettingsDropdown = ({ label, options, value, onSelect }) => {
    const { isDark } = useIsDark();
    const [isFocus, setIsFocus] = useState(false);

    useEffect(() => {
        setIsFocus(false); // Reset the focus when the value changes
    }, [value]);

    return (
        <View className="flex-row items-center justify-between my-1">
            <Text className="text-lg dark:text-white text-black">
                {label}
            </Text>

            <Dropdown
                style={{
                    height: 30,
                    width: 175,
                    borderColor: isFocus ? 'blue' : 'gray',
                    borderWidth: 0.5,
                    paddingHorizontal: 8,
                    backgroundColor: isDark ? '#333333' : 'white',
                }}
                renderItem={(item, selected) => (
                    <View
                        style={{
                            backgroundColor: selected ? (isDark ? '#777' : '#d0d0d0') : isDark ? '#555' : 'white', // Improve background handling
                            padding: 10,
                        }}
                    >
                        <Text style={{ color: isDark ? 'white' : 'black' }}>
                            {item.label}
                        </Text>
                    </View>
                )}
                itemTextStyle={{
                    color: isDark ? 'white' : 'black',
                    fontSize: 16,
                }}
                placeholderStyle={{
                    fontSize: 16,
                    color: isDark ? 'white' : 'black',
                }}
                selectedTextStyle={{
                    fontSize: 16,
                    color: isDark ? 'white' : 'black',
                }}
                data={options}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select item' : '...'}
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    onSelect(item.value);
                    setIsFocus(false);
                }}
            />

        </View>

    );
};

export default SettingsDropdown;
