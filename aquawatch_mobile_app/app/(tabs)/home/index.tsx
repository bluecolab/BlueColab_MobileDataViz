// app/(tabs)/home/index.tsx
import { FontAwesome } from '@expo/vector-icons';
import { subMonths, format } from 'date-fns';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import {
    ScrollView,
    View,
    FlatList,
    Text,
    RefreshControl,
    Pressable,
    ScrollView as RNScrollView,
} from 'react-native';

import HomeScreenCard from '@/components/customCards/HomeScreenCard';
import QuickCurrentData from '@/components/visualizations/QuickCurrentData';
import QuickCurrentWeatherData from '@/components/visualizations/QuickCurrentWeatherData';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useCurrentData } from '@/contexts/CurrentDataContext';
import { useGraphData } from '@/contexts/GraphDataContext';
import { config } from '@/hooks/useConfig';
import getMetadata from '@/utils/getMetadata';

/** The home screen of the app. It contains the quick current data component.
 * @returns {JSX.Element}
 */
export default function HomeScreen() {
    const { defaultLocation, refetchCurrent, loadingCurrent } = useCurrentData();
    const { showConvertedUnits } = useGraphData();
    const { isDark } = useColorScheme();
    const { parameterInfo } = getMetadata();

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
    ];

    const renderItem = useCallback(
        ({
            item,
        }: {
            item: {
                imageSource: string | { uri: string };
                title: string;
                buttonText: string;
                route: string;
                isMain?: boolean;
            };
        }) => (
            <HomeScreenCard
                imageSource={item.imageSource}
                title={item.title}
                buttonText={item.buttonText}
                route={item.route}
            />
        ),
        []
    );

    const aqiRoute = config.BLUE_COLAB_API_CONFIG.validMatches.some(
        (loc) => loc.name === defaultLocation?.name
    )
        ? '/(tabs)/home/odinData'
        : '/(tabs)/home/airQuality';

    // (Old ShortcutTile component removed; direct Pressables used for leaner UI)

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
                    {/* — Intro Copy (header now handles title & viewing) — */}
                    <View className="px-4 pt-4">
                        <Text className="text-2xl font-extrabold tracking-tight dark:text-white">
                            Real‑time Water & Air
                        </Text>
                        <Text className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            Know conditions instantly. Learn the basics. Dive deeper.
                        </Text>
                        <View className="mt-3 flex-row space-x-3">
                            <Pressable
                                onPress={() => router.push('/home/story')}
                                className="rounded-full bg-blue-600 px-4 py-2">
                                <Text className="text-xs font-semibold uppercase tracking-wide text-white">
                                    What is Blue CoLab
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() => router.push('/home/historicData')}
                                className="rounded-full bg-gray-200 px-4 py-2 dark:bg-gray-700">
                                <Text className="text-xs font-semibold uppercase tracking-wide dark:text-white">
                                    Trends
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* — Live Now — */}
                    <View className="mt-2">
                        <QuickCurrentData showConvertedUnits={showConvertedUnits} />
                    </View>

                    <View className="mt-2">
                        <QuickCurrentWeatherData />
                    </View>

                    {/* — Shortcuts: Make navigation obvious — */}
                    <View className="px-4 pt-6">
                        <Text className="mb-3 text-lg font-bold dark:text-white">
                            Quick Actions
                        </Text>
                        <View className="flex-row flex-wrap gap-3">
                            <Pressable
                                onPress={() => router.push('/(tabs)/currentData')}
                                className="min-w-[46%] flex-1 rounded-xl bg-white p-4 dark:bg-gray-700">
                                <View className="mb-1 flex-row items-center">
                                    <FontAwesome
                                        name="tachometer"
                                        size={18}
                                        color={isDark ? 'white' : '#111827'}
                                    />
                                    <Text className="ml-2 text-sm font-semibold dark:text-white">
                                        Current
                                    </Text>
                                </View>
                                <Text className="text-[11px] text-gray-600 dark:text-gray-300">
                                    Live readings & WQI
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() => router.push('/home/historicData')}
                                className="min-w-[46%] flex-1 rounded-xl bg-white p-4 dark:bg-gray-700">
                                <View className="mb-1 flex-row items-center">
                                    <FontAwesome
                                        name="line-chart"
                                        size={18}
                                        color={isDark ? 'white' : '#111827'}
                                    />
                                    <Text className="ml-2 text-sm font-semibold dark:text-white">
                                        Historic
                                    </Text>
                                </View>
                                <Text className="text-[11px] text-gray-600 dark:text-gray-300">
                                    {lastMonth} trends
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() => router.push(aqiRoute as any)}
                                className="min-w-[46%] flex-1 rounded-xl bg-white p-4 dark:bg-gray-700">
                                <View className="mb-1 flex-row items-center">
                                    <FontAwesome
                                        name="cloud"
                                        size={18}
                                        color={isDark ? 'white' : '#111827'}
                                    />
                                    <Text className="ml-2 text-sm font-semibold dark:text-white">
                                        AQI
                                    </Text>
                                </View>
                                <Text className="text-[11px] text-gray-600 dark:text-gray-300">
                                    Air quality + weather
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={() => router.push('/(tabs)/home/waterReport')}
                                className="min-w-[46%] flex-1 rounded-xl bg-white p-4 dark:bg-gray-700">
                                <View className="mb-1 flex-row items-center">
                                    <FontAwesome
                                        name="file-text-o"
                                        size={18}
                                        color={isDark ? 'white' : '#111827'}
                                    />
                                    <Text className="ml-2 text-sm font-semibold dark:text-white">
                                        Report
                                    </Text>
                                </View>
                                <Text className="text-[11px] text-gray-600 dark:text-gray-300">
                                    2024 summary
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* — Brief Explainers — */}
                    <View className="px-4 pt-6">
                        <Text className="mb-2 text-lg font-bold dark:text-white">Core Terms</Text>
                        <RNScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="flex-row">
                            {parameterInfo.slice(0, 7).map((p, idx) => (
                                <View
                                    key={`${p.yAxisLabel}-${idx}`}
                                    className="mr-3 w-[160] rounded-xl bg-white p-3 dark:bg-gray-700">
                                    <Text className="text-xs font-semibold uppercase tracking-wide dark:text-white">
                                        {p.yAxisLabel}
                                    </Text>
                                    <Text
                                        className="mt-1 text-[11px] leading-4 text-gray-600 dark:text-gray-300"
                                        numberOfLines={4}>
                                        {p.meta.description}
                                    </Text>
                                </View>
                            ))}
                        </RNScrollView>
                        <Pressable
                            onPress={() => router.push('/home/historicData')}
                            className="mt-3 self-start rounded-full bg-gray-200 px-4 py-2 dark:bg-gray-700">
                            <Text className="text-xs font-semibold uppercase tracking-wide dark:text-white">
                                See in graphs
                            </Text>
                        </Pressable>
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

                    <View className="pb-[30]">
                        <Text></Text>
                    </View>
                </ScrollView>
            </View>
        </>
    );
}
