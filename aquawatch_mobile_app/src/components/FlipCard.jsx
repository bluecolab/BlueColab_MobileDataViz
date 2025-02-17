import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Animated, TouchableOpacity, Text } from 'react-native';
import EmptyGraph from "./EmptyGraph";

export default function FlipCard() {
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false); // Track if the card is flipped

  const startAnimation = () => {
    Animated.timing(flipAnimation, {
      toValue: flipped ? 0 : 1, // Toggle between 0 and 1
      duration: 500, // Adjust duration as needed
      useNativeDriver: true,
    }).start(() => setFlipped(!flipped)); // Update state after animation finishes
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'], // Ensures correct orientation
  });

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={startAnimation}>
        <View style={styles.flipContainer}>
          {/* Front Face */}
          <Animated.View style={[styles.flipCard, styles.flipCardFront, { transform: [{ rotateY: frontInterpolate }] }]}>
            <Text style={styles.text}>Front</Text>
          </Animated.View>

          {/* Back Face */}
          <Animated.View style={[styles.flipCard, styles.flipCardBack, { transform: [{ rotateY: backInterpolate }] }]}>
            <Text>Testing</Text>
            <EmptyGraph />
          </Animated.View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipContainer: {
    width: 200,
    height: 200,
    perspective: 1000, // Required for 3D effect
  },
  flipCard: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', // Stack both cards on top of each other
    backfaceVisibility: 'hidden', // Hide back when front is visible
  },
  flipCardFront: {
    backgroundColor: '#fff',
  },
  flipCardBack: {
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    color: '#000',
  },
});
