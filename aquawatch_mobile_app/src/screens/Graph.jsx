import React, { useState, useContext, useCallback } from "react";
import { View, Text, ScrollView, FlatList, Dimensions } from "react-native";
import { WQIGauge, DataGraph, DropdownComponent } from "@components";
import { GraphDataContext } from "@contexts";
import { FontAwesome } from '@expo/vector-icons';
import moment from 'moment';
const getDaysInMonth = (month, year) => {
  // Create a moment object for the first day of the given month and year
  const date = moment({ year, month: month - 1 }); // month is 1-indexed, so we subtract 1
  return date.daysInMonth();
};

function Graph() {
  const { data, loading, setYear, setMonth, setEndDay } = useContext(GraphDataContext);

  const waterParameters = [
    { yAxisLabel: "Temperature", unit: "Temp" },
    { yAxisLabel: "pH", unit: "pH" },
    { yAxisLabel: "Turbidity", unit: "Turb" },
    { yAxisLabel: "Conductivity", unit: "Cond" },
    { yAxisLabel: "Dissolved Oxygen", unit: "DOpct" },
    { yAxisLabel: "Salinity", unit: "Sal" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMonth = moment().month();
  const currentYear = moment().year();

  const lastMonth = currentMonth === 0 ? 12 : currentMonth; 
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear; 

  // Set the default selected month and year
  const [selectedMonth, setSelectedMonth] = useState(lastMonth.toString());
  const [selectedYear, setSelectedYear] = useState(lastMonthYear);

  const { width } = Dimensions.get("window");

  const handleScroll = event => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const renderItem = useCallback(({ item }) => (
    <DataGraph loading={loading} yAxisLabel={item.yAxisLabel} data={data} unit={item.unit} />
  ), [loading, data]);

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

  // Update year and month in context
  const onMonthSelect = (value) => {
    setSelectedMonth(value);
    setMonth(value);  // Update the context's month
    setEndDay(getDaysInMonth(value,selectedYear));
  };

  const onYearSelect = (value) => {
    setSelectedYear(value);
    setYear(value); // Update the context's year
    setEndDay(getDaysInMonth(selectedMonth,value));
  };

  return (
    <View className="bg-defaultbackground dark:bg-defaultdarkbackground">
      <View className="w-full bg-white elevation-[20] z-10 p-default dark:bg-gray-700">
        <View className="flex-row w-full space-x-4">
          <View className="flex-[2]">
            <DropdownComponent
              label="Month"
              options={monthOptions}
              value={selectedMonth}
              onSelect={onMonthSelect}  // Use the updated onSelect handler
            />
          </View>
          <View className="flex-[2]">
            <DropdownComponent
              label="Year"
              options={yearOptions}
              value={selectedYear}
              onSelect={onYearSelect}  // Use the updated onSelect handler
            />
          </View>
        </View>
      </View>

      <ScrollView className="h-full" contentContainerStyle={{ paddingBottom: 175 }}>
        <FlatList
          data={waterParameters}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={true}
          keyExtractor={(item, index) => index.toString()}
          onMomentumScrollEnd={handleScroll}
          renderItem={renderItem}
        />

        <View className="flex-row justify-center mt-2">
          {waterParameters.map((_, index) => (
            <Text
              key={index}
              className={`w-2.5 h-2.5 rounded-full mx-1 ${currentIndex === index ? "bg-blue-500" : "bg-gray-400"}`}
            />
          ))}
        </View>

        <View className="rounded-3xl bg-white elevation-[5] p-default mt-default flex-1 justify-center items-center dark:bg-gray-700 m-default">
          <Text className="text-2xl font-bold dark:text-white">WQI</Text>
          <WQIGauge data={data} loading={loading} />
        </View>
      </ScrollView>
    </View>
  );
}

export default Graph;
