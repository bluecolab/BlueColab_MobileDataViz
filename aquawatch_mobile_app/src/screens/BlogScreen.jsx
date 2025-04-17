import { CustomWebView } from '@components';
import React from 'react';
import { View } from 'react-native';

export default function BlogScreen() {
  return (
    <View style={{ flex: 1 }}>
      <CustomWebView uri="https://bluecolab.blogs.pace.edu/blog-app/" />
    </View>
  );
}
