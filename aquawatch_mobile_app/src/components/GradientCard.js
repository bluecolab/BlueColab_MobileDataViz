// GradientCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { cardStyles } from '../../stylesCard'; // Ensure this import points to where your styles are defined

const { width } = Dimensions.get('window'); // Get the width of the device to set the image width

const GradientCard = ({ imageUrl, title, buttonText, onButtonPress, gradientColors }) => {
  return (
    <View style={cardStyles.cardContainer}>
      <Image source={{ uri: imageUrl }} style={[cardStyles.cardImage, { width: width - 20, height: 200 }]} />
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
