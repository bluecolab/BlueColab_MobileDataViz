// app/(tabs)/home/index.tsx
import { subMonths, format } from 'date-fns';
import { Stack } from 'expo-router';
import React, { useCallback } from 'react';
import { ScrollView, View, FlatList, Text, RefreshControl } from 'react-native';

import HomeScreenCard from '@/components/customCards/HomeScreenCard';
import QuickCurrentData from '@/components/visualizations/QuickCurrentData';
import QuickCurrentWeatherData from '@/components/visualizations/QuickCurrentWeatherData';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useCurrentData } from '@/contexts/CurrentDataContext';
import { useGraphData } from '@/contexts/GraphDataContext';

/** The home screen of the app. It contains the quick current data component.
 * @returns {JSX.Element}
 */
export default function HomeScreen() {
    const { defaultLocation, refetchCurrent, loadingCurrent } = useCurrentData();
    const { showConvertedUnits } = useGraphData();
    const { isDark } = useColorScheme();

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

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Home',
                    headerStyle: {
                        backgroundColor: isDark ? '#2e2e3b' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                    headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
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
                    <Text className="ml-4 mt-4 text-4xl font-bold dark:text-white">
                        {defaultLocation?.name} Data!
                    </Text>

                    <View>
                        <QuickCurrentData showConvertedUnits={showConvertedUnits} />
                    </View>

                    <View>
                        <QuickCurrentWeatherData />
                    </View>

                    <View className="px-4 pt-4">
                        <HomeScreenCard
                            imageSource={require('@/assets/homescreen/waterQuestion.jpg')}
                            title="Pace Water Data"
                            buttonText={`More Soon`}
                            route="(tabs)/home/waterReport"
                            isMain
                        />
                    </View>

                    <Text className="ml-4 mt-4 text-4xl font-bold dark:text-white">
                        From Blue CoLab
                    </Text>
                    <View className="px-4">
                        <FlatList
                            data={homeScreenFlatListData}
                            horizontal
                            showsHorizontalScrollIndicator
                            keyExtractor={(_item, index) => index.toString()}
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
