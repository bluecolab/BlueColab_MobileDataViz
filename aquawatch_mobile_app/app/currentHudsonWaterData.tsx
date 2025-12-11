// import { FontAwesome } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';

import CustomDropdown from '@/components/CustomDropdown';
import { Widget } from '@/components/visualizations/Widget';
import { WQICard } from '@/components/visualizations/WQI/WQICard';
import { useColorScheme } from '@/contexts/ColorSchemeContext';
// import { useCurrentData } from '@/contexts/CurrentDataContext';
import { useUserSettings } from '@/contexts/UserSettingsContext';
import useGetClosestStation from '@/hooks/useClosestStation';
import { config } from '@/hooks/useConfig';
import useGetWaterData from '@/hooks/useGetWaterData';
import { LocationType } from '@/types/location.type';
import { extractLastData } from '@/utils/data/extractLastData';
import getMetadata from '@/utils/getMetadata';

// function HeaderRefreshButton({ onPress, color }: { onPress: () => void; color: string }) {
//     return (
//         <Pressable onPress={onPress} accessibilityLabel="Refresh waterData" className="pr-4">
//             <FontAwesome name="refresh" size={24} color={color} />
//         </Pressable>
//     );
// }

// function HeaderSettingsButton({ onPress, color }: { onPress: () => void; color: string }) {
//     return (
//         <Pressable onPress={onPress} accessibilityLabel="Settings" className="pr-4">
//             <FontAwesome name="gear" size={24} color={color} />
//         </Pressable>
//     );
// }

export default function CurrentHudsonWaterData() {
    const { isDark } = useColorScheme();
    const { defaultTemperatureUnit, showConvertedUnits } = useUserSettings();
    const { locationOptions } = getMetadata();
    const { fetchWaterData } = useGetWaterData();

    const closestStation = useGetClosestStation();

    const [selectedLocationLocalValue, setSelectedLocationLocalValue] = useState<string>(
        locationOptions[0].value
    );
    const [selectedLocationLocalLabel, setSelectedLocationLocalLabel] = useState<string>(
        locationOptions[0].label
    );

    const onLocationSelect = useCallback(
        (value: string) => {
            const defaultLocationValue =
                locationOptions.find((option) => option.value === value)?.value || '';
            setSelectedLocationLocalValue(defaultLocationValue);
            setSelectedLocationLocalLabel(
                locationOptions.find((option) => option.value === value)?.label || ''
            );
        },
        [locationOptions, setSelectedLocationLocalValue]
    );

    const [waterData, setWaterData] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            const valid = config.USGS_WATER_SERVICES_API_CONFIG.validMatches;
            const location =
                selectedLocationLocalLabel === 'Nearest Station'
                    ? closestStation.closestStation
                    : valid.find((loc) => loc.name === selectedLocationLocalLabel);

            const data = await fetchWaterData(location as LocationType, true, 0, 0, 0, 0);
            setWaterData(data);
        }
        fetchData();
    }, [selectedLocationLocalLabel, closestStation, fetchWaterData]);

    const lastDataPoint = waterData
        ? extractLastData(
              waterData,
              selectedLocationLocalLabel === 'Nearest Station'
                  ? closestStation.closestStation
                  : config.USGS_WATER_SERVICES_API_CONFIG.validMatches.find(
                        (loc) => loc.name === selectedLocationLocalLabel
                    ),
              defaultTemperatureUnit,
              false,
              null,
              showConvertedUnits
          )
        : null;

    // const headerRight = useCallback(
    //     () => (
    //         <>
    //             <HeaderRefreshButton onPress={refetchCurrent} color={isDark ? 'white' : 'black'} />
    //             <HeaderSettingsButton
    //                 onPress={() => router.push('/settings')}
    //                 color={isDark ? 'white' : 'black'}
    //             />
    //         </>
    //     ),
    //     [refetchCurrent, isDark]
    // );

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Current Data',
                    headerStyle: {
                        backgroundColor: isDark ? '#2e2e3b' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                    // headerRight,
                    headerBackTitle: 'Home',
                }}
            />
            <ScrollView
                className="h-full bg-defaultbackground dark:bg-defaultdarkbackground"
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => {}}
                        tintColor={isDark ? 'white' : 'black'}
                    />
                }>
                {/* — Title — */}
                <View>
                    <Text className="mt-7 text-center text-2xl font-bold dark:text-white">
                        Choate Pond Data
                    </Text>
                </View>

                {/* {waterError && (
                    <View>
                        <Text className="text-center text-xl font-bold dark:text-white">
                            {waterError.message}
                        </Text>
                    </View>
                )} */}

                <View>
                    <CustomDropdown
                        label="Location"
                        options={locationOptions}
                        value={selectedLocationLocalValue}
                        onSelect={onLocationSelect}
                    />
                </View>

                {/* — The 6 Widgets — */}
                {lastDataPoint && (
                    <View className="flex flex-row flex-wrap">
                        <Widget name="Water Temperature" value={lastDataPoint.temp} />
                        <Widget name="Conductivity" value={lastDataPoint.cond} />
                        <Widget name="Salinity" value={lastDataPoint.sal} />
                        <Widget name="pH" value={lastDataPoint.pH} />
                        <Widget name="Turbidity" value={lastDataPoint.turb} />
                        <Widget name="Oxygen" value={lastDataPoint.do} />
                        <Widget name="Tide" value={lastDataPoint.tide} />
                    </View>
                )}
            </ScrollView>
        </>
    );
}
