import React from 'react';
import { Text, View, Image, TouchableHighlight } from 'react-native';
import styles from "../../styles";

const CustomCard = (props) => {
  return (
    <View style={props.cardContainer}>
      <Image source={props.imageSource} style={styles.imageContainer} />
      <Text style={styles.homeParagraphText}>
        {props.paragraph}
      </Text>

      <TouchableHighlight
        onPress={props.buttonAction}

      >
        <View style={styles.generalButton}>
          <Text style={styles.mainButtonText}>{props.buttonText}</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

export default CustomCard;
