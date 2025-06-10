// /app/(tabs)/home/story.tsx
import { Stack } from 'expo-router';
import { View, Text, ScrollView, Image } from 'react-native';

import { useIsDark } from '@/contexts/ColorSchemeContext';

/**
 * @returns {JSX.Element}
 * @description This component displays the story of Blue CoLab, including its mission and approach to water contamination risks.
 */
export default function Story() {
    const { isDark } = useIsDark();
    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Our Story',
                    headerStyle: {
                        backgroundColor: isDark ? '#2e2e3b' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                }}
            />
            <ScrollView className="bg-gray-100 p-5 dark:bg-gray-900">
                {/* Title */}
                <Text className="mb-5 text-center text-2xl font-bold text-blue-800 dark:text-white">
                    At the Seidenberg School, we believe students can make a difference today,
                    before they launch their careers of tomorrow.
                </Text>

                {/* Top Image */}
                <Image
                    source={require('@/assets/StoryScreen/Three-labs-copy.jpg')}
                    className=" mb-4 h-[100px] w-full rounded-md"
                    resizeMode="cover"
                />

                {/* Content Sections */}
                <Text className="mb-2 text-lg font-bold dark:text-[#57ADBF]">
                    Do you know if your water is safe before you drink it?
                </Text>
                <Text className="mb-4 text-base text-gray-700 dark:text-white ">
                    Let us answer that for you: No. We aim to change that.
                </Text>

                <Text className="mb-4 text-base text-gray-700 dark:text-white ">
                    We are a team of students, interns, graduate assistants, faculty, and staff who
                    work to advance the technology, information, and warning systems that will bring
                    you that information.
                </Text>

                <Text className="mb-4 text-base text-gray-700 dark:text-white ">
                    At our technology lab overlooking the Hudson River, our Choate Pond lab on
                    campus, and our data lab in the Goldstein Academic Center, Blue CoLab is
                    dedicated to the proposition that you have the{' '}
                    <Text className="font-bold">right-to-know</Text> the quality of your water
                    before you drink it, swim in it, fish it, or even swamp your canoe.
                </Text>

                {/* Section Titles */}
                <Text className="mb-2 mt-5 text-xl font-semibold text-blue-800 dark:text-[#57ADBF] ">
                    Water Contamination Risks
                </Text>

                <Text className="mb-4 text-base text-gray-700 dark:text-white ">
                    Chances are the water you use is safe, but millions have found out too late that
                    is not the case. Just one sip of water contaminated with pathogens, such as
                    bacteria, viruses, or parasites, can cause severe illness in a matter of hours.
                    Yet, still today, a conventional lab requires 24 - 48 hours to report analyses
                    of samples that may only be taken weekly, or less.
                </Text>

                <Text className="mb-4 text-base text-gray-700 dark:text-white ">
                    In <Text className="font-bold">Milwaukee (1993)</Text>, 400,000 residents were
                    made ill and 100 died due to drinking water contaminated with cryptosporidium.
                    Residents in <Text className="font-bold">Hoosick Falls</Text> and{' '}
                    <Text className="font-bold">Newburgh, NY</Text> were exposed to highly toxic
                    PFAS and may have been for years without knowing it.
                </Text>

                <Text className="mb-4 text-base text-gray-700 dark:text-white ">
                    Water contamination is endemic across the planet, making hundreds of millions of
                    people ill, including tens of millions in the United States. The best defense
                    against this threat are innovations that enable{' '}
                    <Text className="font-bold">real-time</Text>, technological detection of water
                    contaminants before they can reach our taps or recreational waters.
                </Text>

                {/* Blue CoLab's Approach */}
                <Text className="mb-2 mt-5 text-xl font-semibold text-blue-800 dark:text-[#57ADBF] ">
                    Blue CoLab's Hands-On Approach
                </Text>

                <Text className="mb-4 text-base text-gray-700 dark:text-white ">
                    To advance these innovations, Blue CoLab is decidedly{' '}
                    <Text className="font-bold">“hands-on.”</Text> Our students dive into:
                </Text>

                <View className="mb-4 dark:text-white ">
                    <Text className="text-base text-gray-700 dark:text-white ">
                        • Operation of real-time sensors and instruments
                    </Text>
                    <Text className="text-base text-gray-700 dark:text-white ">
                        • Management, visualization, and sonification of data
                    </Text>
                    <Text className="text-base text-gray-700 dark:text-white ">
                        • UX, web, GIS, and app development
                    </Text>
                    <Text className="text-base text-gray-700 dark:text-white ">
                        • System cybersecurity
                    </Text>
                </View>

                <Text className="mb-4 text-base text-gray-700 dark:text-white ">
                    They work in a <Text className="font-bold">team-based environment</Text>, using
                    our own labs, instruments, equipment, and servers.
                </Text>

                <Text className="mb-4 text-base text-gray-700 dark:text-white ">
                    Blue CoLab stands for everything that makes the Seidenberg School a special
                    place — harnessing innovation on behalf of society, and providing students with
                    skill-based experiences that lead to a career meaningful to them, and to
                    society.
                </Text>

                {/* Closing Statement */}
                <Text className="mt-5 text-center text-lg italic text-gray-600 dark:text-white ">
                    "All of us at Blue CoLab look forward to seeing you on the team."
                </Text>
                <Text className="mb-20 pb-10 text-center text-lg italic text-gray-600 dark:text-white ">
                    — John Cronin, Blue CoLab Director
                </Text>
            </ScrollView>
        </>
    );
}
