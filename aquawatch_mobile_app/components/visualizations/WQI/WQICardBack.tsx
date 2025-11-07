import { Pressable, ScrollView, Text, View } from 'react-native';

import LinkComp from '@/components/LinkComp';

export function WQICardBack({ flipCard }: { flipCard?: () => void }) {
    return (
        <View className="h-[250]">
            <ScrollView className="h-full rounded-3xl bg-white p-4 dark:bg-gray-700">
                <Pressable onPress={flipCard}>
                    <Text className="text-lg font-semibold dark:text-white">What is WQI?</Text>
                    <Text className="text-md dark:text-gray-300">
                        Water Quality Index (WQI) is a single, comprehensive score that summarizes
                        overall water quality. The score ranges from 0 to 100.
                    </Text>

                    <Text className="text-lg font-semibold dark:text-white">Methodology</Text>
                    <Text className="text-md dark:text-gray-300">
                        The WQI for Choate Pond is calculated from temperature, dissolved oxygen,
                        pH, turbidity, and salinity. Each parameter is multiplied by an assigned
                        weight, and the weighted values are summed.
                    </Text>

                    <Text className="text-lg font-semibold dark:text-white">References</Text>
                    <LinkComp
                        url="https://bluecolab.pace.edu/water-quality-index-dashboard-2/"
                        label="Learn More"
                    />
                    <Text />
                </Pressable>
            </ScrollView>
        </View>
    );
}
