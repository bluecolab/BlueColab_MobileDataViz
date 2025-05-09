import { View, Text, TouchableOpacity, Linking } from 'react-native';

export default function LinkComp({ label, url }: { label: string; url: string }) {
    const handleLinkPress = (url: string) => {
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
}
