import React, {useCallback} from "react";
import {
  ScrollView,
  View,
  FlatList,
} from "react-native";
import { GradientCard } from "@components";

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
      title: "This app is brought to you by Blue CoLab, a program committed to the principle that the human right to clean water requires the right-to-know that water is clean." ,
      buttonText: "Learn more...",
      onButtonPress: handleStoryScreenPress, 
      gradientColors: ["#ffdde1", "#ee9ca7"]
    },
    {
      imageSource: require("../../assets/homescreen/turtle.jpg"),
      title: "Some of the local wildlife in both Choate Pond and the Hudson River might surprise you!",
      buttonText: "See Local Wildlife...",
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
      title: "Check out some of the Blue CoLab Blogs!",
      buttonText: "Blog more...",
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

  const data1 = [
    {
      imageSource: require("../../assets/homescreen/graph.png"),
      title: "Updated Graph Views",
      buttonText: "Test out...",
      onButtonPress: handleGraphPress,
      gradientColors: ["#6DD5FA", "#6DD5FA"],
    },
    {
      imageSource: require("../../assets/homescreen/graph.png"),
      title: "New Current Views",
      buttonText: "Test out...",
      onButtonPress: handleCurrentDataPress,
      gradientColors: ["#6DD5FA", "#6DD5FA"],
    }

  ]

  return (
    <View className="bg-defaultbackground">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start", paddingBottom: 90 }}>
        {/* The paddingBottom should be at least as tall as the bottom tab navigator"s height */}
        {/* More info about the gradientCard Check GradientCard.js and StylesCard.js */}

        <FlatList
          data={data}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={true}
          keyExtractor={(item, index) => index.toString()}
          // onMomentumScrollEnd={handleScroll}
          renderItem={renderItem}
        />

        {/* <GradientCard
          imageSource={require("../../assets/homescreen/PXL_20221014_204618892.jpg")} // image soruce als idendify URl all u gotta do is "http//something.com" for local images use {require("./something")}
          title="This app is brought to you by Blue CoLab, a program committed to the principle that the human right to clean water requires the right-to-know that water is clean." // Pretty much the text
          buttonText="Learn more..."
          onButtonPress={handleStoryScreenPress}
          gradientColors={["#ffdde1", "#ee9ca7"]} // [Bottom Color, Upper Color] yes order is abit messy buuut still works :)
        /> */}

        <FlatList
          data={data1}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={true}
          keyExtractor={(item, index) => index.toString()}
          // onMomentumScrollEnd={handleScroll}
          renderItem={renderItem}
        />
      </ScrollView>
    </View>
  );
}
