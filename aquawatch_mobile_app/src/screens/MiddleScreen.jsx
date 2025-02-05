import React from 'react';
import { View } from 'react-native';
import { CustomWebView } from "@components";

export default function MiddleScreen() {
  return (
    <View style={{ flex: 1 }}>
      <CustomWebView uri="https://colabprod01.pace.edu/grafana/public-dashboards/841327a5d5fa493b8f14d638ffe2041e" />
    </View>
  );
}
