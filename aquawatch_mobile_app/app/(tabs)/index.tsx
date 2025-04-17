/** 
 *  @file (tabs)/index.tsx - index.tsx are the default file of the folder when tabs are opened. In this case, this file will redirect to (tabs)/home page when the app is opened.
 **/ 
import { Redirect } from 'expo-router';

export default function RedirectHome() {
  return <Redirect href="/(tabs)/home/" />;
}
