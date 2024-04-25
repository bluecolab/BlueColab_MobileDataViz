import React from "react";
import moment from "moment";
import { View } from "react-native";
import CustomWebView from "../../components/CustomWebView";
export default function HistoricalDataScreenChoate({ navigation }) {

  console.log();
  console.log(moment().clone().subtract(1, 'months').format('MMMM')
  );

  return (
    <View style={{ flex: 1 }}>
      <CustomWebView uri="https://aquawatchmobile.shinyapps.io/aquawatchmobilepy/" />
    </View>

  );
}