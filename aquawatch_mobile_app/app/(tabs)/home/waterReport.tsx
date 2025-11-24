// app/(tabs)/home/waterReport.tsx

import { Stack } from 'expo-router';
import { useState } from 'react';
import { View, Text, Dimensions, FlatList, Pressable, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import { useColorScheme } from '@/contexts/ColorSchemeContext';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

interface WaterReport {
    id: string;
    year: string;
    title: string;
    uri: string;
}

const WaterReport = () => {
    const { isDark } = useColorScheme();

    const waterReports: WaterReport[] = [
        {
            id: '2024',
            year: '2024',
            title: 'Annual Water Quality Report for 2024',
            uri: 'https://raw.githubusercontent.com/bluecolab/react-kiosk/main/assets/waterReport/Annual-Water-Quality-Report-for-2024.pdf',
        },
        {
            id: '2023',
            year: '2023',
            title: 'Annual Water Quality Report for 2023',
            uri: 'https://raw.githubusercontent.com/bluecolab/react-kiosk/main/assets/waterReport/Annual-Water-Quality-Report-for-2023.pdf',
        },
        {
            id: '2022',
            year: '2022',
            title: 'Annual Water Quality Report for 2022',
            uri: 'https://raw.githubusercontent.com/bluecolab/react-kiosk/main/assets/waterReport/Annual-Water-Quality-Report-for-2022.pdf',
        },
        {
            id: '2021',
            year: '2021',
            title: 'Annual Water Quality Report for 2021',
            uri: 'https://raw.githubusercontent.com/bluecolab/react-kiosk/main/assets/waterReport/Annual-Water-Quality-Report-for-2021.pdf',
        },
        {
            id: '2020',
            year: '2020',
            title: 'Annual Water Quality Report for 2020',
            uri: 'https://raw.githubusercontent.com/bluecolab/react-kiosk/main/assets/waterReport/Annual-Water-Quality-Report-for-2020.pdf',
        },
        {
            id: '2019',
            year: '2019',
            title: 'Annual Water Quality Report for 2019',
            uri: 'https://raw.githubusercontent.com/bluecolab/react-kiosk/main/assets/waterReport/Annual-Water-Quality-Report-for-2019.pdf',
        },
        {
            id: '2018',
            year: '2018',
            title: 'Annual Water Quality Report for 2018',
            uri: 'https://raw.githubusercontent.com/bluecolab/react-kiosk/main/assets/waterReport/Annual-Water-Quality-Report-for-2018.pdf',
        },
        {
            id: '2017',
            year: '2017',
            title: 'Annual Water Quality Report for 2017',
            uri: 'https://raw.githubusercontent.com/bluecolab/react-kiosk/main/assets/waterReport/Annual-Water-Quality-Report-for-2017.pdf',
        },
    ];

    const [selectedReport, setSelectedReport] = useState<WaterReport | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const handleReportPress = (report: WaterReport) => {
        setSelectedReport(report);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedReport(null);
    };

    const renderReportItem = ({ item, index }: { item: WaterReport; index: number }) => {
        const latestCard = index === 0;

        return (
            <Pressable
                onPress={() => handleReportPress(item)}
                className={`
                    flex-row items-center p-4 rounded-xl mb-4 shadow
                    ${isDark ? "bg-gray-700" : "bg-white"}
                    ${latestCard ? (isDark ? "bg-[#4A6D7C] border-2 border-[#7CB9E8]" : "bg-[#E3F2FD] border-2 border-[#7CB9E8]") : ""}
                `}
            >
                <View className="w-20 h-24 mr-4 items-center justify-center">
                    <View
                        className={`
                            w-full h-full rounded-lg items-center justify-center 
                            ${isDark ? "bg-[#3A5D6C]" : "bg-[#B3D9E8]"}
                        `}
                    >
                        <Text className="text-4xl">📄</Text>
                    </View>
                </View>

                <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                        <Text
                            className={`
                                font-bold text-xl mr-2
                                ${isDark ? "text-[#7CB9E8]" : "text-[#1976D2]"}
                            `}
                        >
                            {item.year}
                        </Text>
                        {latestCard && (
                            <Text className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                                LATEST
                            </Text>
                        )}
                    </View>

                    <Text
                        className={`
                            text-base leading-6
                            ${isDark ? "text-white" : "text-gray-700"}
                        `}
                    >
                        {item.title}
                    </Text>
                </View>
            </Pressable>
        );
    };

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Water Report',
                    headerStyle: {
                        backgroundColor: isDark ? '#2e2e3b' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                }}
            />

            <View
                className={`
                    flex-1 w-full 
                    ${isDark ? "bg-[#1a202c]" : "bg-neutral-300"}
                `}
            >
                <Text
                    className={`
                        text-2xl font-bold text-center my-5
                        ${isDark ? "text-white" : "text-gray-800"}
                    `}
                >
                    Annual Water Quality Reports
                </Text>

                <FlatList
                    data={waterReports}
                    renderItem={renderReportItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}
                    showsVerticalScrollIndicator={true}
                />
            </View>

            {/* PDF Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={closeModal}
                presentationStyle="fullScreen"
            >
                <View
                    className={`
                        flex-1
                        ${isDark ? "bg-[#1a202c]" : "bg-neutral-300"}
                    `}
                >
                    <View
                        className={`
                            flex-row items-center justify-between 
                            px-4 py-4 pt-12
                            ${isDark ? "bg-[#2e2e3b]" : "bg-white"}
                        `}
                    >
                        <Text
                            numberOfLines={1}
                            className={`
                                flex-1 text-lg font-bold mr-4
                                ${isDark ? "text-white" : "text-gray-800"}
                            `}
                        >
                            {selectedReport?.title}
                        </Text>

                        <Pressable
                            onPress={closeModal}
                            className={`
                                w-10 h-10 rounded-full items-center justify-center
                                ${isDark ? "bg-[#4A6D7C]" : "bg-[#1976D2]"}
                            `}
                        >
                            <Text className="text-white text-2xl font-bold">✕</Text>
                        </Pressable>
                    </View>

                    {selectedReport && (
                        <WebView
                            source={{
                                uri: `https://docs.google.com/viewer?url=${encodeURIComponent(
                                    selectedReport.uri
                                )}&embedded=true`,
                            }}
                            className={`
                                flex-1 
                                ${isDark ? "bg-[#1a202c]" : "bg-neutral-300"}
                            `}
                            startInLoadingState={true}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                        />
                    )}
                </View>
            </Modal>
        </>
    );
};

export default WaterReport;
