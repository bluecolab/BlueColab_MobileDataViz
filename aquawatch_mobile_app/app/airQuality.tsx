import { FontAwesome } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useCallback, useState } from 'react';
import { View, Text, ScrollView, Modal, Pressable } from 'react-native';
import WebView from 'react-native-webview';

import { Widget, SENSOR_MAP } from '@/components/visualizations/Widget';
import PolarChart from '@/components/visualizations/WQI/PolarChart';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useCurrentData } from '@/contexts/CurrentDataContext';

function HeaderRefreshButton({ onPress, color }: { onPress: () => void; color: string }) {
    return (
        <Pressable onPress={onPress} accessibilityLabel="Refresh waterData" className="pr-4">
            <FontAwesome name="refresh" size={24} color={color} />
        </Pressable>
    );
}

function HeaderSettingsButton({ onPress, color }: { onPress: () => void; color: string }) {
    return (
        <Pressable onPress={onPress} accessibilityLabel="Settings" className="pr-4">
            <FontAwesome name="gear" size={24} color={color} />
        </Pressable>
    );
}

export default function AirQuality() {
    const { isDark } = useColorScheme();
    const [modalVisible, setModalVisible] = useState(false);
    const { aqiData, aqiError, refetchCurrent } = useCurrentData();

    // Use US EPA AQI
    const usAQI = aqiData?.usAQI;
    const aqi = usAQI?.aqi;
    const category = usAQI?.category;
    const dominantPollutant = usAQI?.dominantPollutant;

    // Calculate percent for PolarChart (0-500 scale, where lower is better)
    const percent = aqi !== undefined ? Math.max(0, Math.min(100, ((500 - aqi) / 500) * 100)) : 0;

    const headerRight = useCallback(
        () => (
            <>
                <HeaderRefreshButton onPress={refetchCurrent} color={isDark ? 'white' : 'black'} />
                <HeaderSettingsButton
                    onPress={() => router.push('/settings')}
                    color={isDark ? 'white' : 'black'}
                />
            </>
        ),
        [refetchCurrent, isDark]
    );

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Current Data',
                    headerStyle: {
                        backgroundColor: isDark ? '#2e2e3b' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                    headerBackTitle: 'Home',
                    headerRight,
                }}
            />
            <ScrollView className="h-full bg-defaultbackground dark:bg-defaultdarkbackground">
                {/* — Title — */}
                <View>
                    <Text className="mt-7 text-center text-2xl font-bold dark:text-white">
                        Pace Campus AQI Data
                    </Text>
                </View>

                {aqiError && (
                    <View>
                        <Text className="text-center text-xl font-bold dark:text-white">
                            {aqiError.message}
                        </Text>
                    </View>
                )}

                {/* US EPA AQI Display */}
                {aqiData && (
                    <View className="items-center px-4 py-4">
                        <View className="h-[200] w-[200]">
                            <View className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                                <Text className="text-center text-4xl font-bold dark:text-white">
                                    {aqi}
                                </Text>
                                <Text className="text-md text-center font-semibold dark:text-white">
                                    {category}
                                </Text>
                            </View>
                            <PolarChart percent={Math.round(percent)} isDark={isDark} />
                        </View>
                        <Text className="mt-2 text-center text-sm dark:text-white">
                            US EPA Air Quality Index
                        </Text>
                        {dominantPollutant && (
                            <Text className="text-center text-sm text-gray-500 dark:text-gray-400">
                                Dominant Pollutant: {dominantPollutant}
                            </Text>
                        )}
                    </View>
                )}

                <Pressable
                    className="m-4 rounded-lg bg-blue-500 p-4"
                    onPress={() => setModalVisible(true)}>
                    <Text className="text-center text-white">View PurpleAir Dashboards</Text>
                </Pressable>

                <View className="flex flex-row flex-wrap">
                    {aqiData && (
                        <>
                            {Object.entries(aqiData.list[0].components).map(([key, value]) => {
                                // Use the map to get the correct widget name
                                const widgetName = SENSOR_MAP[key];

                                if (widgetName) {
                                    return <Widget key={key} name={widgetName} value={value} />;
                                }

                                return null;
                            })}
                        </>
                    )}
                </View>

                <Modal visible={modalVisible} animationType="slide">
                    <View className="flex-col justify-around">
                        <View className="flex-row items-center justify-between bg-[#1c2b4b] px-4 py-3">
                            <Text className="flex-1 text-lg font-bold text-white">
                                Data Live from Blue CoLab!
                            </Text>
                            <Pressable onPress={() => setModalVisible(false)} className="p-1">
                                <Text className="text-2xl font-bold text-white">✕</Text>
                            </Pressable>
                        </View>
                        <ScrollView className="dark:bg-defaultdarkbackground">
                            <View className="h-[500px] w-full">
                                <Text className="text-center text-lg dark:text-white">
                                    Softball Field
                                </Text>
                                <WebView
                                    className="rounded-lg border-0"
                                    source={{
                                        uri: `https://bluecolab.github.io/grafana-dashboard-gallery/purple-air-1?isDark=${isDark}`,
                                    }}
                                    scrollEnabled={false}
                                />
                            </View>
                            <View className="h-[500px] w-full">
                                <Text className="text-center text-lg dark:text-white">
                                    Nature Center
                                </Text>
                                <WebView
                                    className="rounded-lg border-0"
                                    source={{
                                        uri: `https://bluecolab.github.io/grafana-dashboard-gallery/purple-air-2?isDark=${isDark}`,
                                    }}
                                    scrollEnabled={false}
                                />
                            </View>
                        </ScrollView>
                    </View>
                </Modal>
            </ScrollView>
        </>
    );
}
