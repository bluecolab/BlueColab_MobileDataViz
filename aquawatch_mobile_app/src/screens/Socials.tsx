import React from 'react';
import { ScrollView, Text, View, Linking } from 'react-native';

const handleLinkPress = (url) => {
    Linking.openURL(url);
};

// Link Component that uses Tailwind classes and dark mode
const LinkComp = ({ url, label }) => (
    <Text
        onPress={() => handleLinkPress(url)}
        className="underline text-blue-400 dark:text-blue-300"
    >
        {label}
    </Text>
);


export default function Socials() {

    return (
        <ScrollView className="bg-defaultbackground dark:bg-defaultdarkbackground">
            <View className="m-default rounded-3xl  bg-white dark:bg-gray-700 p-default tracking-tight">
                <Text className="text-xl font-bold text-black dark:text-white">Follow Us!</Text>
                
                <Text className="text-lg pl-3 text-black dark:text-white"><LinkComp url={"https://www.instagram.com/bluecolab/"} label={"Instagram"}/></Text>
                <Text className="text-lg pl-3 text-black dark:text-white"><LinkComp url={"https://www.tiktok.com/@bluecolab"} label={"TikTok"}/></Text>
                <Text className="text-lg pl-3 text-black dark:text-white"><LinkComp url={"https://bluecolab.pace.edu/"} label={"Blue CoLab Blogs"}/></Text>
                <Text className="text-lg pl-3 text-black dark:text-white"><LinkComp url={"https://github.com/bluecolab"} label={"GitHub"}/></Text>

            </View>
        </ScrollView>
    );
}
