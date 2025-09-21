import { FontAwesome } from '@expo/vector-icons';
import { getMonth, getYear, getDaysInMonth } from 'date-fns';
import { Stack } from 'expo-router';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    View,
    ScrollView,
    Dimensions,
    Modal,
    Text,
    TouchableWithoutFeedback,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';

import CustomDropdown from '@/components/CustomDropdown';
import { MonthlyDataCard } from '@/components/visualizations/monthlyData/MonthlyDataCard';
import { WQICard } from '@/components/visualizations/WQI/WQICard';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useGraphData } from '@/contexts/GraphDataContext';
import getMetadata from '@/utils/getMetadata';

const getDaysInMonthFn = (month: number, year: number) => {
    const date = new Date(year, month - 1); // Month is 0-indexed in JavaScript
    return getDaysInMonth(date);
};

export default function HistoricData() {
    const {
        data,
        loading,
        setYear,
        setMonth,
        setEndDay,
        defaultLocation,
        defaultTempUnit,
        selectedLocationTemp,
        setSelectedLocationTemp,
        error,
        showConvertedUnits,
        changeConvertedUnits,
    } = useGraphData();
    const { parameterInfo, locationOptions, units } = getMetadata();
    const { isDark } = useColorScheme();
    const [modalOpen, setModalOpen] = useState(false);

    const unitMap =
        units[
            (selectedLocationTemp ?? defaultLocation?.name ?? 'Choate Pond') as keyof typeof units
        ];

    const now = new Date();
    const currentMonth = getMonth(now) + 1; // `getMonth` is 0-indexed
    const currentYear = getYear(now);

    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    // Set the default selected month and year
    const [selectedMonth, setSelectedMonth] = useState(lastMonth);
    const [selectedYear, setSelectedYear] = useState(lastMonthYear);

    const { width } = Dimensions.get('window');

    const progress = useSharedValue(0);

    const ref = useRef<ICarouselInstance>(null);

    const onPressPagination = (index: number) => {
        ref.current?.scrollTo({
            /**
             * Calculate the difference between the current index and the target index
             * to ensure that the carousel scrolls to the nearest index
             */
            count: index - progress.value,
            animated: true,
        });
    };

    // Filters down to not show future months
    const monthOptions = React.useMemo(() => {
        const fullMonthOptions = [
            { label: 'January', value: '1' },
            { label: 'February', value: '2' },
            { label: 'March', value: '3' },
            { label: 'April', value: '4' },
            { label: 'May', value: '5' },
            { label: 'June', value: '6' },
            { label: 'July', value: '7' },
            { label: 'August', value: '8' },
            { label: 'September', value: '9' },
            { label: 'October', value: '10' },
            { label: 'November', value: '11' },
            { label: 'December', value: '12' },
        ];
        return selectedYear === currentYear
            ? fullMonthOptions.filter((_, i) => i < currentMonth)
            : fullMonthOptions;
    }, [currentMonth, currentYear, selectedYear]);

    const yearOptions = React.useMemo(() => {
        const options: { label: string; value: string }[] = [];
        for (let year = currentYear; year >= 2020; year--) {
            options.push({ label: `${year}`, value: `${year}` });
        }
        return options;
    }, [currentYear]);

    const defaultLocationValue =
        locationOptions.find(
            (option) => option.label === (selectedLocationTemp ?? defaultLocation?.name)
        )?.value || '';

    const [selectedLocation, setSelectedLocation] = useState(defaultLocationValue);

    const onMonthSelect = useCallback(
        (value: string) => {
            setSelectedMonth(Number.parseInt(value, 10));
            setMonth(Number.parseInt(value, 10));
            setEndDay(getDaysInMonthFn(Number.parseInt(value, 10), selectedYear));
        },
        [selectedYear, setMonth, setEndDay]
    );

    const onYearSelect = useCallback(
        (value: string) => {
            setSelectedYear(Number.parseInt(value, 10));
            setYear(Number.parseInt(value, 10));
            setEndDay(getDaysInMonthFn(selectedMonth, Number.parseInt(value, 10)));
        },
        [selectedMonth, setYear, setEndDay]
    );

    const onLocationSelect = useCallback(
        (value: string) => {
            setSelectedLocation(value);
            const defaultLocationLabel =
                locationOptions.find((option) => option.value === value)?.label || '';
            setSelectedLocationTemp({ name: defaultLocationLabel });
        },
        [locationOptions, setSelectedLocationTemp]
    );

    useEffect(() => {
        const defaultLocationValue =
            locationOptions.find(
                (option) => option.label === (selectedLocationTemp ?? defaultLocation?.name)
            )?.value || '';
        setSelectedLocation(defaultLocationValue);
    }, [defaultLocation, locationOptions, selectedLocationTemp]);

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
                    headerTitle: 'Historic Data',
                    headerStyle: {
                        backgroundColor: isDark ? '#2e2e3b' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                    headerRight: HeaderRightButton,
                }}
            />
            <View className="bg-defaultbackground dark:bg-defaultdarkbackground ">
                <ScrollView contentContainerStyle={{ paddingBottom: 400 }}>
                    <Text className="mt-5 w-[95%] self-center rounded-3xl bg-white p-1 text-center text-2xl font-bold dark:bg-gray-700 dark:text-white">
                        {locationOptions.find((option) => option.value === selectedLocation)?.label}{' '}
                        -{' '}
                        {
                            monthOptions.find((option) => option.value === selectedMonth.toString())
                                ?.label
                        }{' '}
                        {selectedYear}
                    </Text>

                    <Carousel
                        ref={ref}
                        loop
                        width={width}
                        onProgressChange={progress}
                        height={370}
                        data={parameterInfo}
                        scrollAnimationDuration={500}
                        renderItem={({ item }) => (
                            <View style={{ width }}>
                                <MonthlyDataCard
                                    loading={loading}
                                    yAxisLabel={item.yAxisLabel}
                                    data={data}
                                    error={error}
                                    unit={item.unit}
                                    meta={item.meta}
                                    defaultTempUnit={defaultTempUnit}
                                    unitMap={unitMap}
                                    alternateName={item.alternateName ?? 'none'}
                                    selectedMonth={
                                        monthOptions.find(
                                            (option) => option.value === selectedMonth.toString()
                                        )?.label || 'oh no'
                                    }
                                    showConvertedUnits={showConvertedUnits}
                                />
                            </View>
                        )}
                        onConfigurePanGesture={(panGesture) => {
                            panGesture.activeOffsetX([-10, 10]);
                        }}
                    />

                    <Pagination.Basic
                        progress={progress}
                        data={parameterInfo}
                        dotStyle={{ backgroundColor: isDark ? '#f1f1f1' : '#262626' }}
                        activeDotStyle={{ backgroundColor: isDark ? '#444' : '#f1f1f1' }}
                        containerStyle={{ gap: 5, marginBottom: 10 }}
                        onPress={onPressPagination}
                    />

                    {(selectedLocationTemp ?? defaultLocation?.name) === 'Choate Pond' ? (
                        <WQICard data={data} loading={loading} />
                    ) : (
                        <></>
                    )}
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
                                        Historic Data Settings
                                    </Text>
                                    {/* Add a close button */}
                                    <TouchableHighlight
                                        className="absolute right-4 top-4 rounded-full bg-gray-200 p-2 dark:bg-gray-700"
                                        onPress={() => setModalOpen(false)}>
                                        <Text className="text-lg font-bold">✕</Text>
                                    </TouchableHighlight>
                                    {/* Add more modal content here */}
                                    <View className="elevation-[20] z-10 w-full bg-white p-default dark:bg-gray-700">
                                        <View className="flex-row items-center justify-end pb-2">
                                            <Text className="mr-2 text-lg dark:text-white">
                                                Show Converted Units
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    changeConvertedUnits(!showConvertedUnits)
                                                }
                                                style={{
                                                    backgroundColor: showConvertedUnits
                                                        ? '#2563eb'
                                                        : '#e5e7eb',
                                                    borderRadius: 16,
                                                    paddingVertical: 6,
                                                    paddingHorizontal: 16,
                                                }}>
                                                <Text
                                                    style={{
                                                        color: showConvertedUnits
                                                            ? 'white'
                                                            : 'black',
                                                    }}>
                                                    {showConvertedUnits ? 'Converted' : 'Original'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View className="w-full flex-row space-x-4">
                                            <View className="flex-[2]">
                                                <CustomDropdown
                                                    label="Month"
                                                    options={monthOptions}
                                                    value={selectedMonth.toString()}
                                                    onSelect={onMonthSelect}
                                                />
                                            </View>
                                            <View className="flex-[2]">
                                                <CustomDropdown
                                                    label="Year"
                                                    options={yearOptions}
                                                    value={selectedYear.toString()}
                                                    onSelect={onYearSelect}
                                                />
                                            </View>
                                        </View>
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
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        </>
    );
}
