import React from "react";
import { View } from "react-native";
import CustomWebView from "../components/CustomWebView";

export default function BlogScreen({ navigation }) {

  return (
    <View style={{ flex: 1 }}>
      <CustomWebView uri="https://bluecolab.blogs.pace.edu/blog-app/" />
    </View>
  )
}