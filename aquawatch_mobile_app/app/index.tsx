import { Image, View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HomepageCard } from '@/components/customCards/HomePageCardMini';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useCurrentData } from '@/contexts/CurrentDataContext';

const logo = require('@/assets/icons/Pace_White_KO_Centered.png');

const titleCards = [
    {
        image: require('@/assets/homescreen/waterData.png'),
        title: 'Choate Pond Water Quality',
        path: '/currentData',
        description:
            "Water quality measured every fifteen minutes by solar-powered underwater sensors deployed by Seidenberg School's Blue CoLab.",
    },
    {
        image: require('@/assets/homescreen/waterReport.png'),
        title: 'Pace Drinking Water Quality',
        path: '/waterReport',
        description:
            'Yearly reports on Pleasantville campus water quality published by the university in compliance with state and federal law.',
    },
    {
        image: require('@/assets/homescreen/weatherData.png'),
        title: 'Pleasantville Campus Climate',
        path: '/odinData',
        description:
            'More than 20 climate conditions measured every five minutes by the sensor-based weather station Blue CoLab built near Miller Hall.',
    },
    {
        image: require('@/assets/homescreen/aqiData.png'),
        title: 'Pleasantville Air Quality',
        path: '/airQuality',
        description:
            'Our local Air Quality Index, part of the federal AirNow program that also issues alerts when air quality threatens human health.',
    },
    {
        image: require('@/assets/homescreen/hudson.png'),
        title: 'Hudson River Monitoring',
        path: '/',
        description:
            'Updates on river environmental conditions aggregated by Blue CoLab from data collected USGS and partners.',
    },
];

export default function Home() {
    const { isDark } = useColorScheme();
    const { refetchCurrent, loadingCurrent } = useCurrentData();

    return (
        <SafeAreaView className="flex-1 bg-black dark:bg-black">
            <ScrollView
                contentContainerStyle={{ paddingBottom: 24 }}
                refreshControl={
                    <RefreshControl
                        refreshing={loadingCurrent}
                        onRefresh={refetchCurrent}
                        tintColor={isDark ? 'white' : 'black'}
                    />
                }>
                {/* Header area, simplified to match app style */}
                <View className="px-4 pt-6">
                    <View className="items-center">
                        <Image
                            source={logo}
                            className="w-full"
                            style={{ height: 56 }}
                            resizeMode="contain"
                        />
                        <Text className="mt-2 text-center text-xl font-semibold text-white">
                            Environmental Observatory
                        </Text>
                    </View>
                </View>

                {/* New list content preserved */}
                <View className="mt-4 px-3">
                    {titleCards.map((card, index) => (
                        <HomepageCard key={index} {...card} />
                    ))}
                </View>

                {/* Footer text preserved */}
                <View className="pb-6 pt-2">
                    <Text className="text-center text-xs text-white/90">Gale Epstein Center</Text>
                    <Text className="text-center text-xs text-white/90">
                        For Technology, Policy, and the Environment
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
