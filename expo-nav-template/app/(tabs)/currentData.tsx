import { Stack } from 'expo-router';
import { useIsDark } from '@/contexts/ColorSchemeContext';
import { useCurrentData } from '@/contexts/CurrentDataContext';
import {
    View,
    Text,
    ScrollView,
} from 'react-native';
import { WQICard } from '@/components/visualizations/WQI/WQICard';
import { Widget } from '@/components/visualizations/Widget';

export default function CurrentData() {
    const { isDark } = useIsDark();
    const { data, defaultLocation, defaultTempUnit } =
        useCurrentData();

    // grab the latest sample
    const last = data[data.length - 1];

    // convert temperature if needed
    const temp = last.Temp;
    const waterTemp =
        (defaultTempUnit?.trim() ?? 'Fahrenheit') === 'Fahrenheit'
            ? temp * (9 / 5) + 32
            : temp;

    // sensor values
    const cond = last.Cond;
    const sal = last.Sal;
    const pH = last.pH;
    const turb = last.Turb;
    const dOpct = last.DOpct;

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Current Data',
                    headerStyle: {
                        backgroundColor: isDark ? '#2e2e3b' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black'
                }}
            />
            <ScrollView className="bg-defaultbackground dark:bg-defaultdarkbackground h-full">
                {/* — Title — */}
                <View>
                    <Text className="mt-7 text-center text-2xl font-bold dark:text-white">
                        {defaultLocation} Data
                    </Text>
                </View>

                {/* — Your 6 Widgets — */}
                <View className="flex flex-row flex-wrap">
                    <Widget
                        name="Water Temperature"
                        value={waterTemp?.toFixed(2) ?? 'NA'}
                    />
                    <Widget name="Conductivity" value={cond?.toFixed(2) ?? 'NA'} />
                    <Widget name="Salinity" value={sal?.toFixed(2) ?? 'NA'} />
                    <Widget name="pH" value={pH?.toFixed(2) ?? 'NA'} />
                    <Widget name="Turbidity" value={turb?.toFixed(2) ?? 'NA'} />
                    <Widget name="Oxygen" value={dOpct?.toFixed(2) ?? 'NA'} />
                </View>

                {/* — Current‐Data WQI Gauge — */}
                <View className="mt-6 px-4 items-center">
                    <WQICard
                        loading={false}
                        data={[last]}   // run WQI on the latest point
                    />
                </View>
                <View className='pb-[25]'>
                <Text>Test</Text>
            </View>
            </ScrollView>
            
        </>
    );
}
