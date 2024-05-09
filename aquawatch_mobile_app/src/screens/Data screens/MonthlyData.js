import React from "react";
import { View } from "react-native";
import CustomWebView from "../../components/CustomWebView";
export default function MonthlyData({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <CustomWebView uri="https://aquawatchmobile.shinyapps.io/aquawatchmobilepy/" />
    </View>

  );
}