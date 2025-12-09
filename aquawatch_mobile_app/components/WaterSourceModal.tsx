import React from 'react';
import { Modal, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface WaterSourceModalProps {
    visible: boolean;
    onClose: () => void;
}

const WaterSourceModal: React.FC<WaterSourceModalProps> = ({ visible, onClose }) => {
    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View className="flex-1 justify-end bg-black/50">
                <SafeAreaView className="flex-1 items-center justify-center">
                    <View className="h-[85%] w-[90%] overflow-hidden rounded-2xl bg-white shadow-lg">
                        {/* Header with Title and Close Button */}
                        <View className="flex-row items-center justify-between bg-[#1c2b4b] px-4 py-3">
                            <Text className="flex-1 text-lg font-bold text-white">
                                Where your water is coming from
                            </Text>
                            <TouchableOpacity onPress={onClose} className="p-1">
                                <Text className="text-2xl font-bold text-white">✕</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Scrollable Content */}
                        <ScrollView
                            className="flex-1 dark:bg-defaultdarkbackground"
                            contentContainerStyle={{ paddingBottom: 32 }}
                            showsVerticalScrollIndicator={false}>
                            {/* Animated GIF */}
                            <View className="mb-2 h-[475px] w-full dark:bg-defaultdarkbackground">
                                <Image
                                    source={require('@/assets/homescreen/Pace-PLV-water-animated-1.png')}
                                    className="h-full w-full"
                                    resizeMode="contain"
                                />
                            </View>

                            {/* Summarized Content */}
                            <View className="p-5 dark:bg-defaultdarkbackground">
                                <Text className="mb-2 text-2xl font-bold text-[#1c2b4b] dark:text-white">
                                    Pace Pleasantville Drinking Water
                                </Text>
                                <Text className="mb-2 text-base text-gray-700 dark:text-white">
                                    This guide provides an overview of our campus water sources,
                                    quality regulations, and safety reports.
                                </Text>

                                <Text className="mb-1 mt-4 text-lg font-semibold text-gray-800 dark:text-white">
                                    Where does it come from?
                                </Text>
                                <Text className="mb-2 text-base text-gray-700 dark:text-white">
                                    <Text className="font-bold text-black dark:text-white">
                                        Primary Source:{' '}
                                    </Text>
                                    Pace Pleasantville water originates 91 miles away in the{' '}
                                    <Text className="font-bold text-black dark:text-white">
                                        Ashokan Reservoir
                                    </Text>{' '}
                                    (Catskill Mountains). It flows through deep underground
                                    aqueducts beneath the Hudson River before reaching our campus.
                                </Text>
                                <Text className="mb-2 text-base text-gray-700 dark:text-white">
                                    <Text className="font-bold text-black dark:text-white">
                                        Secondary Source:{' '}
                                    </Text>
                                    The{' '}
                                    <Text className="font-bold text-black dark:text-white">
                                        Croton Reservoir
                                    </Text>
                                    , located just 12 miles away, serves as a backup source during
                                    emergencies or maintenance.
                                </Text>

                                <Text className="mb-1 mt-4 text-lg font-semibold text-gray-800 dark:text-white">
                                    Safety & Compliance
                                </Text>
                                <Text className="mb-2 text-base text-gray-700 dark:text-white">
                                    Pace operates as a classified "community water system." We
                                    strictly adhere to the Federal Safe Drinking Water Act and the
                                    NY State Sanitary Code.
                                </Text>
                                <Text className="mb-2 text-base text-gray-700 dark:text-white">
                                    Annual Water Quality Reports are issued every May 31st,
                                    detailing testing results for the previous year to ensure
                                    transparency and safety.
                                </Text>
                            </View>
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
};

export default WaterSourceModal;
