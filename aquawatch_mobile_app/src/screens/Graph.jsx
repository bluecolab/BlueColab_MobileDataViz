import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View,  ScrollView, Dimensions } from 'react-native';
import { WQIGauge, DataGraph, DropdownComponent } from '@components';
import { useGraphData } from '@contexts';
import { useLocationMetaProvider } from '@hooks';
import { DateTime } from 'luxon';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import {
	useSharedValue,
} from "react-native-reanimated";

const getDaysInMonth = (month, year) => {
    // Create a moment object for the first day of the given month and year
    const date = DateTime.fromObject({ year, month });
    return date.daysInMonth;
};

function Graph() {
    const { data, loading, setYear, setMonth, setEndDay, defaultLocation, defaultTempUnit, selectedLocationTemp, setSelectedLocationTemp } = useGraphData();
    const { parameterInfo, locationOptions, units } = useLocationMetaProvider();
    const unitMap = units[selectedLocationTemp ?? defaultLocation];

    const currentMonth = DateTime.now().month;
    const currentYear = DateTime.now().year;

    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    // Set the default selected month and year
    const [selectedMonth, setSelectedMonth] = useState(lastMonth.toString());
    const [selectedYear, setSelectedYear] = useState(lastMonthYear);

    const { width } = Dimensions.get('window');

    const progress = useSharedValue(0);

	const ref = useRef(null);

	const onPressPagination = (index) => {
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

    const yearOptions = [];

    for (let year = currentYear; year >= 2020; year--) {
        yearOptions.push({ label: `${year}`, value: year });
    }

    const defaultLocationValue = locationOptions.find(option => option.label === (selectedLocationTemp ?? defaultLocation))?.value || '';

    const [selectedLocation, setSelectedLocation] = useState(defaultLocationValue);

    const onMonthSelect = (value) => {
        setSelectedMonth(value);
        setMonth(value);
        setEndDay(getDaysInMonth(value, selectedYear));
    };

    const onYearSelect = (value) => {
        setSelectedYear(value);
        setYear(value);
        setEndDay(getDaysInMonth(selectedMonth, value));
    };

    const onLocationSelect = (value) => {
        setSelectedLocation(value);
        const defaultLocationLabel = locationOptions.find(option => option.value === value)?.label || '';
        setSelectedLocationTemp(defaultLocationLabel);
    };

    useEffect(() => {
        const defaultLocationValue = locationOptions.find(option => option.label === (selectedLocationTemp ?? defaultLocation))?.value || '';
        setSelectedLocation(defaultLocationValue);
    }, [defaultLocation, locationOptions]);

    const RenderTab = useCallback(() => (
        <View className="w-full bg-white elevation-[20] z-10 p-default dark:bg-gray-700">
            <View className="flex-row w-full space-x-4">
                <View className="flex-[2]">
                    <DropdownComponent
                        label="Month"
                        options={monthOptions}
                        value={selectedMonth}
                        onSelect={onMonthSelect}
                    />
                </View>
                <View className="flex-[2]">
                    <DropdownComponent
                        label="Year"
                        options={yearOptions}
                        value={selectedYear}
                        onSelect={onYearSelect}
                    />
                </View>
            </View>
            <View>
                <DropdownComponent
                    label="Location"
                    options={locationOptions}
                    value={selectedLocation}
                    onSelect={onLocationSelect}
                />
            </View>
        </View>
    ), [selectedLocation]);

    return (
        <View className="bg-defaultbackground dark:bg-defaultdarkbackground ">
            <RenderTab />

            <ScrollView contentContainerStyle={{ paddingBottom: 300 }}>
                <Carousel
                	ref={ref}
                    loop={true}
                    width={width}
                    onProgressChange={progress}
                    height={370}
                    data={parameterInfo}
                    scrollAnimationDuration={500}
                    // onSnapToItem={index => setCurrentIndex(index)}
                    renderItem={({ item }) => (
                        <View style={{ width }}>
                            <DataGraph
                                loading={loading}
                                yAxisLabel={item.yAxisLabel}
                                data={data}
                                unit={item.unit}
                                meta={item.meta}
                                defaultTempUnit={defaultTempUnit}
                                unitMap={unitMap}
                                alternateName={item.alternateName ?? 'none'}
                            />
                        </View>
                    )}
                    onConfigurePanGesture={(panGesture) => {
                        panGesture.activeOffsetX([-10, 10])
                    }}
                />


            <Pagination.Basic
				progress={progress}
				data={parameterInfo}
				dotStyle={{ backgroundColor: "#262626" }}
				activeDotStyle={{ backgroundColor: "#f1f1f1" }}
				containerStyle={{ gap: 5, marginBottom: 10 }}
				onPress={onPressPagination}
			/>          


                {(selectedLocationTemp ?? defaultLocation) === 'Choate Pond' ? <WQIGauge data={data} loading={loading} /> : <></>}
            </ScrollView>
        </View>
    );
}

export default Graph;
