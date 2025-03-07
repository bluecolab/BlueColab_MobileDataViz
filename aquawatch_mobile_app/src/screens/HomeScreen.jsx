import React, { useCallback } from "react";
import {
  ScrollView,
  View,
  FlatList,
  Text
} from "react-native";
import { GradientCard, QuickCurrentData } from "@components";
import { useCurrentData } from "@contexts";
import moment from "moment";

//this is the first screen you see after the welcome screen
//takes you to all the other sections of the app

export default function HomeScreen({ navigation }) {
  const { defaultLocation } = useCurrentData();
  
  //each of these constants handle navigation from each button
  const handleStoryScreenPress = () => {
    navigation.navigate("Story");
  };
  const handleWildlifeScreenPress = () => {
    navigation.navigate("Wildlife");
  };
  const handleBlogScreenPress = () => {
    navigation.navigate("Blog");
  };
  const handleAttributionPress = () => {
    navigation.navigate("Attributions");
  }
  const handleAqiPress = () => {
    navigation.navigate("AQI");
  };
  const handleGraphPress = () => {
    navigation.navigate("Graph");
  };
  const handleCurrentDataPress = () => {
    navigation.navigate("CurrentData");
  };

  const handleMiddlePress = () => {
    navigation.navigate("Current Data");
  };

  const handleMonthlyPress = () => {
    navigation.navigate("Monthly Data");
  };

  const lastMonth = moment().subtract(1, "months").format("MMMM YYYY");


  const renderItem = useCallback(({ item }) => (
    <GradientCard
      imageSource={item.imageSource}
      title={item.title}
      buttonText={item.buttonText}
      onButtonPress={item.onButtonPress}
      gradientColors={item.gradientColors} />
  ), []);

  const data = [
    {
      imageSource: require("../../assets/homescreen/PXL_20221014_204618892.jpg"),
      title: "Discover",
      buttonText: "Blue CoLab Mission",
      onButtonPress: handleStoryScreenPress,
      gradientColors: ["#ffdde1", "#ee9ca7"]
    },
    {
      imageSource: require("../../assets/homescreen/turtle.jpg"),
      title: "Discover Wildlife",
      buttonText: "Choate Pond Wildlife",
      onButtonPress: handleWildlifeScreenPress,
      gradientColors: ["#FFFFFF", "#6DD5FA"],
    },
    {
      imageSource: require("../../assets/homescreen/sky.jpg"),
      title: "Look!",
      buttonText: "Air Quality Index...",
      onButtonPress: handleAqiPress,
      gradientColors: ["#ffdde1", "#ee9ca7"],
    },
    {
      imageSource: require("../../assets/homescreen/waterSplash2.jpg"),
      title: "Read Blogs",
      buttonText: "Blue CoLab Blogs",
      onButtonPress: handleBlogScreenPress,
      gradientColors: ["#ffdde1", "#ee9ca7"],
    },
    {
      imageSource: require("../../assets/homescreen/code.jpg"),
      title: "Credits",
      buttonText: "Code & Data Attributions",
      onButtonPress: handleAttributionPress,
      gradientColors: ["#FFFFFF", "#6DD5FA"],
    }
  ];

  return (
    <View className="bg-defaultbackground dark:bg-defaultdarkbackground">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start", paddingBottom: 90 }}>
        {/* The paddingBottom should be at least as tall as the bottom tab navigator"s height */}
        {/* More info about the gradientCard Check GradientCard.js and StylesCard.js */}
        <Text className="font-bold dark:text-white text-4xl mt-4 ml-4">{defaultLocation} Data!</Text>

        <View>
          <QuickCurrentData handleMiddlePress={handleMiddlePress} />
        </View>

        <View className="px-4 pt-4">
          <GradientCard
            imageSource={require("../../assets/homescreen/IMG_9274.jpg")} // image soruce als idendify URl all u gotta do is "http//something.com" for local images use {require("./something")}
            title="Historic Data"
            buttonText={`${lastMonth} Data`}
            onButtonPress={handleGraphPress}
            gradientColors={["#ffdde1", "#ee9ca7"]} // [Bottom Color, Upper Color] yes order is abit messy buuut still works :)
            isMain

          />
        </View>

        <View className="px-4 pt-4">
          <GradientCard
            imageSource={require("../../assets/homescreen/IMG_9274.jpg")} // image soruce als idendify URl all u gotta do is "http//something.com" for local images use {require("./something")}
            title="Current Data"
            buttonText={`New Current Data Screen`}
            onButtonPress={handleCurrentDataPress}
            gradientColors={["#ffdde1", "#ee9ca7"]} // [Bottom Color, Upper Color] yes order is abit messy buuut still works :)
            isMain
          />
        </View>


        <View className="px-4 pt-4">
          <GradientCard
            imageSource={require("../../assets/homescreen/IMG_9274.jpg")} // image soruce als idendify URl all u gotta do is "http//something.com" for local images use {require("./something")}
            title="Monthly Data"
            buttonText={`Old Monthly Data Screen`}
            onButtonPress={handleMonthlyPress}
            gradientColors={["#ffdde1", "#ee9ca7"]} // [Bottom Color, Upper Color] yes order is abit messy buuut still works :)
            isMain
          />
        </View>





        
        <Text className="font-bold dark:text-white text-4xl mt-4 ml-4">From Blue CoLab</Text>
        <View className="px-4">
          <FlatList
            data={data}
            horizontal
            // pagingEnabled
            showsHorizontalScrollIndicator={true}
            keyExtractor={(item, index) => index.toString()}
            // onMomentumScrollEnd={handleScroll}
            renderItem={renderItem}
          />
        </View>

      </ScrollView>
    </View>
  );
}
