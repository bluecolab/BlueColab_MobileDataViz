import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { cardStyles } from "../../stylesCard";

const { width } = Dimensions.get("window"); // Get the width of the device to set the image width

// Define the GradientCard component with props for customization
const GradientCard = ({ imageSource, title, buttonText, onButtonPress, gradientColors }) => {
  // Determine if imageSource is a URI or a local image
  const image = typeof imageSource === "string" ? { uri: imageSource } : imageSource;

  return (
    <View style={{ width }}>
      <View className="w-full m-[10]">
        {/* Display the image with dynamic width and fixed height. */}
        <Image 
          className="rounded-t-3xl"
          source={image} style={[cardStyles.cardImage, { width: width - 20, height: 200 }]} />
        {/* Gradient stuff */}
        <LinearGradient
          colors={gradientColors}
          style={cardStyles.gradientBackground}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
        >
          {/* Title and button with styling and functionality. */}
          <Text style={cardStyles.cardText}>{title}</Text>
          <TouchableOpacity onPress={onButtonPress} style={cardStyles.cardButton}>
            <Text style={cardStyles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

export default GradientCard;
