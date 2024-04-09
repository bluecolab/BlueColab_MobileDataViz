import React from "react";
import {
  View,
  Text,
  ScrollView
} from "react-native";
import styles from "../../styles";
import CustomCard from "../components/CustomCard";
import GradientCard from "../components/GradientCard"; 

//this is the first screen you see after the welcome screen
//takes you to all the other sections of the app

export default function HomeScreen({ navigation }) {
  //each of these constants handle navigation from each button
  const handleStoryScreenPress = () => {
    navigation.navigate("Story");
  };
  const handleDataHubPress = () => {
    navigation.navigate("Hub");
  };
  const handleWeatherScreenPress = () => {
    navigation.navigate("Weather");
  };
  const handleWildlifeScreenPress = () => {
    navigation.navigate("Wildlife");
  };
  const handleBlogScreenPress = () => {
    navigation.navigate("Blog");
  };
  const handleAiPress = () => {
    navigation.navigate("Ai");
  };

  const handleAttributionPress = () => {
    navigation.navigate("Attributions");
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', paddingBottom: 60 }}>
      {/* The paddingBottom should be at least as tall as the bottom tab navigator's height */}
      <GradientCard
        imageSource={require("../../assets/homescreen/PXL_20221014_204618892.png")}
        title="This app is brought to you by The girly Girl Comitte, a program committed to the principle that the human right to clean water requires the right-to-know that water is clean."
        buttonText="Learn more..."
        onButtonPress={handleStoryScreenPress}
        gradientColors={['#ffdde1', '#ee9ca7']}
      />
      <GradientCard
        imageSource={require("../../assets/homescreen/turtle.png")}
        title="Some of the local wildlife in both Choate Pond and the Hudson River might surprise you!"
        buttonText="See Local Wildlife..."
        onButtonPress={handleWildlifeScreenPress}
        gradientColors={['#FFFFFF', '#6DD5FA']}
      />
      <GradientCard
        imageSource={require("../../assets/homescreen/lightning-bolts.jpg")}
        title="Weather has a significant impact on the health of aquatic ecosystems."
        buttonText="See Local Weather..."
        onButtonPress={handleWeatherScreenPress}
        gradientColors={['#9D50BB', '#6E48AA']}
      />

      <GradientCard
        imageSource={require("../../assets/homescreen/waterSplash2.jpg")}
        title="Check out some of the Blue CoLab Blogs!"
        buttonText="Blog more..."
        onButtonPress={handleBlogScreenPress}
        gradientColors={['#ffdde1', '#ee9ca7']} // Example gradient colors
      />
      <GradientCard
          imageSource={require("../../assets/homescreen/code.jpg")}
          title="Code & Data Attributions"
          buttonText="Learn more..."
          onButtonPress={handleAttributionPress}
          gradientColors={['#FFFFFF', '#6DD5FA']}
      ></GradientCard>
    </ScrollView>
  );
}
/*
 <CustomCard imageSource={require("../../assets/homescreen/PXL_20221014_204618892.png")}
          paragraph="This app is brought to you by Blue CoLab, a program committed to the principle that the human right to clean water requires the right-to-know that water is clean."
          buttonText="Learn more..."
          cardContainer={styles.BlueCoLabContainer}
          buttonAction={handleStoryScreenPress}
        ></CustomCard>

        <CustomCard imageSource={{
          uri: "https://img.freepik.com/premium-vector/trading-graph-chart-growth-fall-business-profit-loss-stats-concept-vector-illustration_509058-11.jpg",
        }}
          paragraph="It is important to know the quality of water before you swim or fish in it. The purpose of our app is to make this information more accessible."
          buttonText="See Live Data..."
          cardContainer={styles.graphButtonContainer}
          buttonAction={handleDataHubPress}
        ></CustomCard>

        <CustomCard imageSource={require("../../assets/homescreen/turtle.png")}
          paragraph="Some of the local wildlife in both Choate Pond and the Hudson River might surprise you!"
          buttonText="See Local Wildlife..."
          cardContainer={styles.animalButtonContainer}
          buttonAction={handleWildlifeScreenPress}
        ></CustomCard>

        <CustomCard imageSource={require("../../assets/homescreen/lightning-bolts.jpg")}
          paragraph="Weather has a significant impact on the health of aquatic ecosystems."
          buttonText="See Local Weather..."
          cardContainer={styles.weatherButtonContainer}
          buttonAction={handleWeatherScreenPress}
        ></CustomCard>

        <CustomCard imageSource={require("../../assets/homescreen/waterSplash2.jpg")}
          paragraph="Check out some of the Blue CoLab Blogs!"
          buttonText="Blog more..."
          cardContainer={styles.BlogContainer}
          buttonAction={handleBlogScreenPress}
        ></CustomCard>

        <CustomCard imageSource={require("../../assets/homescreen/Plant2.jpg")}
          paragraph="Use this AI to identify any species of plant that you may see outdoors!"
          buttonText="Discover more..."
          cardContainer={styles.aiWidget}
          buttonAction={handleAiPress}
        ></CustomCard>

        <CustomCard imageSource={require("../../assets/homescreen/code.jpg")}
          paragraph="Code & Data Attributions"
          buttonText="Learn more..."
          cardContainer={styles.attributionsWidget}
          buttonAction={handleAttributionPress}
        ></CustomCard>

        \ Removed due security
        <GradientCard
        imageUrl="https://via.placeholder.com/150"
        title="Use this AI to identify any species of plant that you may see outdoors!"
        buttonText="Discover more..."
        onButtonPress={handleAiPress}
        gradientColors={['#6DD5FA', '#FFFFFF']} // Example gradient colors
      />



*/