import { CustomWebView } from '@components';
import React from 'react';
import { View } from 'react-native';
export default function MonthlyData() {
  return (
    <View style={{ flex: 1 }}>
      <CustomWebView uri="https://aquawatchmobile.shinyapps.io/aquawatchmobilepy/" />
    </View>
  );
}
