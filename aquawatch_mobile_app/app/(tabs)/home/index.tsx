// app/(tabs)/home/index.tsx
import { subMonths, format } from 'date-fns';
import { Stack, router } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { ScrollView, View, FlatList, Text, RefreshControl, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

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

    const ShortcutTile = ({
        icon,
        label,
        sub,
        to,
    }: {
        icon: React.ComponentProps<typeof FontAwesome>['name'];
        label: string;
        sub?: string;
        to: string;
    }) => (
        <Pressable
            onPress={() => router.push(to as any)}
            className="flex-1 rounded-2xl bg-white p-4 dark:bg-gray-700"
            style={{ minWidth: '48%' }}>
            <View className="mb-2 flex-row items-center">
                <FontAwesome name={icon} size={20} color={isDark ? 'white' : '#111827'} />
                <Text className="ml-2 text-lg font-semibold dark:text-white">{label}</Text>
            </View>
            {sub ? <Text className="text-xs text-gray-600 dark:text-gray-200">{sub}</Text> : null}
        </Pressable>
    );

    const headerRight = useMemo(
        () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: isDark ? 'white' : '#4b5563' }}>
                    Viewing: <Text style={{ fontWeight: '600' }}>{defaultLocation?.name}</Text>
                </Text>
                <Pressable
                    onPress={() => router.push('/(tabs)/settings')}
                    style={{
                        marginLeft: 6,
                        backgroundColor: isDark ? '#374151' : '#e5e7eb',
                        paddingVertical: 4,
                        paddingHorizontal: 8,
                        borderRadius: 6,
                    }}>
                    <Text style={{ fontSize: 10, color: isDark ? 'white' : '#111827' }}>
                        Change
                    </Text>
                </Pressable>
            </View>
        ),
        [defaultLocation?.name, isDark]
    );

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Blue CoLab',
                    headerStyle: {
                        backgroundColor: isDark ? '#2e2e3b' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                    headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
                    headerRight: () => headerRight,
                }}
            />
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
                        <Text className="text-3xl font-extrabold leading-9 dark:text-white">
                            Live Water, Clear Insights
                        </Text>
                        <Text className="text-base text-gray-700 dark:text-gray-200">
                            Live water & air quality data with clear, concise explanations.
                        </Text>
                        <Pressable
                            onPress={() => router.push('/home/story')}
                            className="mt-3 w-fit self-start rounded-lg bg-blue-600 px-3 py-2">
                            <Text className="text-sm font-semibold text-white">
                                What is Blue CoLab?
                            </Text>
                        </Pressable>
                    </View>

                    {/* — Live Now — */}
                    <View className="mt-2">
                        <QuickCurrentData showConvertedUnits={showConvertedUnits} />
                    </View>

                    <View className="mt-2">
                        <QuickCurrentWeatherData />
                    </View>

                    {/* — Shortcuts: Make navigation obvious — */}
                    <View className="px-4 pt-4">
                        <Text className="mb-2 text-xl font-bold dark:text-white">Explore Data</Text>
                        <View className="flex-row flex-wrap justify-between gap-3">
                            <ShortcutTile
                                icon="tachometer"
                                label="Current Data"
                                sub="Latest readings & WQI"
                                to="/(tabs)/currentData"
                            />
                            <ShortcutTile
                                icon="line-chart"
                                label="Historic Data"
                                sub={`${lastMonth} trends & comparisons`}
                                to="/home/historicData"
                            />
                            <ShortcutTile
                                icon="cloud"
                                label="AQI & Weather"
                                sub="Air quality with context"
                                to={aqiRoute}
                            />
                            <ShortcutTile
                                icon="file-text-o"
                                label="Water Report"
                                sub="2024 Pace report summary"
                                to="/(tabs)/home/waterReport"
                            />
                        </View>
                    </View>

                    {/* — Brief Explainers — */}
                    <View className="px-4 pt-5">
                        <View className="rounded-2xl bg-white p-4 dark:bg-gray-700">
                            <Text className="mb-1 text-lg font-semibold dark:text-white">
                                What these metrics mean
                            </Text>
                            <Text className="mb-3 text-xs text-gray-600 dark:text-gray-200">
                                Quick definitions to help you interpret the data.
                            </Text>
                            <View className="flex-row flex-wrap gap-2">
                                {parameterInfo.slice(0, 6).map((p, idx) => (
                                    <View
                                        key={`${p.yAxisLabel}-${idx}`}
                                        className="rounded-xl bg-gray-100 px-3 py-2 dark:bg-gray-600">
                                        <Text className="text-xs font-semibold dark:text-white">
                                            {p.yAxisLabel}
                                        </Text>
                                        <Text className="mt-1 max-w-[260] text-[11px] text-gray-700 dark:text-gray-200">
                                            {p.meta.description}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* — Feature card (visual) — */}
                    <View className="px-4 pt-4">
                        <HomeScreenCard
                            imageSource={require('@/assets/homescreen/waterQuestion.jpg')}
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
