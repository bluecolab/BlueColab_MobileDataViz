import React from 'react';
import { View, Text, Linking, ScrollView, Image } from 'react-native';
import LinkedIn_logo_initials from '../../assets/LinkedIn_logo_initials.png';

export default function Attributions() {
    const handleLinkPress = (url) => {
        Linking.openURL(url);
    };
    const LinkComp = ({ url, label, isLinkedin }) => (

        <Text onPress={() => handleLinkPress(url)} className="underline text-blue-400">
            {isLinkedin && <Image
                source={LinkedIn_logo_initials}
                style={{ width: 15, height: 15 }}
            />}
            <Text>{label}</Text>
        </Text>
    );

    const TEAM = [
        {
            name: 'Alex Chen',
            label: 'in/yan-yu-chen-3474a71aa',
            linkedin: 'https://www.linkedin.com/in/yan-yu-chen-3474a71aa/',
            team: ['Blue Shield']
        },
        {
            name: 'Nicholas Davila',
            label: 'in/nicholas--davila/',
            linkedin: 'https://www.linkedin.com/in/nicholas--davila/',
            team: ['Blue Shield']
        },
        {
            name: 'Noor Ul Huda',
            label: 'in/noorulhuda92/',
            linkedin: 'https://www.linkedin.com/in/noorulhuda92/',
            team: ['Tic-Tac-Toe']
        },
        {
            name: 'Lizi Imedashvilli',
            label: 'in/lizi-imedashvili-2b3a6b249/',
            linkedin: 'https://www.linkedin.com/in/lizi-imedashvili-2b3a6b249/',
            team: ['Data Divas', 'Tic-Tac-Toe']
        },
        {
            name: 'Ardin Kraja',
            label: 'in/ardin-kraja-19ab61230/',
            linkedin: 'https://www.linkedin.com/in/ardin-kraja-19ab61230/',
            team: ['Blue Jelly']
        },
        {
            name: 'Victor Lima',
            label: 'in/victor--lima',
            linkedin: 'https://www.linkedin.com/in/victor--lima',
            team: ['Data Divas']
        },
        {
            name: 'Meryl Mizell',
            label: 'in/meryl-mizell/',
            linkedin: 'https://www.linkedin.com/in/meryl-mizell',
            team: ['Blue Jelly']
        },
        {
            name: 'Charles Metayer',
            label: 'in/charles-metayer-jr-9a983b267/',
            linkedin: 'https://www.linkedin.com/in/charles-metayer-jr-9a983b267/',
            team: ['Blue Shield']
        },
        {
            name: 'Kenji Okura',
            label: 'https://www.linkedin.com/in/kenji-okura/',
            linkedin: 'in/kenji-okura/',
            team: ['Blue Jelly', 'Data Divas', 'Tic-Tac-Toe']
        },
        {
            name: 'Michael Rourke',
            label: 'in/michael-rourke-532b32225/',
            linkedin: 'https://www.linkedin.com/in/michael-rourke-532b32225/',
            team: ['Blue Shield']
        },
        {
            name: 'Erin Sorbella',
            label: 'in/erin-sorbella-40936b241',
            linkedin: 'https://www.linkedin.com/in/erin-sorbella-40936b241',
            team: ['Blue Jelly']
        },
    ];

    const Item = ({ name, label, link, team, isLinkedin }) => (
        <View className="py-1">
            <Text className="pl-3 text-lg text-black dark:text-white">{name}</Text>
            <Text className="pl-6 text-lg text-black dark:text-white"><LinkComp url={link} label={label} isLinkedin={isLinkedin} /></Text>
            {team.length > 0 ? <Text className="pl-6 text-lg text-black dark:text-white">Team: {team.join(", ")}</Text> : ''}
        </View>
    );


    return (
        <ScrollView className="bg-defaultbackground dark:bg-defaultdarkbackground">
            <View className="m-default rounded-3xl  bg-white dark:bg-gray-700 p-default tracking-tight">
                <Text className="text-xl font-bold text-black dark:text-white">Core Team:</Text>
                {
                    TEAM.map((item, index) => {
                        return (
                            <Item key={index} name={item.name} label={item.label} link={item.linkedin} team={item.team} isLinkedin={true} />
                        );
                    })

                }

                <Text className="text-lg pl-3 text-black dark:text-white">They are the team members who officially worked on this app.</Text>
            </View>
            <View className="m-default rounded-3xl  bg-white dark:bg-gray-700 p-default tracking-tight">

                <Text className="text-xl mt-2 font-bold text-black dark:text-white">Additional Mentions:</Text>
                <Text className="text-lg text-black dark:text-white">We would like to give the following attributions:</Text>

                <Item name={"George Moses"} label={"in/george-m-moses/"} link={"https://www.linkedin.com/in/george-m-moses/"} team={[]} isLinkedin={true} />

                <Item name={"Ali Tejeda"} label={"in/alexandra-tejeda/"} link={"https://www.linkedin.com/in/alexandra-tejeda/"} team={[]} isLinkedin={true} />

                <Text className="text-lg pl-3 text-black dark:text-white">They helped provide WQI calculations used by this application.</Text>

                <Text className="text-lg text-black dark:text-white">Finally we would take a moment to thank all of supportive teams and testers that worked along side us.
                </Text>
            </View>

            <View className="m-default rounded-3xl  bg-white dark:bg-gray-700 p-default tracking-tight">
                <Text className="text-xl font-bold text-black dark:text-white">Data Providers:</Text>

                <Item name={"Blue CoLab for Choate Water data"} label={"Blue CoLab"} link={"https://bluecolab.pace.edu/"} team={['Join Us!']} isLinkedin={false} />

                <Item name={"USGS for non-Choate Water data"} label={"USGS Water Services"} link={"https://waterservices.usgs.gov/"} team={[]} isLinkedin={false} />

                <Item name={"OpenWeatherMap for AQI"} label={"OpenWeatherMap"} link={"https://openweathermap.org"} team={[]} isLinkedin={false} />
            </View>
            <View className="m-default rounded-3xl  bg-white dark:bg-gray-700 p-default tracking-tight">
                <Text className="text-xl font-bold text-black dark:text-white">Software packages:</Text>

                <Item name="react-native-async-storage" label="Async Storage" link="https://github.com/react-native-async-storage/async-storage" team={[]} isLinkedin={false} />
                <Item name="react-native-picker" label="Picker" link="https://github.com/react-native-picker/picker" team={[]} isLinkedin={false} />
                <Item name="react-navigation-bottom-tabs" label="Bottom Tabs" link="https://github.com/react-navigation/bottom-tabs" team={[]} isLinkedin={false} />
                <Item name="react-navigation-native" label="React Navigation" link="https://github.com/react-navigation/native" team={[]} isLinkedin={false} />
                <Item name="react-navigation-stack" label="Stack Navigation" link="https://github.com/react-navigation/stack" team={[]} isLinkedin={false} />
                <Item name="react-native-skia" label="React Native Skia" link="https://github.com/Shopify/react-native-skia" team={[]} isLinkedin={false} />
                <Item name="axios" label="Axios" link="https://github.com/axios/axios" team={[]} isLinkedin={false} />
                <Item name="expo" label="Expo" link="https://github.com/expo/expo" team={[]} isLinkedin={false} />
                <Item name="expo-file-system" label="Expo File System" link="https://github.com/expo/expo/tree/main/packages/expo-file-system" team={[]} isLinkedin={false} />
                <Item name="expo-font" label="Expo Font" link="https://github.com/expo/expo/tree/main/packages/expo-font" team={[]} isLinkedin={false} />
                <Item name="expo-linear-gradient" label="Expo Linear Gradient" link="https://github.com/expo/expo/tree/main/packages/expo-linear-gradient" team={[]} isLinkedin={false} />
                <Item name="expo-location" label="Expo Location" link="https://github.com/expo/expo/tree/main/packages/expo-location" team={[]} isLinkedin={false} />
                <Item name="expo-splash-screen" label="Expo Splash Screen" link="https://github.com/expo/expo/tree/main/packages/expo-splash-screen" team={[]} isLinkedin={false} />
                <Item name="moment" label="Moment" link="https://github.com/moment/moment" team={[]} isLinkedin={false} />
                <Item name="nativewind" label="NativeWind" link="https://github.com/marklawlor/nativewind" team={[]} isLinkedin={false} />
                <Item name="react" label="React" link="https://github.com/facebook/react" team={[]} isLinkedin={false} />
                <Item name="react-native" label="React Native" link="https://github.com/facebook/react-native" team={[]} isLinkedin={false} />
                <Item name="react-native-element-dropdown" label="React Native Element Dropdown" link="https://github.com/sonaye/react-native-element-dropdown" team={[]} isLinkedin={false} />
                <Item name="react-native-gesture-handler" label="React Native Gesture Handler" link="https://github.com/software-mansion/react-native-gesture-handler" team={[]} isLinkedin={false} />
                <Item name="react-native-navigation-bar" label="React Native Navigation Bar" link="https://github.com/kwankwan/react-native-navigation-bar" team={[]} isLinkedin={false} />
                <Item name="react-native-orientation-locker" label="React Native Orientation Locker" link="https://github.com/wonday/react-native-orientation-locker" team={[]} isLinkedin={false} />
                <Item name="react-native-picker-select" label="React Native Picker Select" link="https://github.com/lawnstarter/react-native-picker-select" team={[]} isLinkedin={false} />
                <Item name="react-native-reanimated" label="React Native Reanimated" link="https://github.com/software-mansion/react-native-reanimated" team={[]} isLinkedin={false} />
                <Item name="react-native-safe-area-context" label="React Native Safe Area Context" link="https://github.com/th3rdwave/react-native-safe-area-context" team={[]} isLinkedin={false} />
                <Item name="react-native-screens" label="React Native Screens" link="https://github.com/software-mansion/react-native-screens" team={[]} isLinkedin={false} />
                <Item name="react-native-svg" label="React Native SVG" link="https://github.com/react-native-svg/react-native-svg" team={[]} isLinkedin={false} />
                <Item name="react-native-vector-icons" label="React Native Vector Icons" link="https://github.com/oblador/react-native-vector-icons" team={[]} isLinkedin={false} />
                <Item name="react-native-webview" label="React Native Webview" link="https://github.com/react-native-webview/react-native-webview" team={[]} isLinkedin={false} />
                <Item name="react-navigation" label="React Navigation" link="https://github.com/react-navigation/react-navigation" team={[]} isLinkedin={false} />
                <Item name="react-navigation-stack" label="React Navigation Stack" link="https://github.com/react-navigation/stack" team={[]} isLinkedin={false} />
                <Item name="tailwindcss" label="Tailwind CSS" link="https://github.com/tailwindlabs/tailwindcss" team={[]} isLinkedin={false} />
                <Item name="victory-native" label="Victory Native" link="https://github.com/FormidableLabs/victory-native" team={[]} isLinkedin={false} />
            </View>

            <View className="pb-[90] "></View>

        </ScrollView>
    );
}
