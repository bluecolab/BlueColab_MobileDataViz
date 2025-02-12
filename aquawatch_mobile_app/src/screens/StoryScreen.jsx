import React from "react";
import { View } from "react-native";
import { CustomWebView } from "@components";

export default function StoryScreen() {
  return (
    <View style={{ flex: 1 }}>
      <CustomWebView uri="https://bluecolab.pace.edu/about-us-2/" />
    </View>
  )
}
