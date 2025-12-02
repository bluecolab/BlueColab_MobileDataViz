import { Image, ImageBackground, View, useWindowDimensions, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomepageCard } from '@/components/customCards/HomePageCardMini';

const panorama = require('@/assets/homescreen/landing_main.jpg');
const logo = require('@/assets/icons/Pace_White_KO_Centered.png');

const titleCards = [
    {
        image: require('@/assets/homescreen/waterData.png'),
        title: 'Choate Pond Water Quality',
        description:
            "Water quality measured every fifteen minutes by solar-powered underwater sensors deployed by Seidenberg School's Blue CoLab.",
    },
    {
        image: require('@/assets/homescreen/waterReport.png'),
        title: 'Pace Drinking Water Quality',
        description:
            'Yearly reports on Pleasantville campus water quality published by the university in compliance with state and federal law.',
    },
    {
        image: require('@/assets/homescreen/weatherData.png'),
        title: 'Pleasantville Campus Climate',
        description:
            'More than 20 climate conditions measured every five minutes by the sensor-based weather station Blue CoLab built near Miller Hall.',
    },
    {
        image: require('@/assets/homescreen/aqiData.png'),
        title: 'Pleasantville Air Quality',
        description:
            'Our local Air Quality Index, part of the federal AirNow program that also issues alerts when air quality threatens human health.',
    },
    {
        image: require('@/assets/homescreen/hudson.png'),
        title: 'Hudson River Monitoring',
        description:
            'Updates on river environmental conditions aggregated by Blue CoLab from data collected USGS and partners.',
    },
];

export default function Home() {
    const { width: screenWidth } = useWindowDimensions();
    const { width: imgW, height: imgH } = Image.resolveAssetSource(panorama) || {};
    const aspectRatio = imgW / imgH;
    const imageHeight = screenWidth / aspectRatio;

    return (
        <SafeAreaView className="flex-1">
            <ScrollView className="bg-[#263A75]" contentContainerStyle={{ alignItems: 'center' }}>
                <ImageBackground
                    source={panorama}
                    style={{ width: screenWidth, height: imageHeight }}
                    resizeMode="contain"
                    blurRadius={10}>
                    <View className="flex-1 items-center justify-center">
                        <Image
                            source={logo}
                            className="w-full self-center"
                            style={{ height: screenWidth / 6 }}
                            resizeMode="contain"
                        />
                        <Text className="text-center text-2xl text-white">
                            Environmental Observatory
                        </Text>
                    </View>
                </ImageBackground>

                {titleCards.map((card, index) => (
                    <HomepageCard key={index} {...card} />
                ))}

                <View className="pb-4">
                    <Text className="text-center text-sm text-white">Gale Epstein Center</Text>
                    <Text className="text-center text-sm text-white">
                        For Technology, Policy, and the Environment
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
