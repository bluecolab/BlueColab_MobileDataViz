import { Stack } from 'expo-router';
import { DateTime } from 'luxon';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';

import CustomDropdown from '@/components/CustomDropdown';
import { useGraphData } from '@/contexts/GraphDataContext';
import useGetMetadata from '@/hooks/useGetMetadata';
import { MonthlyDataCard } from '@/components/visualizations/monthlyData/MonthlyDataCard';
import { WQICard } from '@/components/visualizations/WQI/WQICard';

// import { WQIGauge, DataGraph, CustomDropdown } from '@components';

const getDaysInMonth = (month: number, year: number) => {
    // Create a moment object for the first day of the given month and year
    const date = DateTime.fromObject({ year, month });
    return date.daysInMonth;
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
    } = useGraphData();
    const { parameterInfo, locationOptions, units } = useGetMetadata();
    const unitMap =
        units[(selectedLocationTemp ?? defaultLocation ?? 'Choate Pond') as keyof typeof units];

    const currentMonth = DateTime.now().month;
    const currentYear = DateTime.now().year;

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

    const monthOptions = [
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

    const yearOptions = [] as {
        label: string;
        value: string;
    }[];

    for (let year = currentYear; year >= 2020; year--) {
        yearOptions.push({ label: `${year}`, value: `${year}` });
    }

    const defaultLocationValue =
        locationOptions.find((option) => option.label === (selectedLocationTemp ?? defaultLocation))
            ?.value || '';

    const [selectedLocation, setSelectedLocation] = useState(defaultLocationValue);

    const onMonthSelect = (value: string) => {
        setSelectedMonth(Number.parseInt(value, 10));
        setMonth(Number.parseInt(value, 10));
        setEndDay(getDaysInMonth(Number.parseInt(value, 10), selectedYear));
    };

    const onYearSelect = (value: string) => {
        setSelectedYear(Number.parseInt(value, 10));
        setYear(Number.parseInt(value, 10));
        setEndDay(getDaysInMonth(selectedMonth, Number.parseInt(value, 10)));
    };

    const onLocationSelect = (value: string) => {
        setSelectedLocation(value);
        const defaultLocationLabel =
            locationOptions.find((option) => option.value === value)?.label || '';
        setSelectedLocationTemp(defaultLocationLabel);
    };

    useEffect(() => {
        const defaultLocationValue =
            locationOptions.find(
                (option) => option.label === (selectedLocationTemp ?? defaultLocation)
            )?.value || '';
        setSelectedLocation(defaultLocationValue);
    }, [defaultLocation, locationOptions]);

    const RenderTab = useCallback(
        () => (
            <View className="elevation-[20] z-10 w-full bg-white p-default dark:bg-gray-700">
                <View className="w-full flex-row space-x-4">
                    <View className="flex-[2]">
                        <CustomDropdown
                            label="Month"
                            options={monthOptions}
                            value={selectedMonth}
                            onSelect={onMonthSelect}
                        />
                    </View>
                    <View className="flex-[2]">
                        <CustomDropdown
                            label="Year"
                            options={yearOptions}
                            value={selectedYear}
                            onSelect={onYearSelect}
                        />
                    </View>
                </View>
                <View>
                    <CustomDropdown
                        label="Location"
                        options={locationOptions}
                        value={selectedLocation}
                        onSelect={onLocationSelect}
                    />
                </View>
            </View>
        ),
        [selectedLocation]
    );

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Historic Data',
                }}
            />
            <View className="bg-defaultbackground dark:bg-defaultdarkbackground ">
                <RenderTab />

                <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
                    <Carousel
                        ref={ref}
                        loop
                        width={width}
                        onProgressChange={progress}
                        height={370}
                        data={parameterInfo}
                        scrollAnimationDuration={500}
                        // onSnapToItem={index => setCurrentIndex(index)}
                        renderItem={({ item }) => (
                            <View style={{ width }}>
                                <MonthlyDataCard
                                    loading={loading}
                                    yAxisLabel={item.yAxisLabel}
                                    data={data}
                                    unit={item.unit}
                                    meta={item.meta}
                                    defaultTempUnit={defaultTempUnit}
                                    unitMap={unitMap}
                                    alternateName={item.alternateName ?? 'none'}
                                    selectedMonth={monthOptions.find(option => option.value === selectedMonth.toString())?.label || "oh no"}
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
                        dotStyle={{ backgroundColor: '#262626' }}
                        activeDotStyle={{ backgroundColor: '#f1f1f1' }}
                        containerStyle={{ gap: 5, marginBottom: 10 }}
                        onPress={onPressPagination}
                    />

                    {(selectedLocationTemp ?? defaultLocation) === 'Choate Pond' ? (
                        <WQICard data={data} loading={loading} />
                    ) : (
                        <></>
                    )}
                </ScrollView>
            </View>
        </>
    );
}
