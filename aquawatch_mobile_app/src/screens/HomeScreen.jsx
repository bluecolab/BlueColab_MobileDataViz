import React, {useCallback} from "react";
import {
  ScrollView,
  View,
  FlatList,
  Text
} from "react-native";
import { GradientCard, QuickCurrentData } from "@components";

//this is the first screen you see after the welcome screen
//takes you to all the other sections of the app

export default function HomeScreen({ navigation }) {
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
      title: "Discover" ,
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
    // {
    //   imageSource: require("../../assets/homescreen/sky.jpg"),
    //   title: "Check out the air quality index!",
    //   buttonText: "Air Quality Index...",
    //   onButtonPress: handleAqiPress,
    //   gradientColors: ["#ffdde1", "#ee9ca7"],
    // },
    {
      imageSource: require("../../assets/homescreen/waterSplash2.jpg"),
      title: "Read Blogs",
      buttonText: "Blue CoLab Blogs",
      onButtonPress: handleBlogScreenPress,
      gradientColors: ["#ffdde1", "#ee9ca7"],
    },
    // {
    //   imageSource: require("../../assets/homescreen/code.jpg"),
    //   title: "Code & Data Attributions",
    //   buttonText: "Learn more...",
    //   onButtonPress: handleAttributionPress,
    //   gradientColors: ["#FFFFFF", "#6DD5FA"],
    // }
  ];

  return (
    <View className="bg-defaultbackground dark:bg-defaultdarkbackground">
      <ScrollView className="h-full">
        {/* The paddingBottom should be at least as tall as the bottom tab navigator"s height */}
        {/* More info about the gradientCard Check GradientCard.js and StylesCard.js */}
        <QuickCurrentData />
        <GradientCard
          imageSource={require("../../assets/homescreen/graph.png")} // image soruce als idendify URl all u gotta do is "http//something.com" for local images use {require("./something")}
          title="Historic Data"
          buttonText="January 2025 Data"
          onButtonPress={handleGraphPress}
          gradientColors={["#ffdde1", "#ee9ca7"]} // [Bottom Color, Upper Color] yes order is abit messy buuut still works :)
          isMain
        />
        
        <Text className="font-bold text-4xl mt-4 ml-4">More From Blue CoLab</Text>
        <FlatList
          data={data}
          horizontal
          // pagingEnabled
          showsHorizontalScrollIndicator={true}
          keyExtractor={(item, index) => index.toString()}
          // onMomentumScrollEnd={handleScroll}
          renderItem={renderItem}
        />

       
      </ScrollView>
    </View>
  );
}
