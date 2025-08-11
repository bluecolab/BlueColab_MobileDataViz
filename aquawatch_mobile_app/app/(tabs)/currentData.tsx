import { Stack } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';

import { Widget } from '@/components/visualizations/Widget';
import { WQICard } from '@/components/visualizations/WQI/WQICard';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { useCurrentData } from '@/contexts/CurrentDataContext';
import { extractLastData } from '@/utils/extractLastData';

export default function CurrentData() {
    const { isDark } = useColorScheme();
    const { data, defaultLocation, defaultTempUnit, loadingCurrent } = useCurrentData();

    const lastDataPoint = extractLastData(data, defaultLocation, defaultTempUnit, loadingCurrent);

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
                        {defaultLocation} Data
                    </Text>
                </View>

                {/* — Your 6 Widgets — */}
                <View className="flex flex-row flex-wrap">
                    <Widget name="Water Temperature" value={lastDataPoint.temp} />
                    <Widget name="Conductivity" value={lastDataPoint.cond} />
                    <Widget name="Salinity" value={lastDataPoint.sal} />
                    <Widget name="pH" value={lastDataPoint.pH} />
                    <Widget name="Turbidity" value={lastDataPoint.turb} />
                    <Widget name="Oxygen" value={lastDataPoint.do} />
                </View>

                {/* — Current‐Data WQI Gauge — */}
                <View className="mt-6 items-center px-4">
                    <WQICard
                        loading={false}
                        data={[]} // run WQI on the latest point
                        wqi={lastDataPoint.wqi}
                    />
                </View>
                <View className="pb-[25]">
                    <Text></Text>
                </View>
            </ScrollView>
        </>
    );
}
