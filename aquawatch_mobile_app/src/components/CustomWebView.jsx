import React, { useRef } from 'react';
import { Linking } from 'react-native';
import { WebView } from 'react-native-webview';

const CustomWebView = ({ uri }) => {
  const webviewRef = useRef(null);

  const handleNavigation = (event) => {
    const { url } = event;
    if (
      url.includes('aquawatchmobile.shinyapps.io') ||
      url.includes('pace.edu')
    ) {
      return true;
    } else {
      Linking.openURL(url);
      return false;
    }
  };

  return (
    <WebView
      ref={webviewRef}
      source={{ uri }}
      onShouldStartLoadWithRequest={handleNavigation}
    />
  );
};

export default CustomWebView;
