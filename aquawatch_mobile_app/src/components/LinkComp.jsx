
import React from 'react';
import { View, Text , TouchableOpacity, Linking } from 'react-native';

const LinkComp = ({ label, url }) => {
    const handleLinkPress = (url) => {
        Linking.openURL(url);
    };

    return (
        <View className="flex-row items-center space-x-2">
            <Text className="dark:text-gray-300 pr-2">•</Text>
            <TouchableOpacity onPress={() => handleLinkPress(url)}>
                <Text className="underline text-blue-400">{label}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LinkComp;
