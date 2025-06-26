import { handleLinkPress } from '@/components/LinkComp';
import { useIsDark } from '@/contexts/ColorSchemeContext';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

interface LinkCompProps {
    url: string;
    label: string;
}

// Link Component that uses Tailwind classes and dark mode
const LinkComp = ({ url, label }: LinkCompProps) => (
    <Text
        onPress={() => handleLinkPress(url)}
        className="text-blue-400 underline dark:text-blue-300">
        {label}
    </Text>
);

export default function VersionHistory() {
    const { isDark } = useIsDark();
    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Attributions',
                    headerStyle: {
                        backgroundColor: isDark ? '#2e2e3b' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                }}
            />
            <ScrollView className="bg-defaultbackground p-default dark:bg-defaultdarkbackground">
                {/* Version 0.9 */}
                <View className="m-default rounded-3xl  bg-white p-default dark:bg-gray-700">
                    <Text className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        v0.9 - The Beginning
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                        December 11, 2023
                    </Text>
                    <LinkComp
                        url="https://github.com/esorbella/BlueColab_MobileDataViz/tree/0b25304ff3fbbc92f1d83ebf258fb7dfeb3c8c2b"
                        label="Last commit: 0b25304"
                    />
                    <Text className="mt-2 text-gray-700 dark:text-gray-300">
                        The first version of the AquaWatch Mobile App (aka Choate Visual, Turbidity
                        App during development). Developed by Blue Jelly for CS 389 (Software
                        Engineering) at Pace University. The team developed the foundation for the
                        current app, with the following features:
                    </Text>
                    <View className="mt-4">
                        <Text className="font-semibold text-gray-800 dark:text-gray-200">
                            Features:
                        </Text>
                        <Text className="text-gray-700 dark:text-gray-300">
                            - A Landing Page with Quotes Related to Water
                        </Text>
                        <Text className="text-gray-700 dark:text-gray-300">- Our Story Page</Text>
                        <Text className="text-gray-700 dark:text-gray-300">
                            - Historic Data of Choate Pond, Poughkeepsie, West Point, Yonkers
                        </Text>
                        <Text className="text-gray-700 dark:text-gray-300">
                            - Local Wildlife Info
                        </Text>
                        <Text className="text-gray-700 dark:text-gray-300">
                            - Weather Summaries
                        </Text>
                        <Text className="text-gray-700 dark:text-gray-300">- Blogs</Text>
                        <Text className="text-gray-700 dark:text-gray-300">
                            - AI Plant Identification
                        </Text>
                    </View>
                </View>

                {/* Version 1.0 - 1.1.1 */}
                <View className="m-default rounded-3xl  bg-white p-default dark:bg-gray-700">
                    <Text className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        v1.0-1.1.1 - A New UI
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">May 9, 2024</Text>
                    <LinkComp
                        url="https://github.com/bluecolab/BlueColab_MobileDataViz/tree/b6196bb7141d818857023128ae0b171234da281b"
                        label="Last commit: b6196bb"
                    />
                    <Text className="mt-2 text-gray-700 dark:text-gray-300">
                        This update revamped the UI, mainly introducing new card designs and a new
                        tab navigation menu. We also switched from R to Python for the backend - for
                        maintainability. This was also the first version of the app to become
                        available to testers on the Google Play Store.
                    </Text>
                    <View className="mt-4">
                        <Text className="font-semibold text-gray-800 dark:text-gray-200">
                            Changes:
                        </Text>
                        <Text className="text-gray-700 dark:text-gray-300">
                            - Removed AI Plant Identification
                        </Text>
                        <Text className="text-gray-700 dark:text-gray-300">
                            - Revamped UI and Codebase for ease of use
                        </Text>
                        <Text className="text-gray-700 dark:text-gray-300">
                            - Data Visualizations were moved from R to Python
                        </Text>
                    </View>
                </View>

                {/* Version 1.2 */}
                <View className="m-default rounded-3xl  bg-white p-default dark:bg-gray-700">
                    <Text className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        v1.2 - Air Quality Index Added
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                        December 9, 2024
                    </Text>
                    <LinkComp
                        url="https://github.com/bluecolab/BlueColab_MobileDataViz/tree/1522c00bf7939d1217ff029c0f88a3d652751407"
                        label="Last commit: 1522c00"
                    />
                    <Text className="mt-2 text-gray-700 dark:text-gray-300">
                        The Blue Shield team worked to add Air Quality Index (AQI) to the app.
                    </Text>
                    <Text className="mt-2 text-gray-700 dark:text-gray-300">
                        - Added AQI for selectable locations
                    </Text>
                </View>

                {/* Version 1.3-1.3.1 */}
                <View className="m-default rounded-3xl  bg-white p-default dark:bg-gray-700">
                    <Text className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        v1.3-v1.3.1 - A Move to Sustainability
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                        February 12, 2025
                    </Text>
                    <LinkComp
                        url="https://github.com/bluecolab/BlueColab_MobileDataViz/tree/e819ba51186af88e1319dcc72d0c145e708decdb"
                        label="Last commit: e819ba5"
                    />
                    <Text className="mt-2 text-gray-700 dark:text-gray-300">
                        Our previous versions of the app focused on having a working demo, "just
                        make it work" thinking. However, we want to be an example of sustainability
                        in a water quality app.
                    </Text>
                    <Text className="mt-2 text-gray-700 dark:text-gray-300">
                        - New Historic Data Graphs built with Victory Graphs
                    </Text>
                    <Text className="mt-2 text-gray-700 dark:text-gray-300">
                        - Only month is selectable
                    </Text>
                </View>

                {/* Version 1.4 */}
                <View className="m-default rounded-3xl  bg-white p-default dark:bg-gray-700">
                    <Text className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        v1.4 - Hudson River Data
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                        February 27, 2025
                    </Text>
                    <LinkComp
                        url="https://github.com/bluecolab/BlueColab_MobileDataViz/tree/48cf527279d9a8da49cfa569dc845eb4e53214be"
                        label="Last commit: 48cf527"
                    />
                    <Text className="mt-2 text-gray-700 dark:text-gray-300">
                        - Added Hudson River Data support
                    </Text>
                </View>

                {/* Version 1.5 */}
                <View className="m-default rounded-3xl  bg-white p-default dark:bg-gray-700">
                    <Text className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        v1.5 - New Home Page
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">March 15, 2025</Text>
                    <LinkComp
                        url="https://github.com/bluecolab/BlueColab_MobileDataViz/tree/32999529f4c7baf1ffc42b2d11b74829aad992cf"
                        label="Last commit: 3299952"
                    />
                    <Text className="mt-2 text-gray-700 dark:text-gray-300">
                        - Revamped home page with current data
                    </Text>
                    <Text className="mt-2 text-gray-700 dark:text-gray-300">
                        - New look to home page
                    </Text>
                    <Text className="mt-2 text-gray-700 dark:text-gray-300">
                        - Start of current data page
                    </Text>
                </View>

                <View className="m-default rounded-3xl  bg-white p-default dark:bg-gray-700">
                    <Text className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        v1.6 - What's in your water?
                    </Text>
                    <LinkComp
                        url="https://github.com/bluecolab/BlueColab_MobileDataViz/tree/d9400afbd9a0c376073d65ff3232474f096d9d82"
                        label="Last commit: d9400af"
                    />
                    <Text className="text-sm text-gray-500 dark:text-gray-400">May 9, 2025</Text>

                    <Text className="mt-2 text-gray-700 dark:text-gray-300">
                        - Current data page fully implemented
                    </Text>
                </View>

                <View className="m-default rounded-3xl  bg-white p-default dark:bg-gray-700">
                    <Text className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        v1.7-v1.8.1 - Typescript Time
                    </Text>
                    <LinkComp
                        url="https://github.com/bluecolab/BlueColab_MobileDataViz/tree/d9400afbd9a0c376073d65ff3232474f096d9d82"
                        label="Last commit: d9400af"
                    />
                    <Text className="text-sm text-gray-500 dark:text-gray-400">June 25, 2025</Text>

                    <Text className="mt-2 text-gray-700 dark:text-gray-300">
                        - App fully moved to Typescript - minor visual changes
                        - Why is it 1.8 also? Because I can't count.
                    </Text>
                </View>

                <View className="pb-[90]"></View>
            </ScrollView>
        </>
    );
}
