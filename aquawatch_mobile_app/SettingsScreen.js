import React from 'react';
import { View, Text } from 'react-native';
import styles from './stylesCard'; // Make sure this path is correct

export default function MiddleScreen() {
  return (
    <View style={styles.container}>
      <Text>Settings</Text>
    </View>
  );
}
