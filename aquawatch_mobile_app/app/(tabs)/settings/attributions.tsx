import { handleLinkPress } from '@/components/LinkComp';
import { useIsDark } from '@/contexts/ColorSchemeContext';
import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
const LinkedIn_logo_initials = require('@/assets/icons/LinkedIn_logo_initials.png');

interface LinkCompProps {
    url: string;
    label: string;
    isLinkedin?: boolean;
}
const LinkComp = ({ url, label, isLinkedin }: LinkCompProps) => (
    <Text onPress={() => handleLinkPress(url)} className="text-blue-400 underline">
        {isLinkedin && <Image source={LinkedIn_logo_initials} style={{ width: 15, height: 15 }} />}
        <Text>{label}</Text>
    </Text>
);

interface ItemProps {
    name: string;
    label: string;
    link: string;
    team: string[];
    isLinkedin: boolean;
}

const Item = ({ name, label, link, team, isLinkedin }: ItemProps) => (
    <View className="py-1">
        <Text className="pl-3 text-lg text-black dark:text-white">{name}</Text>
        <Text className="pl-6 text-lg text-black dark:text-white">
            <LinkComp url={link} label={label} isLinkedin={isLinkedin} />
        </Text>
        {team.length > 0 ? (
            <Text className="pl-6 text-lg text-black dark:text-white">Team: {team.join(', ')}</Text>
        ) : (
            ''
        )}
    </View>
);

