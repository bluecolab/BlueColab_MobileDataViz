import React, { useState, useContext, useCallback, useRef } from "react";
import { View, Text, ScrollView, FlatList, Dimensions, TouchableOpacity, Animated } from "react-native";
import { WQIGauge, DataGraph } from "@components";
import { GraphDataContext } from "@contexts";
import { FontAwesome } from '@expo/vector-icons';


function Graph() {
  const { data, loading } = useContext(GraphDataContext);

  const waterParameters = [
    { yAxisLabel: "Temperature", unit: "Temp" },
    { yAxisLabel: "pH", unit: "pH" },
    { yAxisLabel: "Turbidity", unit: "Turb" },
    { yAxisLabel: "Conductivity", unit: "Cond" },
    { yAxisLabel: "Dissolved Oxygen", unit: "DOpct" },
    { yAxisLabel: "Salinity", unit: "Sal" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const { width } = Dimensions.get("window");

  const handleScroll = event => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const renderItem = useCallback(({ item }) => (
    <DataGraph loading={loading} yAxisLabel={item.yAxisLabel} data={data} unit={item.unit} />
  ), [loading, data]);

  return (
    <View className="bg-defaultbackground dark:bg-defaultdarkbackground">
      {/* <View className="w-full bg-white elevation-[20] z-10 p-default dark:bg-gray-700">
        <Text className="text-xl text-center dark:text-white">Option to select location V</Text>
        <Text className="text-xl text-center dark:text-white">Option to select time V</Text>
      </View> */}

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

        <View className="rounded-3xl bg-white elevation-[5] p-default mt-default  flex-1 justify-center items-center dark:bg-gray-700 m-default">
          <Text className="text-2xl font-bold dark:text-white">WQI</Text>
          <WQIGauge data={data} loading={loading} />
        </View>
      </ScrollView>
    </View>
  );
}

export default Graph;
