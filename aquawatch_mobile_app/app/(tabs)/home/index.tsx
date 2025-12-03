// app/(tabs)/home/index.tsx
import { subMonths, format } from 'date-fns';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, View, FlatList, Text, RefreshControl, Pressable } from 'react-native';

import HomeScreenCard from '@/components/customCards/HomeScreenCard';
import QuickCurrentData from '@/components/visualizations/QuickCurrentData';
import QuickCurrentWeatherData from '@/components/visualizations/QuickCurrentWeatherData';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useCurrentData } from '@/contexts/CurrentDataContext';
import { useGraphData } from '@/contexts/GraphDataContext';
import { config } from '@/hooks/useConfig';

import WaterSourceModal from './WaterSourceModal';
// Removed parameter metadata on simplified landing; can reintroduce later.

/** The home screen of the app. It contains the quick current data component.
 * @returns {JSX.Element}
 */
export default function HomeScreen() {
    const { defaultLocation, refetchCurrent, loadingCurrent } = useCurrentData();
    const { showConvertedUnits } = useGraphData();
    const { isDark } = useColorScheme();
    const [modalVisible, setModalVisible] = useState(false);
    // parameterInfo removed (simplified landing)

    const lastMonth = format(subMonths(new Date(), 1), 'MMMM yyyy');

    const homeScreenFlatListData = [
        {
            imageSource: require('@/assets/homescreen/IMG_9274.png'),
            title: 'Historic Data',
            buttonText: `${lastMonth} Data`,
            route: '/home/historicData',
        },
        {
            imageSource: require('@/assets/homescreen/PXL_20221014_204618892.jpg'),
            title: 'Discover',
            buttonText: 'Blue CoLab Mission',
            route: '/home/story',
        },
        {
            imageSource: require('@/assets/homescreen/waterSplash2.jpg'),
            title: 'Read Blogs',
            buttonText: 'Blue CoLab Blogs',
            route: '/home/blog',
        },
        ...(defaultLocation?.name === 'Choate Pond'
            ? [
                  {
                      imageSource: require('@/assets/homescreen/Map_of_drinking_water_pace.png'),
                      title: 'Water Sources',
                      buttonText: 'About Our Water',
                      isModal: true,
                  },
              ]
            : []),
    ];

    const renderItem = useCallback(
        ({
            item,
        }: {
            item: {
                imageSource: any;
                title: string;
                buttonText: string;
                route?: string;
                isMain?: boolean;
                isModal?: boolean;
            };
        }) => (
            <HomeScreenCard
                imageSource={item.imageSource}
                title={item.title}
                buttonText={item.buttonText}
                route={item.route}
                onPress={item.isModal ? () => setModalVisible(true) : undefined}
            />
        ),
        []
    );

    const aqiRoute = config.BLUE_COLAB_API_CONFIG.validMatches.some(
        (loc) => loc.name === defaultLocation?.name
    )
        ? '/(tabs)/home/odinData'
        : '/(tabs)/home/airQuality';

    // Refactor: simplify landing focus to WHAT & WHY before numbers.
    const [showLive, setShowLive] = React.useState(false);

    return (
        <>
            <View className="h-full bg-defaultbackground dark:bg-defaultdarkbackground">
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'flex-start',
                    }}
                    refreshControl={
                        <RefreshControl
                            refreshing={loadingCurrent}
                            onRefresh={refetchCurrent}
                            tintColor={isDark ? 'white' : 'black'}
                        />
                    }>
                    {/* Intro: WHAT & WHY (WATER • AIR • WEATHER) */}
                    <View className="px-4 pt-4">
                        <Text className="text-2xl font-extrabold tracking-tight dark:text-white">
                            Blue CoLab - AIR, WATER, WEATHER
                        </Text>
                        <Text className="mt-2 text-sm leading-5 text-gray-700 dark:text-gray-300">
                            A campus hub for environmental insight. We measure water quality, air
                            pollutants, and weather conditions together so anyone can understand
                            health, safety, and change over time.
                        </Text>
                        <View className="mt-3 flex-row flex-wrap gap-2">
                            <Pressable
                                onPress={() => router.push('/home/story')}
                                className="rounded-full bg-blue-600 px-4 py-2">
                                <Text className="text-xs font-semibold uppercase tracking-wide text-white">
                                    Why We Monitor
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() => router.push('/home/historicData')}
                                className="rounded-full bg-gray-200 px-4 py-2 dark:bg-gray-700">
                                <Text className="text-xs font-semibold uppercase tracking-wide dark:text-white">
                                    Historic Trends
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() => setShowLive((p) => !p)}
                                className="rounded-full bg-gray-200 px-4 py-2 dark:bg-gray-700">
                                <Text className="text-xs font-semibold uppercase tracking-wide dark:text-white">
                                    {showLive ? 'Hide Live' : 'Show Live'}
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Equal domain selection cards */}
                    <View className="px-4 pt-6">
                        <View className="flex-row flex-wrap justify-between gap-4">
                            <Pressable
                                onPress={() => router.push('/(tabs)/currentData')}
                                className="min-w-[30%] flex-1 rounded-2xl bg-white p-4 dark:bg-gray-700">
                                <Text className="text-sm font-semibold dark:text-white">Water</Text>
                                <Text
                                    className="mt-1 text-[11px] text-gray-600 dark:text-gray-300"
                                    numberOfLines={3}>
                                    Temperature, clarity, oxygen & more. Tap for station readings.
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() => router.push(aqiRoute as any)}
                                className="min-w-[30%] flex-1 rounded-2xl bg-white p-4 dark:bg-gray-700">
                                <Text className="text-sm font-semibold dark:text-white">Air</Text>
                                <Text
                                    className="mt-1 text-[11px] text-gray-600 dark:text-gray-300"
                                    numberOfLines={3}>
                                    Live AQI & pollutants for outdoor exposure.
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() => router.push(aqiRoute as any)}
                                className="min-w-[30%] flex-1 rounded-2xl bg-white p-4 dark:bg-gray-700">
                                <Text className="text-sm font-semibold dark:text-white">
                                    Weather
                                </Text>
                                <Text
                                    className="mt-1 text-[11px] text-gray-600 dark:text-gray-300"
                                    numberOfLines={3}>
                                    Conditions shaping water & air: temp, humidity, patterns.
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    {showLive && (
                        <View className="px-4 pt-4">
                            <View className="rounded-2xl bg-white p-3 dark:bg-gray-700">
                                <Text className="text-sm font-semibold dark:text-white">
                                    Live Snapshot
                                </Text>
                                <Text className="mt-1 text-[11px] text-gray-600 dark:text-gray-300">
                                    Real-time station & air readings (toggle off to simplify).
                                </Text>
                                <View className="mt-3">
                                    <QuickCurrentData showConvertedUnits={showConvertedUnits} />
                                </View>
                                <View className="mt-3">
                                    <QuickCurrentWeatherData />
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Removed old Quick Actions grid for simpler landing */}

                    {/* Why It Matters section */}
                    <View className="px-4 pt-6">
                        <Text className="mb-2 text-lg font-bold dark:text-white">
                            Why It Matters
                        </Text>
                        <View className="rounded-2xl bg-white p-4 dark:bg-gray-700">
                            <Text className="text-xs font-semibold uppercase tracking-wide dark:text-white">
                                Our Mission
                            </Text>
                            <Text className="mt-1 text-[11px] leading-5 text-gray-700 dark:text-gray-300">
                                Tracking WATER, AIR, and WEATHER together reveals how conditions
                                interact: heat shifts dissolved oxygen, wind alters pollutant
                                dispersion, and storms drive turbidity. Understanding all three
                                helps protect ecosystems and community health.
                            </Text>
                            <Pressable
                                onPress={() => router.push('/home/story')}
                                className="mt-3 self-start rounded-full bg-blue-600 px-4 py-2">
                                <Text className="text-xs font-semibold uppercase tracking-wide text-white">
                                    Learn More
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* — Feature card (visual) — */}
                    <View className="px-4 pt-4">
                        <HomeScreenCard
                            imageSource="https://www.pace.edu/sites/default/files/styles/16_9_1600x900/public/2022-03/seidenberg-hero-blue-colab.jpg"
                            title="Pace Water Data"
                            buttonText={`2024 Water Report`}
                            route="(tabs)/home/waterReport"
                            isMain
                            isSafe={true}
                        />
                    </View>

                    <Text className="ml-4 mt-4 text-2xl font-bold dark:text-white">
                        From Blue CoLab
                    </Text>
                    <View className="px-4">
                        <FlatList
                            data={homeScreenFlatListData}
                            horizontal
                            showsHorizontalScrollIndicator
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderItem}
                        />
                    </View>

                    <WaterSourceModal
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                    />
                </ScrollView>
            </View>
        </>
    );
}
