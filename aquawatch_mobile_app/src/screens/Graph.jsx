import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, Dimensions } from 'react-native';
import { WQIGauge, DataGraph, DropdownComponent } from '@components';
import { useGraphData } from '@contexts';
import { useLocationMetaProvider } from '@hooks';
import { DateTime } from 'luxon';

const getDaysInMonth = (month, year) => {
    // Create a moment object for the first day of the given month and year
    const date = DateTime.fromObject({ year, month });
    return date.daysInMonth;
};

function Graph() {
    const { data, loading, setYear, setMonth, setEndDay, defaultLocation, defaultTempUnit, setDefaultLocation } = useGraphData();
    const { parameterInfo, locationOptions, units } = useLocationMetaProvider();
    const unitMap = units[defaultLocation];

    const [currentIndex, setCurrentIndex] = useState(0);
    const currentMonth = DateTime.now().month;
    const currentYear = DateTime.now().year;
    
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    // Set the default selected month and year
    const [selectedMonth, setSelectedMonth] = useState(lastMonth.toString());
    const [selectedYear, setSelectedYear] = useState(lastMonthYear);

    const { width } = Dimensions.get('window');

    const handleScroll = event => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / width);
        setCurrentIndex(index);
    };

    const renderItem = useCallback(({ item }) => {
        if (!defaultTempUnit && !defaultLocation)
            return <Text>Loading...</Text>
        return <DataGraph loading={loading} yAxisLabel={item.yAxisLabel} data={data} unit={item.unit} meta={item.meta} defaultTempUnit={defaultTempUnit} unitMap={unitMap} />
    }, [loading, data, defaultTempUnit, defaultLocation, unitMap]);

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

    const defaultLocationValue = locationOptions.find(option => option.label === defaultLocation)?.value || '';

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
        setDefaultLocation(defaultLocationLabel);
    };

    useEffect(() => {
        const defaultLocationValue = locationOptions.find(option => option.label === defaultLocation)?.value || '';
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
        <View className="bg-defaultbackground dark:bg-defaultdarkbackground  pb-[100]">
            <RenderTab />

            <ScrollView contentContainerStyle={{ paddingBottom: 175 }}>
                <FlatList
                    data={parameterInfo}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator
                    keyExtractor={(item, index) => index.toString()}
                    onMomentumScrollEnd={handleScroll}
                    renderItem={renderItem}
                    initialNumToRender={2}
                    maxToRenderPerBatch={2}
                    windowSize={3}
                    removeClippedSubviews={true}
                    getItemLayout={(data, index) => ({
                        length: width,
                        offset: width * index,
                        index,
                    })}
                />

                <View className="flex-row justify-center my-default">
                    {parameterInfo.map((_, index) => (
                        <Text
                            key={index}
                            className={`w-2.5 h-2.5 rounded-full mx-1 ${currentIndex === index ? 'bg-blue-500' : 'bg-gray-400'}`}
                        />
                    ))}
                </View>

                {defaultLocation === 'Choate Pond' ? <WQIGauge data={data} loading={loading} /> : <></>}
            </ScrollView>
        </View>
    );
}

export default Graph;
