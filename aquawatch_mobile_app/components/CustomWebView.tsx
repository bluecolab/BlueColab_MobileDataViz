import React, { useRef } from 'react';
import { Linking } from 'react-native';
import { WebView } from 'react-native-webview';

interface CustomWebViewProps {
  uri: string;
}

const CustomWebView = ({ uri }: CustomWebViewProps) => {
  const webviewRef = useRef(null);

  interface NavigationEvent {
    url: string;
  }

  const handleNavigation = (event: NavigationEvent): boolean => {
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
