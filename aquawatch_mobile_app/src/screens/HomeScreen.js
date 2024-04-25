import React from "react";
import {
  View,
  Text,
  ScrollView
} from "react-native";
// import styles from "../../styles"; NOT IN USE
// import CustomCard from "../components/CustomCard"; NOT IN USE
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
  const handleWildlifeScreenPress = () => {
    navigation.navigate("Wildlife");
  };
  const handleBlogScreenPress = () => {
    navigation.navigate("Blog");
  };
  const handleAttributionPress = () => {
    navigation.navigate("Attributions");
  }
  const handleChoatePress = () => {
    navigation.navigate("Choate");
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', paddingBottom: 60 }}>
      {/* The paddingBottom should be at least as tall as the bottom tab navigator's height */}
      {/* More info about the gradientCard Check GradientCard.js and StylesCard.js */}
      <GradientCard
        imageSource={require("../../assets/homescreen/PXL_20221014_204618892.png")} // image soruce als idendify URl all u gotta do is "http//something.com" for local images use {require("./something")}
        title="This app is brought to you by Blue CoLab, a program committed to the principle that the human right to clean water requires the right-to-know that water is clean." // Pretty much the text
        buttonText="Learn more..."
        onButtonPress={handleStoryScreenPress}
        gradientColors={['#ffdde1', '#ee9ca7']} // [Bottom Color, Upper Color] yes order is abit messy buuut still works :)
      />
      <GradientCard
        imageSource={require("../../assets/homescreen/turtle.png")}
        title="Some of the local wildlife in both Choate Pond and the Hudson River might surprise you!"
        buttonText="See Local Wildlife..."
        onButtonPress={handleWildlifeScreenPress}
        gradientColors={['#FFFFFF', '#6DD5FA']}
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

/* This can be deleted and CustomCard may or may not be removed
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
          buttonAction={handleChoatePress}
        ></CustomCard>

        <CustomCard imageSource={require("../../assets/homescreen/turtle.png")}
          paragraph="Some of the local wildlife in both Choate Pond and the Hudson River might surprise you!"
          buttonText="See Local Wildlife..."
          cardContainer={styles.animalButtonContainer}
          buttonAction={handleWildlifeScreenPress}
        ></CustomCard>

        <CustomCard imageSource={require("../../assets/homescreen/waterSplash2.jpg")}
          paragraph="Check out some of the Blue CoLab Blogs!"
          buttonText="Blog more..."
          cardContainer={styles.BlogContainer}
          buttonAction={handleBlogScreenPress}
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