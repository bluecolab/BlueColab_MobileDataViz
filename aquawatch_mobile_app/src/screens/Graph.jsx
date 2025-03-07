import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, Dimensions } from 'react-native';
import { WQIGauge, DataGraph, DropdownComponent } from '@components';
import { useGraphData } from '@contexts';
import moment from 'moment';

const getDaysInMonth = (month, year) => {
    // Create a moment object for the first day of the given month and year
    const date = moment({ year, month: month - 1 }); // month is 1-indexed, so we subtract 1
    return date.daysInMonth();
};

function Graph() {
    const { data, loading, setYear, setMonth, setEndDay, defaultLocation, defaultTempUnit, setDefaultLocation } = useGraphData();
    const waterParameters = [
        {
            yAxisLabel: 'Temperature', unit: 'Temp',
            meta: {
                description: 'The measure of how cold or hot the water is. Measured in celsius or fahrenheit.',
                reason: 'Changes in temperature have an effect on biological activity. Each species has a preferred range to live at. Temperature effects water chemistry as well. For example, higher temperature can dissolve for minerals but hold less gas.',
                ref: [{
                    label: 'USGS',
                    link: 'https://www.usgs.gov/special-topics/water-science-school/science/temperature-and-water#overview',
                }],
            },
        },
        {
            yAxisLabel: 'pH', unit: 'pH',
            meta: {
                description: 'The measure to determine the acidity of water.',
                reason: 'pH is effected by changes in water chemistry and thus can be an important indicator. pH also affects solubility of metals, causing the water to be more toxic.',
                ref: [
                    {
                        label: 'USGS',
                        link: 'https://www.usgs.gov/special-topics/water-science-school/science/ph-and-water#overview',
                    },
                    {
                        label: 'EPA',
                        link: 'https://www.epa.gov/system/files/documents/2021-07/parameter-factsheet_ph.pdf',
                    },
                ],
            },
        },
        {
            yAxisLabel: 'Dissolved Oxygen', unit: 'DOpct',
            meta: {
                description: 'The measure of oxygen in the water.',
                reason: 'It is an important indicator of the water body\'s ability to support aquatic life. Too little oxygen or too much can kill aquatic life.',
                ref: [
                    {
                        label: 'USGS',
                        url: 'https://www.usgs.gov/special-topics/water-science-school/science/dissolved-oxygen-and-water#overview',
                    },
                    {
                        label: 'EPA',
                        url: 'https://www.epa.gov/national-aquatic-resource-surveys/indicators-dissolved-oxygen',
                    },
                ],
            },
        },
        {
            yAxisLabel: 'Conductivity', unit: 'Cond',
            meta: {
                description: 'The measure of the ability of the water to pass electrical current.',
                reason: 'Bodies of water usually have a base line range of conductivity. Significant changes in it may be indicators of a pollution event as conductivity is effected by salts and other compounds.',
                ref: [
                    {
                        label: 'USGS',
                        url: 'https://www.usgs.gov/special-topics/water-science-school/science/conductivity-electrical-conductance-and-water#overview',
                    },
                    {
                        label: 'EPA',
                        url: 'https://www.epa.gov/national-aquatic-resource-surveys/indicators-conductivity',
                    },
                ],
            },
        },
        {
            yAxisLabel: 'Salinity', unit: 'Sal',
            meta: {
                description: 'The measure of dissolved salt content in water. Effects conductivity.',
                reason: 'For organisms not used to changes in salinity, fluctuating levels can cause stress. Each living organism is adapted to the water body\'s usual salinity range.',
                ref: [
                    {
                        label: 'USGS',
                        url: 'https://www.usgs.gov/special-topics/water-science-school/science/saline-water-and-salinity#overview',
                    },
                    {
                        label: 'EPA',
                        url: 'https://www.epa.gov/national-aquatic-resource-surveys/indicators-salinity',
                    },

                ],
            },
        },
        {
            yAxisLabel: 'Turbidity', unit: 'Turb',
            meta: {
                description: 'The measure of the relative clarity of the water. Measured in NTU.',
                reason: 'High turbidity affects light penetration. Particles also provide places for bacteria and other pollutants to attach to.',
                ref: [
                    {
                        label: 'USGS',
                        link: 'https://www.usgs.gov/special-topics/water-science-school/science/turbidity-and-water#overview',
                    },
                ],
            },
        },

    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const currentMonth = moment().month();
    const currentYear = moment().year();

    const lastMonth = currentMonth === 0 ? 12 : currentMonth;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Set the default selected month and year
    const [selectedMonth, setSelectedMonth] = useState(lastMonth.toString());
    const [selectedYear, setSelectedYear] = useState(lastMonthYear);

    const { width } = Dimensions.get('window');

    const handleScroll = event => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / width);
        setCurrentIndex(index);
    };

    const renderItem = useCallback(({ item }) => (
        <DataGraph loading={loading} yAxisLabel={item.yAxisLabel} data={data} unit={item.unit} meta={item.meta} defaultTempUnit={defaultTempUnit} />
    ), [loading, data, defaultTempUnit, defaultLocation]);

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

    const locationOptions = [
        { label: 'Choate Pond', value: '1' },
        { label: 'Piermont', value: '2' },
        { label: 'West Point', value: '3' },
        { label: 'Poughkeepsie', value: '4' },
        { label: 'New York City', value: '5' },
        { label: 'Albany', value: '6' },
    ];

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
    }, [defaultLocation]);

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
                    data={waterParameters}
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
                    {waterParameters.map((_, index) => (
                        <Text
                            key={index}
                            className={`w-2.5 h-2.5 rounded-full mx-1 ${currentIndex === index ? 'bg-blue-500' : 'bg-gray-400'}`}
                        />
                    ))}
                </View>

                {defaultLocation == 'Choate Pond' ? <WQIGauge data={data} loading={loading} /> : <></>}
            </ScrollView>
        </View>
    );
}

export default Graph;
