import React from "react";
import { View, Text, ScrollView, Image, Dimensions } from "react-native";
import styles from "../../styles"; // Import your existing styles

const windowWidth = Dimensions.get("window").width;

const WildlifeScreen = () => {
  const choateWildlifeData = [
    {
      animalName: "Largemouth bass",
      scientificName: "Micropterus salmoides",
      funFact: "The largemouth bass is an ambush predator and often consumes prey in a single strike.",
      imageUri: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Largemouth_bass_fish_underwater_animal_in_natural_habitat_micropterus_salmoides.jpg",
    },
    {
      animalName: "Snapping turtle",
      scientificName: "Chelydra serpentina",
      funFact: "Snapping turtles are capable of living over 100 years.",
      imageUri: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Common_Snapping_Turtle_Close_Up.jpg/1280px-Common_Snapping_Turtle_Close_Up.jpg",
    },
    // Add more wildlife data as needed...
  ];

  return (
    <View style={styles.wildContainer}>
      <Text style={styles.paragraphTextWildlife}>Wildlife in Choate Pond</Text>
      
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContainer} // Use contentContainerStyle to center items
      >
        {choateWildlifeData.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image 
              source={{ uri: item.imageUri }} 
              style={styles.smallImage} // Use smaller image style
            />
            <Text style={styles.animalName}>{item.animalName}</Text>
            <Text style={styles.scientificName}>{item.scientificName}</Text>
            <Text style={styles.funFact}>{item.funFact}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default WildlifeScreen;
