// app/(tabs)/home/waterReport.tsx
import { Stack } from 'expo-router';
import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Modal,
} from 'react-native';

import { useColorScheme } from '@/contexts/ColorSchemeContext';

import WaterReportAPI from './waterReportAPI';

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

    // Water reports data - sorted with newest first (2024 on top)
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

    // Styles inside component so they can access isDark
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#1a202c' : 'rgb(220, 220, 220)',
            width: deviceWidth,
        },
        headerText: {
            color: isDark ? 'white' : '#333',
            fontSize: deviceHeight / 30,
            textAlign: 'center',
            marginVertical: 20,
            fontWeight: 'bold',
        },
        listContainer: {
            paddingHorizontal: 15,
            paddingBottom: 20,
        },
        reportCard: {
            backgroundColor: isDark ? '#374151' : '#fff',
            borderRadius: 15,
            marginBottom: 15,
            padding: 15,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
        },
        latestReportCard: {
            backgroundColor: isDark ? '#4A6D7C' : '#E3F2FD',
            borderWidth: 2,
            borderColor: '#7CB9E8',
        },
        thumbnailContainer: {
            width: 80,
            height: 100,
            marginRight: 15,
            justifyContent: 'center',
            alignItems: 'center',
        },
        pdfIconContainer: {
            width: '100%',
            height: '100%',
            backgroundColor: isDark ? '#3A5D6C' : '#B3D9E8',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        pdfIcon: {
            fontSize: 40,
        },
        reportInfo: {
            flex: 1,
        },
        reportHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 5,
        },
        reportYear: {
            color: isDark ? '#7CB9E8' : '#1976D2',
            fontSize: deviceHeight / 35,
            fontWeight: 'bold',
            marginRight: 10,
        },
        latestBadge: {
            backgroundColor: '#FFD700',
            color: '#000',
            fontSize: 12,
            fontWeight: 'bold',
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 5,
        },
        reportTitle: {
            color: isDark ? 'white' : '#333',
            fontSize: deviceHeight / 45,
            lineHeight: 22,
        },
        // Modal styles
        modalContainer: {
            flex: 1,
            backgroundColor: isDark ? '#1a202c' : 'rgb(220, 220, 220)',
        },
        modalHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: isDark ? '#2e2e3b' : 'white',
            paddingHorizontal: 15,
            paddingVertical: 15,
            paddingTop: 50,
        },
        modalTitle: {
            color: isDark ? 'white' : '#333',
            fontSize: 18,
            fontWeight: 'bold',
            flex: 1,
            marginRight: 10,
        },
        closeButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: isDark ? '#4A6D7C' : '#1976D2',
            justifyContent: 'center',
            alignItems: 'center',
        },
        closeButtonText: {
            color: 'white',
            fontSize: 24,
            fontWeight: 'bold',
        },
        webview: {
            flex: 1,
            backgroundColor: isDark ? '#1a202c' : 'rgb(220, 220, 220)',
        },
    });

    const renderReportItem = ({ item, index }: { item: WaterReport; index: number }) => (
        <TouchableOpacity
            style={[styles.reportCard, index === 0 && styles.latestReportCard]}
            onPress={() => handleReportPress(item)}>
            <View style={styles.thumbnailContainer}>
                <View style={styles.pdfIconContainer}>
                    <Text style={styles.pdfIcon}>📄</Text>
                </View>
            </View>
            <View style={styles.reportInfo}>
                <View style={styles.reportHeader}>
                    <Text style={styles.reportYear}>{item.year}</Text>
                    {index === 0 && <Text style={styles.latestBadge}>LATEST</Text>}
                </View>
                <Text style={styles.reportTitle}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );

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
            <View style={styles.container}>
                <Text style={styles.headerText}>Annual Water Quality Reports</Text>
                <FlatList
                    data={waterReports}
                    renderItem={renderReportItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={true}
                />
            </View>

            {/* PDF Viewer Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={closeModal}
                presentationStyle="fullScreen">
                <View style={styles.modalContainer}>
                    {/* Modal Header */}
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle} numberOfLines={1}>
                            {selectedReport?.title}
                        </Text>
                        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* PDF Viewer using WebView */}
                    {selectedReport && (
                        <WaterReportAPI year={selectedReport.year} uri={selectedReport.uri} />
                    )}
                </View>
            </Modal>
        </>
    );
};

export default WaterReport;
