import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions, ImageBackground } from "react-native";
import { cardStyles } from "../../stylesCard";

const { width } = Dimensions.get("window"); // Get the width of the device to set the image width

// Define the GradientCard component with props for customization
const GradientCard = ({ imageSource, title, buttonText, onButtonPress, isMain }) => {
  // Determine if imageSource is a URI or a local image
  const image = typeof imageSource === "string" ? { uri: imageSource } : imageSource;
  return (
    <TouchableOpacity onPress={onButtonPress}>
      <View className={`ml-[10] my-2 rounded-3xl overflow-hidden bg-white ${isMain ? 'mr-[10]' : ''}`}>
        <ImageBackground
          source={image}
          style={[
            cardStyles.cardImage,
            {
              width: isMain ? width : width / 2,
              height: isMain ? 200 : 100,
            },
          ]}
          imageStyle={{ borderRadiusTopLeft: 24, borderRadiusTopRight: 24}}
        >

        </ImageBackground>
        <Text className={`text-gray-600 ${isMain ? 'text-lg' : 'text-sm'} pl-1`}>{buttonText}</Text>
        <Text className={`text-gray-700 font-bold ${isMain ? 'text-3xl' : 'text-2xl'} pb-4 pl-1`}>{title}</Text>
      </View>
    </TouchableOpacity>

  );
};

export default GradientCard;
