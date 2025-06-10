import { handleLinkPress } from '@/components/LinkComp';
import { useIsDark } from '@/contexts/ColorSchemeContext';
import { Stack } from 'expo-router';
import React from 'react';
import { Text, ScrollView, View } from 'react-native';


interface LinkCompProps {
    url: string;
    label: string;
}

const LinkComp = ({ url, label }: LinkCompProps) => (

    <Text onPress={() => handleLinkPress(url)} className="underline text-blue-400">
        <Text>{label}</Text>
    </Text>
);

export default function Feedback() {
    const { isDark } = useIsDark();
    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Feedback',
                    headerStyle: {
                        backgroundColor: isDark ? '#2e2e3b' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                }}
            />
            <ScrollView className="bg-defaultbackground dark:bg-defaultdarkbackground">
                <View className="m-default rounded-3xl  bg-white dark:bg-gray-700 p-default tracking-tight">
                    <Text className="text-xl font-bold text-black dark:text-white">Bugs? Problems? Suggestions?</Text>

                    <Text className="text-lg pl-3 text-black dark:text-white">We're be happy to hear from you. Please fill the form <LinkComp url={"https://forms.gle/2y21wnxK3nJkbXpU6"} label={"here"} />.</Text>
                </View>
            </ScrollView>
        </>
    );
}