export default function Attributions() {
    const { isDark } = useIsDark();
    const TEAM = [
        {
            name: 'Alex Chen',
            label: 'in/yan-yu-chen-3474a71aa',
            linkedin: 'https://www.linkedin.com/in/yan-yu-chen-3474a71aa/',
            team: ['Blue Shield'],
        },
        {
            name: 'Nicholas Davila',
            label: 'in/nicholas--davila/',
            linkedin: 'https://www.linkedin.com/in/nicholas--davila/',
            team: ['Blue Shield'],
        },
        {
            name: 'Noor Ul Huda',
            label: 'in/noorulhuda92/',
            linkedin: 'https://www.linkedin.com/in/noorulhuda92/',
            team: ['Tic-Tac-Toe'],
        },
        {
            name: 'Lizi Imedashvilli',
            label: 'in/lizi-imedashvili-2b3a6b249/',
            linkedin: 'https://www.linkedin.com/in/lizi-imedashvili-2b3a6b249/',
            team: ['Data Divas', 'Tic-Tac-Toe'],
        },
        {
            name: 'Ardin Kraja',
            label: 'in/ardin-kraja-19ab61230/',
            linkedin: 'https://www.linkedin.com/in/ardin-kraja-19ab61230/',
            team: ['Blue Jelly'],
        },
        {
            name: 'Victor Lima',
            label: 'in/victor--lima',
            linkedin: 'https://www.linkedin.com/in/victor--lima',
            team: ['Data Divas'],
        },
        {
            name: 'Meryl Mizell',
            label: 'in/meryl-mizell/',
            linkedin: 'https://www.linkedin.com/in/meryl-mizell',
            team: ['Blue Jelly'],
        },
        {
            name: 'Charles Metayer',
            label: 'in/charles-metayer-jr-9a983b267/',
            linkedin: 'https://www.linkedin.com/in/charles-metayer-jr-9a983b267/',
            team: ['Blue Shield'],
        },
        {
            name: 'Lulu Moquette',
            label: 'in/louisamoquete',
            linkedin: 'https://www.linkedin.com/in/louisamoquete/',
            team: ['Blue Jelly+'],
        },
        {
            name: 'Kenji Okura',
            label: 'https://www.linkedin.com/in/kenji-okura/',
            linkedin: 'in/kenji-okura/',
            team: ['Blue Jelly', 'Data Divas', 'Tic-Tac-Toe'],
        },
        {
            name: 'Michael Rourke',
            label: 'in/michael-rourke-532b32225/',
            linkedin: 'https://www.linkedin.com/in/michael-rourke-532b32225/',
            team: ['Blue Shield'],
        },
        {
            name: 'Erin Sorbella',
            label: 'in/erin-sorbella-40936b241',
            linkedin: 'https://www.linkedin.com/in/erin-sorbella-40936b241',
            team: ['Blue Jelly'],
        },
    ];

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Attributions',
                    headerStyle: {
                        backgroundColor: isDark ? '#2e2e3b' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                }}
            />

            <ScrollView className="bg-defaultbackground dark:bg-defaultdarkbackground">
                <View className="m-default rounded-3xl  bg-white p-default tracking-tight dark:bg-gray-700">
                    <Text className="text-xl font-bold text-black dark:text-white">Core Team:</Text>
                    {TEAM.map((item, index) => {
                        return (
                            <Item
                                key={index}
                                name={item.name}
                                label={item.label}
                                link={item.linkedin}
                                team={item.team}
                                isLinkedin={true}
                            />
                        );
                    })}

                    <Text className="pl-3 text-lg text-black dark:text-white">
                        They are the team members who officially worked on this app.
                    </Text>
                </View>
                <View className="m-default rounded-3xl  bg-white p-default tracking-tight dark:bg-gray-700">
                    <Text className="mt-2 text-xl font-bold text-black dark:text-white">
                        Additional Mentions:
                    </Text>
                    <Text className="text-lg text-black dark:text-white">
                        We would like to give the following attributions:
                    </Text>

                    <Item
                        name={'George Moses'}
                        label={'in/george-m-moses/'}
                        link={'https://www.linkedin.com/in/george-m-moses/'}
                        team={[]}
                        isLinkedin={true}
                    />

                    <Item
                        name={'Ali Tejeda'}
                        label={'in/alexandra-tejeda/'}
                        link={'https://www.linkedin.com/in/alexandra-tejeda/'}
                        team={[]}
                        isLinkedin={true}
                    />

                    <Text className="pl-3 text-lg text-black dark:text-white">
                        They helped provide WQI calculations used by this application.
                    </Text>

                    <Text className="text-lg text-black dark:text-white">
                        Finally we would take a moment to thank all of supportive teams and testers
                        that worked along side us.
                    </Text>
                </View>

                <View className="m-default rounded-3xl  bg-white p-default tracking-tight dark:bg-gray-700">
                    <Text className="text-xl font-bold text-black dark:text-white">
                        Data Providers:
                    </Text>

                    <Item
                        name={'Blue CoLab for Choate Water data'}
                        label={'Blue CoLab'}
                        link={'https://bluecolab.pace.edu/'}
                        team={['Join Us!']}
                        isLinkedin={false}
                    />

                    <Item
                        name={'USGS for non-Choate Water data'}
                        label={'USGS Water Services'}
                        link={'https://waterservices.usgs.gov/'}
                        team={[]}
                        isLinkedin={false}
                    />

                    <Item
                        name={'OpenWeatherMap for AQI'}
                        label={'OpenWeatherMap'}
                        link={'https://openweathermap.org'}
                        team={[]}
                        isLinkedin={false}
                    />
                </View>
                <View className="m-default rounded-3xl  bg-white p-default tracking-tight dark:bg-gray-700">
                    <Text className="text-xl font-bold text-black dark:text-white">
                        Software packages:
                    </Text>

                    <Item
                        name="@expo/vector-icons"
                        label="Expo Vector Icons"
                        link="https://github.com/expo/vector-icons"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="@react-native-async-storage/async-storage"
                        label="Async Storage"
                        link="https://github.com/react-native-async-storage/async-storage"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="@react-navigation/native"
                        label="React Navigation Native"
                        link="https://github.com/react-navigation/react-navigation"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="@shopify/react-native-skia"
                        label="React Native Skia"
                        link="https://github.com/Shopify/react-native-skia"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="axios"
                        label="Axios"
                        link="https://github.com/axios/axios"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="expo"
                        label="Expo"
                        link="https://github.com/expo/expo"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="expo-constants"
                        label="Expo Constants"
                        link="https://github.com/expo/expo/tree/main/packages/expo-constants"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="expo-linear-gradient"
                        label="Expo Linear Gradient"
                        link="https://github.com/expo/expo/tree/main/packages/expo-linear-gradient"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="expo-linking"
                        label="Expo Linking"
                        link="https://github.com/expo/expo/tree/main/packages/expo-linking"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="expo-location"
                        label="Expo Location"
                        link="https://github.com/expo/expo/tree/main/packages/expo-location"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="expo-router"
                        label="Expo Router"
                        link="https://github.com/expo/router"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="expo-status-bar"
                        label="Expo Status Bar"
                        link="https://github.com/expo/expo/tree/main/packages/expo-status-bar"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="expo-system-ui"
                        label="Expo System UI"
                        link="https://github.com/expo/expo/tree/main/packages/expo-system-ui"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="expo-web-browser"
                        label="Expo Web Browser"
                        link="https://github.com/expo/expo/tree/main/packages/expo-web-browser"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="luxon"
                        label="Luxon"
                        link="https://github.com/moment/luxon"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="nativewind"
                        label="NativeWind"
                        link="https://github.com/marklawlor/nativewind"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="react"
                        label="React"
                        link="https://github.com/facebook/react"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="react-native"
                        label="React Native"
                        link="https://github.com/facebook/react-native"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="react-native-element-dropdown"
                        label="React Native Element Dropdown"
                        link="https://github.com/sonaye/react-native-element-dropdown"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="react-native-gesture-handler"
                        label="React Native Gesture Handler"
                        link="https://github.com/software-mansion/react-native-gesture-handler"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="react-native-picker-select"
                        label="React Native Picker Select"
                        link="https://github.com/lawnstarter/react-native-picker-select"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="react-native-reanimated"
                        label="React Native Reanimated"
                        link="https://github.com/software-mansion/react-native-reanimated"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="react-native-reanimated-carousel"
                        label="Reanimated Carousel"
                        link="https://github.com/dohoons/react-native-reanimated-carousel"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="react-native-safe-area-context"
                        label="Safe Area Context"
                        link="https://github.com/th3rdwave/react-native-safe-area-context"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="react-native-screens"
                        label="React Native Screens"
                        link="https://github.com/software-mansion/react-native-screens"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="react-native-webview"
                        label="React Native Webview"
                        link="https://github.com/react-native-webview/react-native-webview"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="tailwindcss"
                        label="Tailwind CSS"
                        link="https://github.com/tailwindlabs/tailwindcss"
                        team={[]}
                        isLinkedin={false}
                    />
                    <Item
                        name="victory-native"
                        label="Victory Native"
                        link="https://github.com/FormidableLabs/victory-native"
                        team={[]}
                        isLinkedin={false}
                    />
                </View>

                <View className="pb-[90] "></View>
            </ScrollView>
        </>
    );
}
