// app/(tabs)/home/index.tsx
import { subMonths, format } from 'date-fns';
import { Stack } from 'expo-router';
import React, { useCallback } from 'react';
import { ScrollView, View, FlatList, Text } from 'react-native';

import HomeScreenCard from '@/components/customCards/HomeScreenCard';
import QuickCurrentData from '@/components/visualizations/QuickCurrentData';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useCurrentData } from '@/contexts/CurrentDataContext';
import { useGraphData } from '@/contexts/GraphDataContext';

// const homeScreenFlatListData = [
//     {
//         imageSource: require('@/assets/homescreen/PXL_20221014_204618892.jpg'),
//         title: 'Discover',
//         buttonText: 'Blue CoLab Mission',
//         route: '/home/story',
//     },
//     {
//         imageSource: require('@/assets/homescreen/turtle.jpg'),
//         title: 'Discover Wildlife',
//         buttonText: 'Choate Pond Wildlife',
//         route: '/home/wildlife',
//     },
//     {
//         imageSource: require('@/assets/homescreen/sky.jpg'),
//         title: 'Look!',
//         buttonText: 'Air Quality Index...',
//         route: '/home/airQuality',
//     },
//     {
//         imageSource: require('@/assets/homescreen/waterSplash2.jpg'),
//         title: 'Read Blogs',
//         buttonText: 'Blue CoLab Blogs',
//         route: '/home/blog',
//     },
// ];

const homeScreenFlatListData = [
    {
        imageSource: require('@/assets/homescreen/PXL_20221014_204618892.jpg'),
        title: 'Discover',
        buttonText: 'Blue CoLab Mission',
        route: '/home/story',
    },
    {
        imageSource: require('@/assets/homescreen/sky.jpg'),
        title: 'Look!',
        buttonText: 'Air Quality Index...',
        route: '/home/airQuality',
    },
    {
        imageSource: require('@/assets/homescreen/waterSplash2.jpg'),
        title: 'Read Blogs',
        buttonText: 'Blue CoLab Blogs',
        route: '/home/blog',
    },
];

/** The home screen of the app. It contains the quick current data component.
 * @returns {JSX.Element}
 */
export default function HomeScreen() {
    const { defaultLocation } = useCurrentData();
    const { showConvertedUnits } = useGraphData();
    const { isDark } = useColorScheme();

    const lastMonth = format(subMonths(new Date(), 1), 'MMMM yyyy');

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
                        paddingBottom: 90,
                    }}>
                    <Text className="ml-4 mt-4 text-4xl font-bold dark:text-white">
                        {defaultLocation?.name} Data!
                    </Text>

                    <View>
                        <QuickCurrentData showConvertedUnits={showConvertedUnits} />
                    </View>

                    <View className="px-4 pt-4">
                        <HomeScreenCard
                            imageSource={require('@/assets/homescreen/IMG_9274.jpg')} // image source als identify URl all u gotta do is "http//something.com" for local images use {require("./something")}
                            title="Historic Data"
                            buttonText={`${lastMonth} Data`}
                            route="../home/historicData"
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
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderItem}
                        />
                    </View>
                </ScrollView>
            </View>
        </>
    );
}
