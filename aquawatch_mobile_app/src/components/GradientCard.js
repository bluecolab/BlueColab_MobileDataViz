import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { cardStyles } from '../../stylesCard'; // Ensure this path is correct

const { width } = Dimensions.get('window'); // Get the width of the device to set the image width

const GradientCard = ({ imageSource, title, buttonText, onButtonPress, gradientColors }) => {
  // Determine if imageSource is a URI or a local require
  const image = typeof imageSource === 'string' ? { uri: imageSource } : imageSource;

  return (
    <View style={cardStyles.cardContainer}>
      <Image source={image} style={[cardStyles.cardImage, { width: width - 20, height: 200 }]} />
      {/* Gradient now accepts colors as a prop and flips direction */}
      <LinearGradient
        colors={gradientColors}
        style={cardStyles.gradientBackground}
        start={{ x: 0, y: 1 }} // Flipped the gradient direction
        end={{ x: 0, y: 0 }}
      >
        <Text style={cardStyles.cardText}>{title}</Text>
        <TouchableOpacity onPress={onButtonPress} style={cardStyles.cardButton}>
          <Text style={cardStyles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default GradientCard;
