import React from "react";
import {
  View,
  ScrollView
} from "react-native";
import styles from "../../styles";
//import CustomCard from "../components/CustomCard";
import GradientCard from "../components/GradientCard"; 

export default function DataHub({ navigation }) {
  const handleChoatePress = () => {
    navigation.navigate("Choate");
  };
  const handlePoughPress = () => {
    navigation.navigate("Pough");
  };
  const handleWPPress = () => {
    navigation.navigate("WP");
  };
  const handleYonkPress = () => {
    navigation.navigate("Yonk");
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', paddingBottom: 60 }}>
     
        <GradientCard
          imageSource={require("../../assets/homescreen/PXL_20221014_204618892.png")}
          title="Choate Pond is in the center of the Pace University campus. This Pond and many others flow out into the Hudson River, contributing to its overall water quality which is why we look at its quality and Pace University's contribution to either better or worse Hudson water quality."
          buttonText="Choate Data"
          onButtonPress={handleChoatePress}
          gradientColors={['#ffdde1', '#ee9ca7']} // [Bottom Color, Upper Color] yes order is abit messy buuut still works :)
        ></GradientCard>

        <GradientCard
          imageSource={{ uri: "https://cdn18.picryl.com/photo/2019/11/18/poughkeepsie-bridge-spanning-hudson-river-poughkeepsie-dutchess-county-ny-e51f90-1024.jpg" }}
          title="Poughkeepsie is the furthest north out of all the data points in this app. Ideally this would have the highest water quality as the pollution of the bigger towns down below could not reach it."
          buttonText="Poughkeepsie Data"
          onButtonPress={handlePoughPress}
          gradientColors={['#ffdde1', '#ee9ca7']} // [Bottom Color, Upper Color] yes order is abit messy buuut still works :)
        ></GradientCard>

        <GradientCard
          imageSource={{ uri: "https://www.stripes.com/incoming/522n9n-3011234658_baf0dc3ac9_c.jpg/alternates/LANDSCAPE_910/3011234658_baf0dc3ac9_c.jpg" }}
          title="The West Point Military academy is still north of Pace, closer to areas such as Beacon and Cold Spring."
          buttonText="West Point Data"
          onButtonPress={handleWPPress}
          gradientColors={['#ffdde1', '#ee9ca7']} // [Bottom Color, Upper Color] yes order is abit messy buuut still works :)
        ></GradientCard>

        <GradientCard 
          imageSource={{ uri: "https://res.cloudinary.com/simpleview/image/upload/v1522775889/clients/westchesterny/shutterstock_20108908_1__b0a14121-1a73-4fe0-b578-cac657063725.jpg" }}
          title="Yonkers is the furthest south out of all the data shown. Being closest to NYC we expect this point to be the lowest quality and we at Pace University contribute to this part of the river."
          buttonText="Yonkers Data"   
          onButtonPress={handleYonkPress}
          gradientColors={['#ffdde1', '#ee9ca7']} // [Bottom Color, Upper Color] yes order is abit messy buuut still works :)
        ></GradientCard>
    </ScrollView>
  );
}
