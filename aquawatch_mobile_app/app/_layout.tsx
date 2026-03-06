// app/_layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import '../global.css';
import { Stack } from 'expo-router';
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

import ColorSchemeProvider from '@/contexts/ColorSchemeContext';
import CurrentDataProvider from '@/contexts/CurrentDataContext';
import UserSettingsProvider from '@/contexts/UserSettingsContext';


//import { Text, View, Button, Platform } from 'react-native';

export const unstable_settings = {
    initialRouteName: 'index',
};

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

/*async function sendPushNotification(expoPushToken: string) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Original Title',
        body: 'And here is the body!',
        data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}
*/
function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            handleRegistrationError(
                'Permission not granted to get push token for push notification!'
            );
            return;
        }
        const projectId =
            Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        if (!projectId) {
            handleRegistrationError('Project ID not found');
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            console.log(pushTokenString);
            return pushTokenString;
        } catch (e: unknown) {
            handleRegistrationError(`${e}`);
        }
    } else {
        handleRegistrationError('Must use physical device for push notifications');
    }
}

/** The root layout of the app. It wraps the app in the necessary providers.
 * @returns {JSX.Element}
 */
// Initialize Query Client once (module scope to preserve across re-renders)
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Avoid refetching on every screen focus unless desired
            refetchOnWindowFocus: true,
            staleTime: 1000 * 60, // 1 minute by default; screen-level queries can override
        },
    },
});

export default function RootLayout() {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
        undefined
    );
    console.log('expoPushToken:', expoPushToken);
    console.log('notification:', notification);
    useEffect(() => {
        registerForPushNotificationsAsync()
            .then((token) => setExpoPushToken(token ?? ''))
            .catch((error: any) => setExpoPushToken(`${error}`));

        const notificationListener = Notifications.addNotificationReceivedListener(
            (notification) => {
                setNotification(notification);
            }
        );

        const responseListener = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                console.log(response);
            }
        );

        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }, []);
    return (
        <QueryClientProvider client={queryClient}>
            <UserSettingsProvider>
                <CurrentDataProvider>
                    <ColorSchemeProvider>
                        <Stack>
                            <Stack.Screen name="index" options={{ headerShown: false }} />
                            <Stack.Screen
                                name="settings"
                                options={{
                                    presentation: 'modal',
                                    headerShown: false,
                                }}
                            />
                        </Stack>
                    </ColorSchemeProvider>
                </CurrentDataProvider>
            </UserSettingsProvider>
        </QueryClientProvider>
    );
}
