import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, FlatList, Dimensions } from "react-native";
import { WQIGauge, DataGraph } from '@components';
import axios from "axios";

function Graph() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get('https://colabprod01.pace.edu/api/influx/sensordata/Alan/delta?days=30')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setData({ error: "Failed to load data" });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const waterParameters = [
    {
      yAxisLabel: "Temperature",
      unit: "Temp",
      description: "A short description"
    },
    {
      yAxisLabel: "pH",
      unit: "pH",
      description: "A short description"
    },
    {
      yAxisLabel: "Turbidity",
      unit: "Turb",
      description: "A short description"
    },
    {
      yAxisLabel: "Conductivity",
      unit: "Cond",
      description: "A short description"
    },
    {
      yAxisLabel: "Dissolved Oxygen",
      unit: "DOpct",
      description: "A short description"
    },
    {
      yAxisLabel: "Salinity",
      unit: "Sal",
      description: "A short description"
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const { width } = Dimensions.get('window');

  const handleScroll = event => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / width);
    setCurrentIndex(index);
  };


  return (
    <View className="bg-defaultbackground dark:bg-defaultdarkbackground">
      <View className="w-full bg-white elevation-[20] z-10 p-default dark:bg-gray-700">
        <Text className='text-xl text-center  dark:text-white'>Option to select location V </Text>
        <Text className='text-xl text-center  dark:text-white'>Option to select time V </Text>
      </View>
      {/* colorScheme */}
      <ScrollView className="h-full"
        contentContainerStyle={{ paddingBottom: 175 }}
      >
        <FlatList
          data={waterParameters}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={true}
          keyExtractor={(item, index) => index.toString()}
          onScroll={handleScroll}
          renderItem={({ item }) => (

            <DataGraph loading={loading} yAxisLabel={item.yAxisLabel} data={data} unit={item.unit} description={item.description} />
          )}
        />

        <View className="flex-row justify-center mt-2">
          {waterParameters.map((_, index) => (
            <View
              key={index}
              className={`w-2.5 h-2.5 rounded-full mx-1 ${currentIndex === index ? 'bg-blue-500' : 'bg-gray-400'}`}
            />
          ))}
        </View>

        <View className="rounded-3xl bg-white elevation-[5] p-default mt-default  flex-1 justify-center items-center dark:bg-gray-700 m-default">
          <Text className='text-2xl font-bold dark:text-white'>WQI</Text>
          <WQIGauge data={data} loading={loading}/>
        </View>

      </ScrollView>
    </View>
  );
}

export default Graph;
