import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { handleLinkPress } from '@/components/LinkComp';
import { useColorScheme } from '@/contexts/ColorSchemeContext';

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
    const { isDark } = useColorScheme();
    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Version History',
                    headerStyle: {
                        backgroundColor: isDark ? '#2C2C2E' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                }}
            />
            <ScrollView className="bg-lightBackground p-default dark:bg-darkBackground">
                {/* Version 0.9 */}
                <View className="m-default rounded-3xl bg-white p-default dark:bg-darkCardBackground">
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
                <View className="m-default rounded-3xl  bg-white p-default dark:bg-darkCardBackground">
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
                <View className="m-default rounded-3xl  bg-white p-default dark:bg-darkCardBackground">
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
                <View className="m-default rounded-3xl  bg-white p-default dark:bg-darkCardBackground">
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
                <View className="m-default rounded-3xl  bg-white p-default dark:bg-darkCardBackground">
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
                <View className="m-default rounded-3xl  bg-white p-default dark:bg-darkCardBackground">
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

                <View className="m-default rounded-3xl  bg-white p-default dark:bg-darkCardBackground">
                    <Text className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        v1.6 - What's in your water?
                    </Text>
                    <LinkComp
                        url="https://github.com/bluecolab/BlueColab_MobileDataViz/tree/d9400afbd9a0c376073d65ff3232474f096d9d82"
                        label="Last commit: d9400af"
                    />
                    <Text className="text-sm text-gray-500 dark:text-gray-400">May 9, 2025</Text>

                    <Text className="mt-2 text-gray-700 dark:text-gray-300">
                        - Current data page fully implemented - Expo 53 Migration
                    </Text>
                </View>

                <View className="m-default rounded-3xl  bg-white p-default dark:bg-darkCardBackground">
                    <Text className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        v1.7 - Typescript Time
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">June 10, 2025</Text>

                    <LinkComp
                        url="https://github.com/bluecolab/BlueColab_MobileDataViz/commit/1206598a1e115f7451ebaf204d08b1cc3defd982"
                        label="Last commit: 1206598"
                    />

                    <Text className="mt-2 text-gray-700 dark:text-gray-300">
                        - App fully moved to Typescript - minor visual changes
                    </Text>
                </View>

                <View className="m-default rounded-3xl  bg-white p-default dark:bg-darkCardBackground">
                    <Text className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        v1.8 - Summer 2025 Updates
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">July 2, 2025</Text>

                    <LinkComp
                        url="https://github.com/bluecolab/BlueColab_MobileDataViz/tree/02d4c4b9ad218c3e9fbf39c174725e84b0a471ca"
                        label="Last commit: 02d4c4b"
                    />

                    <Text className="mt-2 text-gray-700 dark:text-gray-300">
                        These releases mainly focused fixing bugs and improving error handling. Many
                        non-user facing changes have been made as well.
                    </Text>

                    <Text className="mt-2 text-gray-700 dark:text-gray-300">- v1.8.0</Text>

                    <Text className="ml-3 dark:text-gray-300">
                        - No changes, just a version bump for summer changes
                    </Text>

                    <Text className="mt-2 text-gray-700 dark:text-gray-300">- v1.8.1:</Text>

                    <Text className="ml-3 dark:text-gray-300">
                        - Expo 53 Migration Patches (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/124"
                            label="#124"
                        />{' '}
                        by Victor Lima)
                    </Text>
                    <Text className="ml-3 dark:text-gray-300">
                        - Fix CssInterop upgrade warning (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/122"
                            label="#122"
                        />{' '}
                        by Victor Lima)
                    </Text>
                    <Text className="ml-3 dark:text-gray-300">
                        - Fix dark mode support missing in graphs (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/119"
                            label="#119"
                        />{' '}
                        by Kenji)
                    </Text>
                    <Text className="ml-3 dark:text-gray-300">
                        - Package updates and security updates (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/111"
                            label="#111"
                        />{' '}
                        by Kenji)
                    </Text>

                    <Text className="mt-2 text-gray-700 dark:text-gray-300">- v1.8.2:</Text>

                    <Text className="ml-3 dark:text-gray-300">
                        - Fixed month selection issues (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/141"
                            label="#141"
                        />{' '}
                        by Victor Lima)
                    </Text>

                    <Text className="mt-2 text-gray-700 dark:text-gray-300">- v1.8.3:</Text>

                    <Text className="ml-3 dark:text-gray-300">
                        - Fix axis not showing in first render of graphs (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/164"
                            label="#164"
                        />{' '}
                        by Kenji)
                    </Text>

                    <Text className="ml-3 dark:text-gray-300">
                        - Security fixes (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/161"
                            label="#161"
                        />{' '}
                        by dependabot &amp;
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/163"
                            label="#163"
                        />{' '}
                        by Kenji )
                    </Text>

                    <Text className="mt-2 text-gray-700 dark:text-gray-300">- v1.8.4:</Text>

                    <Text className="ml-3 dark:text-gray-300">
                        - Fix compatibility issues causing app crash (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/167"
                            label="#167"
                        />{' '}
                        by Kenji)
                    </Text>

                    <Text className="ml-3 dark:text-gray-300">
                        - Security fixes (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/168"
                            label="#168"
                        />{' '}
                        by dependabot)
                    </Text>

                    <Text className="mt-2 text-gray-700 dark:text-gray-300">- v1.8.5:</Text>

                    <Text className="ml-3 dark:text-gray-300">
                        - Fix app crashing in Air Quality Screen (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/179"
                            label="#179"
                        />{' '}
                        by Kenji)
                    </Text>

                    <Text className="mt-2 text-gray-700 dark:text-gray-300">- v1.8.6:</Text>

                    <Text className="ml-3 dark:text-gray-300">
                        - Improved state handling (loading indicator, clearer loading messages) (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/182"
                            label="#182"
                        />{' '}
                        by Kenji)
                    </Text>

                    <Text className="mt-2 text-gray-700 dark:text-gray-300">- v1.8.7:</Text>

                    <Text className="ml-3 dark:text-gray-300">
                        - Fix bug causing tab to display Home (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/200"
                            label="#200"
                        />{' '}
                        by Kenji)
                    </Text>
                </View>

                <View className="m-default rounded-3xl  bg-white p-default dark:bg-darkCardBackground">
                    <Text className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        v1.9 - Fall 2025 Updates
                    </Text>

                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                        September 12, 2025
                    </Text>

                    <Text className="mt-2 text-gray-700 dark:text-gray-300">- v1.9.0:</Text>

                    <Text className="ml-3 dark:text-gray-300">
                        - Dropdowns/option selecting are redesigned and other internal updates (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/194"
                            label="#194"
                        />{' '}
                        by Kenji)
                    </Text>

                    <Text className="mt-2 text-gray-700 dark:text-gray-300">- v1.9.1:</Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Update packages to latest, including nativewind (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/222"
                            label="#222"
                        />{' '}
                        by @OkuraKenG)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Upgrade Node Versions (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/224"
                            label="#224"
                        />{' '}
                        by @tylercyeung)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Long lat closest location (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/225"
                            label="#225"
                        />{' '}
                        by @iTsThermo)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Neutralize expo-doctor warnings: Reduce redundant logs (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/229"
                            label="#229"
                        />{' '}
                        by @OkuraKenG)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Unit Conversions (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/228"
                            label="#228"
                        />{' '}
                        by @tylercyeung)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Move graph to its own component (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/232"
                            label="#232"
                        />{' '}
                        by @tylercyeung)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Experimental changes to prevent supply chain attacks (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/233"
                            label="#233"
                        />{' '}
                        by @OkuraKenG)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - byewildlife:( (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/238"
                            label="#238"
                        />{' '}
                        by @liziimedo)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Add validate-package-lock.json check to prod build (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/239"
                            label="#239"
                        />{' '}
                        by @tylercyeung)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Update credits; screenshots (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/231"
                            label="#231"
                        />{' '}
                        by @KoJesko)
                    </Text>

                    <Text className="mt-2 text-gray-700 dark:text-gray-300">- v1.9.2:</Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Removed unneeded patch package library (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/241"
                            label="#241"
                        />{' '}
                        by @tylercyeung)
                    </Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - General UI Improvement (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/236"
                            label="#236"
                        />{' '}
                        by @OkuraKenG)
                    </Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Hudson River Remove WQI from Current Data (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/243"
                            label="#243"
                        />{' '}
                        by @Copilot/Ari)
                    </Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Add OpenWeatherMap API URL to centralized config (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/244"
                            label="#244"
                        />{' '}
                        by @Copilot/Ari)
                    </Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Updated to handle react query (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/237"
                            label="#237"
                        />{' '}
                        by @iTsThermo)
                    </Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Add Odin data (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/237"
                            label="#237"
                        />{' '}
                        by @iTsThermo)
                    </Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Add Odin data (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/237"
                            label="#237"
                        />{' '}
                        by @iTsThermo)
                    </Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Bug: Selecting the current month in historic data page has weird result (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/246"
                            label="#246"
                        />{' '}
                        by @tylercyeung)
                    </Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Make PolarChart it's own component (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/247"
                            label="#247"
                        />{' '}
                        by @ZVictorLima)
                    </Text>

                    <Text className="mt-2 text-gray-700 dark:text-gray-300">- v1.9.3:</Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Replaced TouchableOpacity/TouchableWithoutFeedback with Pressable (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/252"
                            label="#252"
                        />{' '}
                        by @ZVictorLima)
                    </Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Odin data on behalf of Vansh (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/255"
                            label="#255"
                        />{' '}
                        by @iTsThermo)
                    </Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - AWM-55 - Add ability to refresh data on command (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/253"
                            label="#253"
                        />{' '}
                        by @tylercyeung)
                    </Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - AWM-21 - Refactor AQI Page (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/257"
                            label="#257"
                        />{' '}
                        by @OkuraKenG)
                    </Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - AWM-67 - Normalize units (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/254"
                            label="#254"
                        />{' '}
                        by @tylercyeung)
                    </Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - add water reports (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/258"
                            label="#258"
                        />{' '}
                        by @liziimedo)
                    </Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Use refresh logo instead of text; disable normalize by default (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/259"
                            label="#259"
                        />{' '}
                        by @OkuraKenG)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - AWM-95 - Add comparison graph: Salinity vs Conductivity in Historic Data
                    </Text>

                    <Text className="mt-2 text-gray-700 dark:text-gray-300">- v1.9.4:</Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Enhance generateDataSummary with additional data processing (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/261"
                            label="#261"
                        />{' '}
                        by @KoJesko)
                    </Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - AWM-90 - Fall 2025 Midterm Suggestions (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/268"
                            label="#268"
                        />{' '}
                        by @tylercyeung)
                    </Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - AWM-91 - Fix attribution layout on small screens and sync package list (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/270"
                            label="#270"
                        />{' '}
                        by @Copilot/KoJesko)
                    </Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Remove portrait orientation lock for tablet support (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/271"
                            label="#271"
                        />{' '}
                        by @Copilot/KoJesko)
                    </Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - AWM-95 - Add the ability to compare salinity and conductivity (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/279"
                            label="#279"
                        />{' '}
                        by @tylercyeung)
                    </Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - AWM-14 - Add animations when navigating between tabs (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/280"
                            label="#280"
                        />{' '}
                        by @tylercyeung)
                    </Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - AWM-93 - Automate Apple build (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/281"
                            label="#281"
                        />{' '}
                        by @OkuraKenG)
                    </Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - AWM-92 - Implement location based water quality (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/282"
                            label="#282"
                        />{' '}
                        by @iTsThermo)
                    </Text>

                    <Text className="mt-2 text-gray-700 dark:text-gray-300">- v1.9.5:</Text>

                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Update privacy policy (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/286"
                            label="#286"
                        />{' '}
                        by @OkuraKenG)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Update copyright holder in LICENSE file (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/289"
                            label="#289"
                        />{' '}
                        by @OkuraKenG)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Created a hardcoded safe and not safe label for water report (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/295"
                            label="#295"
                        />{' '}
                        by @iTsThermo)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - AWM-0030 - Add support to historic data to compare different
                        locations/months (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/297"
                            label="#297"
                        />{' '}
                        by @tylercyeung)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Security Updates (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/300"
                            label="#300"
                        />{' '}
                        by @OkuraKenG)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Fixed bug causing NYC data to be unreachable (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/304"
                            label="#304"
                        />{' '}
                        by @OkuraKenG)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Bump glob from 10.4.5 to 10.5.0 in /aquawatch_mobile_app (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/305"
                            label="#305"
                        />{' '}
                        by @dependabot[bot])
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Add back conductivity (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/306"
                            label="#306"
                        />{' '}
                        by @OkuraKenG)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - AWM-0097: Add tide data support to Hudson River locations with timestamp
                        normalization (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/299"
                            label="#299"
                        />{' '}
                        by @Copilot)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Added functionality for closest station water quality (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/307"
                            label="#307"
                        />{' '}
                        by @iTsThermo)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - npm audit fix (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/309"
                            label="#309"
                        />{' '}
                        by @OkuraKenG)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Water report cleanup (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/308"
                            label="#308"
                        />{' '}
                        by @liziimedo)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Removed console logs and small ui change (for @iTsThermo ) (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/310"
                            label="#310"
                        />{' '}
                        by @OkuraKenG)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - AWM-102-103 - Water reports via the API (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/311"
                            label="#311"
                        />{' '}
                        by @OkuraKenG)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Awm 0104 add story of where pace water comes from to app (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/316"
                            label="#316"
                        />{' '}
                        by @iTsThermo)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - AWM-0107 - Cronin UI Attempt 2 [Do not merge yet] (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/313"
                            label="#313"
                        />{' '}
                        by @OkuraKenG)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - AWM-0110 - Fix open weather API to get US AQI (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/321"
                            label="#321"
                        />{' '}
                        by @Copilot)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - AWM-0115 - Add PurpleAir widgets to app (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/324"
                            label="#324"
                        />{' '}
                        by @OkuraKenG)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - Update packages to latest (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/322"
                            label="#322"
                        />{' '}
                        by @OkuraKenG)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - AWM-0116-0080 - Re-architecture to support Cronin UI (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/327"
                            label="#327"
                        />{' '}
                        by @OkuraKenG)
                    </Text>
                    <Text className="ml-3 text-gray-700 dark:text-gray-300">
                        - AWM-0117 - Add back Historic Data (
                        <LinkComp
                            url="https://github.com/bluecolab/BlueColab_MobileDataViz/pull/329"
                            label="#329"
                        />{' '}
                        by @OkuraKenG)
                    </Text>
                </View>

                <View className="pb-[90]"></View>
            </ScrollView>
        </>
    );
}
