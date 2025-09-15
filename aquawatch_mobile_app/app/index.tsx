// app/(tabs)/home/index.tsx
import { FontAwesome } from '@expo/vector-icons';
import { subMonths, format } from 'date-fns';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ScrollView,
    View,
    FlatList,
    Text,
    Pressable,
    Modal,
    TouchableWithoutFeedback,
    TouchableHighlight,
} from 'react-native';

import HomeScreenCard from '@/components/customCards/HomeScreenCard';
import CustomDropdown from '@/components/CustomDropdown';
import QuickCurrentData from '@/components/visualizations/QuickCurrentData';
import WQICardFront from '@/components/visualizations/WQI/WQICardFront';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useCurrentData } from '@/contexts/CurrentDataContext';
import { useGraphData } from '@/contexts/GraphDataContext';
import getMetadata from '@/utils/getMetadata';

/** The home screen of the app. It contains the quick current data component.
 * @returns {JSX.Element}
 */
export default function HomeScreen() {
    const { defaultLocation, selectedLocationTemp, setSelectedLocationTemp } = useGraphData();

    const router = useRouter();
    const [modalOpen, setModalOpen] = useState(false);

    const { locationOptions } = getMetadata();

    const defaultLocationValue =
        locationOptions.find((option) => option.label === (selectedLocationTemp ?? defaultLocation))
            ?.value || '';
    const [selectedLocation, setSelectedLocation] = useState(defaultLocationValue);

    const { isDark } = useColorScheme();

    const lastMonth = format(subMonths(new Date(), 1), 'MMMM yyyy');

    const onLocationSelect = useCallback(
        (value: string) => {
            setSelectedLocation(value);
            const defaultLocationLabel =
                locationOptions.find((option) => option.value === value)?.label || '';
            setSelectedLocationTemp(defaultLocationLabel);
        },
        [locationOptions, setSelectedLocationTemp]
    );

    useEffect(() => {
        const defaultLocationValue =
            locationOptions.find(
                (option) => option.label === (selectedLocationTemp ?? defaultLocation)
            )?.value || '';
        setSelectedLocation(defaultLocationValue);
    }, [defaultLocation, locationOptions, selectedLocationTemp]);

    const homeScreenFlatListData = [
        {
            imageSource: require('@/assets/homescreen/IMG_9274.jpg'),
            title: 'Historic Data',
            buttonText: `${lastMonth} Data`,
            route: 'historicData',
            isMain: true,
        },
        {
            imageSource: require('@/assets/homescreen/PXL_20221014_204618892.jpg'),
            title: 'Discover',
            buttonText: 'Blue CoLab Mission',
            route: '/story',
        },
        {
            imageSource: require('@/assets/homescreen/turtle.jpg'),
            title: 'Discover Wildlife',
            buttonText: 'Choate Pond Wildlife',
            route: '/wildlife',
        },
        {
            imageSource: require('@/assets/homescreen/waterSplash2.jpg'),
            title: 'Read Blogs',
            buttonText: 'Blue CoLab Blogs',
            route: '/blog',
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

    const HeaderRightButton = React.useCallback(
        () => (
            <FontAwesome
                name="cog"
                size={24}
                color={isDark ? 'white' : '#333'}
                onPress={() => setModalOpen(!modalOpen)}
                style={{ marginRight: 16 }}
            />
        ),
        [modalOpen, isDark]
    );

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: defaultLocation,
                    headerStyle: {
                        backgroundColor: isDark ? '#2e2e3b' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                    headerRight: HeaderRightButton,
                }}
            />
            <View className="h-full bg-defaultbackground dark:bg-defaultdarkbackground">
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'flex-start',
                        paddingBottom: 90,
                    }}>
                    {/* <Text className="ml-4 mt-4 text-4xl font-bold dark:text-white">
                        {defaultLocation} Data!
                    </Text> */}

                    {/* <View>
                        <QuickCurrentData />
                    </View> */}

                    <View className="mx-4 mt-4 rounded-3xl bg-white px-4  py-4 dark:bg-gray-700">
                        <Pressable onPress={() => router.push('/currentData')}>
                            <WQICardFront data={[]} loading={false} wqi={70} />
                            <Text className="text-center text-3xl font-bold">WQI</Text>
                            <Text className="text-center text-sm italic">Click to learn more</Text>
                        </Pressable>
                    </View>

                    <View className="mx-4 mt-4 rounded-3xl bg-white px-4  py-4 dark:bg-gray-700 ">
                        <Pressable onPress={() => router.push('/waterReports')}>
                            <Text className="text-center text-2xl font-bold">
                                Last data collected:
                            </Text>
                            <Text className="text-center text-5xl font-bold text-green-600">
                                Safe!
                            </Text>
                            <Text className="text-center text-3xl font-bold">
                                Pace Drinking Water
                            </Text>
                            <Text className="text-center text-sm italic">Click to learn more</Text>
                        </Pressable>
                    </View>

                    <View className="mx-4 mt-4 rounded-3xl bg-white px-4  py-4 dark:bg-gray-700 ">
                        <Pressable onPress={() => router.push('/airQuality')}>
                            <WQICardFront data={[]} loading={false} wqi={40} />
                            <Text className="text-center text-3xl font-bold">AQI</Text>
                            <Text className="text-center text-sm italic">Click to learn more</Text>
                        </Pressable>
                    </View>

                    <Text className="ml-4 mt-4 text-4xl font-bold dark:text-white">
                        More From Blue CoLab
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

                <Modal
                    animationType="slide"
                    transparent
                    visible={modalOpen}
                    onRequestClose={() => setModalOpen(false)}>
                    <TouchableWithoutFeedback onPress={() => setModalOpen(false)}>
                        <View className="flex-1 justify-end bg-black/50">
                            {/* Prevent closing when tapping inside the modal content */}
                            <TouchableWithoutFeedback>
                                <View className="h-[85vh] rounded-t-2xl bg-defaultbackground p-6 dark:bg-defaultdarkbackground">
                                    <Text className="text-center text-lg font-bold dark:text-white">
                                        Settings
                                    </Text>
                                    {/* Add a close button */}
                                    <TouchableHighlight
                                        className="absolute right-4 top-4 rounded-full bg-gray-200 p-2 dark:bg-gray-700"
                                        onPress={() => setModalOpen(false)}>
                                        <Text className="text-lg font-bold">✕</Text>
                                    </TouchableHighlight>
                                    {/* Add more modal content here */}
                                    <View className="elevation-[20] z-10 w-full bg-white p-default dark:bg-gray-700">
                                        <View className="w-full flex-row space-x-4">
                                            <View>
                                                <CustomDropdown
                                                    label="Location"
                                                    options={locationOptions}
                                                    value={selectedLocation.toString()}
                                                    onSelect={onLocationSelect}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        </>
    );
}
