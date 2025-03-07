import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useIsDark } from "@contexts";

const DropdownComponent = ({ label, options, value, onSelect }) => {
  const { isDark } = useIsDark();
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    setIsFocus(false); // Reset the focus when the value changes
  }, [value]);

  return (
    <View className="p-4">
      {(value || isFocus) && (
        <Text className={`absolute left-4 -top-2 z-10 px-2 text-sm ${isFocus ? 'text-blue-500' : isDark ? 'text-white' : 'text-gray-500'}`}>
          {label}
        </Text>
      )}
      <Dropdown
        style={{
          height: 50,
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

export default DropdownComponent;
