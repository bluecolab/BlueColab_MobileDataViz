import React from 'react';
import { Text, ScrollView, View, Linking } from 'react-native';

export default function Feedback() {
  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };
  const LinkComp = ({ url, label }) => (
    <Text
      onPress={() => handleLinkPress(url)}
      className="text-blue-400 underline">
      <Text>{label}</Text>
    </Text>
  );

  return (
    <ScrollView className="bg-defaultbackground dark:bg-defaultdarkbackground">
      <View className="m-default rounded-3xl  bg-white p-default tracking-tight dark:bg-gray-700">
        <Text className="text-xl font-bold text-black dark:text-white">
          Bugs? Problems? Suggestions?
        </Text>

        <Text className="pl-3 text-lg text-black dark:text-white">
          We're be happy to hear from you. Please fill the form{' '}
          <LinkComp url="https://forms.gle/2y21wnxK3nJkbXpU6" label="here" />.
        </Text>
      </View>
    </ScrollView>
  );
}
