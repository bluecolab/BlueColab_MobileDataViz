import React from 'react';
import { WebView } from 'react-native-webview';
import { View, Text } from 'react-native';
import styles from './SettingsScreen'; // Make sure this path is correct

export default function MiddleScreen() {
  return (
    <WebView
      source={{ uri: `https://colabprod01.pace.edu/grafana/public-dashboards/841327a5d5fa493b8f14d638ffe2041e` }}
      style={{ flex: 1 }}
    />

);
}
// TESTING :)