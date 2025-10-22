import { Stack } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';

import { Widget, SENSOR_MAP } from '@/components/visualizations/Widget';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useCurrentData } from '@/contexts/CurrentDataContext';

export default function CurrentData() {
    const { isDark } = useColorScheme();
    const { airData, defaultLocation, error } = useCurrentData();

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Current Data',
                    headerStyle: {
                        backgroundColor: isDark ? '#2e2e3b' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                }}
            />
            <ScrollView className="h-full bg-defaultbackground dark:bg-defaultdarkbackground">
                {/* — Title — */}
                <View>
                    <Text className="mt-7 text-center text-2xl font-bold dark:text-white">
                        {defaultLocation?.name} Odin Data
                    </Text>
                </View>

                {error && (
                    <View>
                        <Text className="text-center text-xl font-bold dark:text-white">
                            {error.message}
                        </Text>
                    </View>
                )}

                <View className="flex flex-row flex-wrap">
                    {airData && (
                        <>
                            {/* <View className="w-full">
                                <Text className="mt-7 text-center text-2xl font-bold dark:text-white">
                                    Live Odin Data
                                </Text>
                            </View> */}
                            {Object.entries(airData.sensors).map(([key, value]) => {
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
            </ScrollView>
        </>
    );
}
