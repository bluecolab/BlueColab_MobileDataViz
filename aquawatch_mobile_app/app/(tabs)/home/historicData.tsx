import { FontAwesome } from '@expo/vector-icons';
import { getMonth, getYear, getDaysInMonth } from 'date-fns';
import { Stack } from 'expo-router';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, ScrollView, Dimensions, Text, Pressable } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';

import CustomDropdown from '@/components/CustomDropdown';
import { ModalWrapper, ModalWrapperRef } from '@/components/modals/ModalWrapper';
import { MonthlyDataCard } from '@/components/visualizations/monthlyData/MonthlyDataCard';
import { WQICard } from '@/components/visualizations/WQI/WQICard';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useGraphData } from '@/contexts/GraphDataContext';
import { config } from '@/hooks/useConfig';
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
    } = useGraphData();
    const { parameterInfo, locationOptions, units } = getMetadata();
    const { isDark } = useColorScheme();

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

    const modalRef = useRef<ModalWrapperRef>(null);

    const progress = useSharedValue(0);

    const carouselRef = useRef<ICarouselInstance>(null);
    const onPressPagination = (index: number) => {
        carouselRef.current?.scrollTo({
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
            const newMonth = Number.parseInt(value, 10);
            setSelectedMonth(newMonth);
            setMonth(newMonth);
            // If selecting the current month in the current year, clamp to today's day
            const isCurrentSelection = newMonth === currentMonth && selectedYear === currentYear;
            const endDay = isCurrentSelection
                ? new Date().getDate()
                : getDaysInMonthFn(newMonth, selectedYear);
            setEndDay(endDay);
        },
        [selectedYear, setMonth, setEndDay, currentMonth, currentYear]
    );

    const onYearSelect = useCallback(
        (value: string) => {
            const newYear = Number.parseInt(value, 10);
            setSelectedYear(newYear);
            setYear(newYear);
            // If selecting the current month in the current year, clamp to today's day
            const isCurrentSelection = selectedMonth === currentMonth && newYear === currentYear;
            const endDay = isCurrentSelection
                ? new Date().getDate()
                : getDaysInMonthFn(selectedMonth, newYear);
            setEndDay(endDay);
        },
        [selectedMonth, setYear, setEndDay, currentMonth, currentYear]
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
            <Pressable onPress={() => modalRef.current?.openModal()}>
                <View>
                    <FontAwesome name="cog" size={32} color={isDark ? 'white' : '#333'} />
                </View>
            </Pressable>
        ),
        [isDark]
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
            <View className="flex-1">
                <ScrollView className="h-full bg-defaultbackground dark:bg-defaultdarkbackground">
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
                        ref={carouselRef}
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

                    {config.BLUE_COLAB_API_CONFIG.validMatches.some(
                        (loc) => loc.name === defaultLocation?.name
                    ) ? (
                        <View className="mb-12 mt-6 items-center px-4">
                            <WQICard data={data} loading={loading} />
                        </View>
                    ) : (
                        <></>
                    )}

                    <View className="pb-[45]">
                        <Text></Text>
                    </View>
                </ScrollView>

                <ModalWrapper
                    ref={modalRef}
                    modalHeight={'80%'}
                    body={
                        <>
                            <View className="absolute right-8 top-3">
                                <Pressable onPress={() => modalRef.current?.closeModal()}>
                                    <Text className="text-2xl dark:text-white">✕</Text>
                                </Pressable>
                            </View>

                            <View className="elevation-[20] z-10 mb-2 mt-10 w-full rounded-xl bg-gray-200 p-default dark:bg-gray-700">
                                <Text className="text-center text-lg font-bold dark:text-white">
                                    Historic Data Settings
                                </Text>
                            </View>
                            <View className="elevation-[20] z-10 w-full rounded-xl bg-gray-200 p-default dark:bg-gray-700">
                                <Text className="text-center text-lg font-bold dark:text-white">
                                    Location 1
                                </Text>

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
                        </>
                    }
                />
            </View>
        </>
    );
}
