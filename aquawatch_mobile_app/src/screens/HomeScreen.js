import React from "react";
import {
  View,
  Text,
  ScrollView
} from "react-native";
import styles from "../../styles";
import CustomCard from "../components/CustomCard";

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
  const handleAttributionPress = () => {
    navigation.navigate("Attributions");
  }
  const handleChoatePress = () => {
    navigation.navigate("Choate");
  };

  return (
    <ScrollView>
      <View style={styles.container}>

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

        {<Text >
          {" "}
          Hidden text to make the bottom on this screen come out a little more{" "}
        </Text>}
      </View>
    </ScrollView>
  );
}
