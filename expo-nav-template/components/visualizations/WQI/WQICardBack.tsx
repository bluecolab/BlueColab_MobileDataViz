import { ScrollView, Text } from 'react-native';

import LinkComp from '@/components/LinkComp';

export function WQICardBack() {
    return (
        <ScrollView className="h-full rounded-3xl bg-white p-4 dark:bg-gray-700">
            <Text className="text-lg font-semibold dark:text-white">What is WQI?</Text>
            <Text className="text-md dark:text-gray-300">
                WQI - water quality index - is a score that expresses the overall quality of water.
                It serves as a single, comprehensive indicator of the quality of water. The score
                ranges from 0 to 100.
            </Text>

            <Text className="text-lg font-semibold dark:text-white">Methodology</Text>
            <Text className="text-md dark:text-gray-300">
                The WQI for Choate Pond is calculated based on temperature, dissolved oxygen, pH,
                turbidity, and salinity. We then multiply each parameter by an assigned weight.
                Finally the product of each calculation is summed.
            </Text>

            <Text className="text-lg font-semibold dark:text-white">References</Text>
            <LinkComp
                url="https://bluecolab.pace.edu/water-quality-index-dashboard-2/"
                label="Learn More"
            />
            <Text />
        </ScrollView>
    );
}
