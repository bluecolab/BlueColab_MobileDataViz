import React, { useState, useContext, useRef } from "react";
import { View, Text, ScrollView, FlatList, Dimensions, TouchableOpacity, Animated } from "react-native";
import { WQIGauge, DataGraph } from "@components";
import { GraphDataContext } from "@contexts";
import { FontAwesome } from '@expo/vector-icons';

function Graph() {
  const { data, loading } = useContext(GraphDataContext);
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const flipToFront = () => {
    Animated.timing(flipAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
    setFlipped(false);
  };

  const flipToBack = () => {
    Animated.timing(flipAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    setFlipped(true);
  };

  const flipInterpolation = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

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
    const index = Math.floor(contentOffsetX / width);
    setCurrentIndex(index);
  };

  return (
    <View className="bg-defaultbackground dark:bg-defaultdarkbackground">
      <View className="w-full bg-white elevation-[20] z-10 p-default dark:bg-gray-700">
        <Text className="text-xl text-center dark:text-white">Option to select location V</Text>
        <Text className="text-xl text-center dark:text-white">Option to select time V</Text>
      </View>

      <ScrollView className="h-full" contentContainerStyle={{ paddingBottom: 175 }}>
        <FlatList
          data={waterParameters}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={true}
          keyExtractor={(item, index) => index.toString()}
          onScroll={handleScroll}
          renderItem={({ item }) => (
            <DataGraph loading={loading} yAxisLabel={item.yAxisLabel} data={data} unit={item.unit} />
          )}
        />

        <View className="flex-row justify-center mt-2">
          {waterParameters.map((_, index) => (
            <View
              key={index}
              className={`w-2.5 h-2.5 rounded-full mx-1 ${currentIndex === index ? "bg-blue-500" : "bg-gray-400"}`}
            />
          ))}
        </View>

        <View className="relative flex-1 justify-center items-center">
          {/* Flippable Content */}
          <Animated.View
            style={{ transform: [{ rotateY: flipInterpolation }] }}
            className="bg-white w-[95%] mt-5 h-[300] dark:bg-gray-700 rounded-3xl justify-center items-center"
          >
            {/* Front Side: WQI Text and WQIGauge */}
            <View
              style={{ backfaceVisibility: 'hidden' }}
              className={`absolute w-full h-full justify-center items-center ${flipped ? 'hidden' : ''}`}
            >
              <Text className="text-2xl font-bold text-black dark:text-white y-flipped">
                WQI
              </Text>
              <WQIGauge data={data} loading={loading} />
            </View>

            {/* Back Side: Text only */}
            <View
              style={{
                backfaceVisibility: 'hidden',
              }}

              className={`absolute w-full h-full justify-center items-center ${flipped ? '' : 'hidden'}`}
            >
              <Text 
               style={{
                transform: [{ rotateY: '180deg' }],
                backfaceVisibility: 'hidden',
              }}

              className="text-2xl font-bold text-black dark:text-white">
                Back Side
              </Text>
            </View>
          </Animated.View>

          {/* Icon Button to Trigger Flip */}
          <TouchableOpacity
            onPress={flipped ? flipToFront : flipToBack}
            className="absolute top-5 right-5"
          >
            <FontAwesome name="info-circle" size={24} color="grey" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

export default Graph;
