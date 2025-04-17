import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';

const LinkComp = ({ label, url }) => {
  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  return (
    <View className="flex-row items-center space-x-2">
      <Text className="pr-2 dark:text-gray-300">•</Text>
      <TouchableOpacity onPress={() => handleLinkPress(url)}>
        <Text className="text-blue-400 underline">{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LinkComp;
