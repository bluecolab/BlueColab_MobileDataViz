import { Stack, router } from 'expo-router';
import { Pressable, View, Text, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useMemo } from 'react';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useCurrentData } from '@/contexts/CurrentDataContext';

// Custom app-wide stack layout with a sticky top menu (gear left, logo center, location right)
export default function AppLayout() {
    const { isDark } = useColorScheme();
    const { defaultLocation } = useCurrentData();

    const headerBackground = isDark ? '#2e2e3b' : 'white';
    const textColor = isDark ? 'white' : '#111827';

    const commonScreenOptions = useMemo(
        () => ({
            headerStyle: { backgroundColor: headerBackground, height: 48, paddingVertical: 0 },
            headerTitleAlign: 'center' as const,
            headerTitleContainerStyle: { paddingVertical: 0 },
            headerLeftContainerStyle: { paddingVertical: 0, paddingLeft: 6 },
            headerRightContainerStyle: { paddingVertical: 0, paddingRight: 6 },
            headerTintColor: textColor,
            headerShadowVisible: false,
            headerBackTitleVisible: false,
            headerTitle: () => (
                <Pressable onPress={() => router.push('/home')} accessibilityLabel="Go Home">
                    <Image
                        source={require('@/assets/splash.png')}
                        style={{ width: 120, height: 28, resizeMode: 'contain' }}
                    />
                </Pressable>
            ),
            headerLeft: () => (
                <Pressable
                    onPress={() => router.push('/settings')}
                    accessibilityLabel="Open Settings"
                    style={{ paddingHorizontal: 4, paddingVertical: 4 }}>
                    <FontAwesome name="gear" size={20} color={textColor} />
                </Pressable>
            ),
            headerRight: () => (
                <Pressable
                    onPress={() => router.push('/settings')}
                    accessibilityLabel="Change Location"
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: isDark ? '#374151' : '#e5e7eb',
                        paddingVertical: 6,
                        paddingHorizontal: 10,
                        borderRadius: 14,
                    }}>
                    <FontAwesome
                        name="map-marker"
                        size={14}
                        color={textColor}
                        style={{ marginRight: 6 }}
                    />
                    <Text style={{ fontSize: 11, fontWeight: '600', color: textColor }}>
                        {defaultLocation?.name ?? 'Location'}
                    </Text>
                </Pressable>
            ),
        }),
        [headerBackground, textColor, isDark, defaultLocation?.name]
    );

    return (
        <Stack initialRouteName="home" screenOptions={commonScreenOptions}>
            <Stack.Screen
                name="home"
                options={{
                    headerBackVisible: false,
                }}
            />
            <Stack.Screen name="currentData" />
            <Stack.Screen name="settings" />
            {/* Nested home stack screens */}
            <Stack.Screen name="home/historicData" />
            <Stack.Screen name="home/airQuality" />
            <Stack.Screen name="home/odinData" />
            <Stack.Screen name="home/waterReport" />
            <Stack.Screen name="home/story" />
            <Stack.Screen name="home/blog" />
        </Stack>
    );
}
