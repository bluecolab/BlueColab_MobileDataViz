import React from 'react';
import { Modal, View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
interface WaterSourceModalProps {
    visible: boolean;
    onClose: () => void;
}

const WaterSourceModal: React.FC<WaterSourceModalProps> = ({ visible, onClose }) => {
    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.overlay}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.modalContainer}>
                        {/* Header with Title and Close Button */}
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>Where your water is coming from</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Scrollable Content */}
                        <ScrollView
                            style={styles.scrollView}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}>
                            {/* Animated GIF */}
                            <View style={styles.imageContainer}>
                                <Image
                                    source={require('@/assets/homescreen/Pace-PLV-water-animated-1.png')}
                                    style={styles.gifImage}
                                    resizeMode="contain"
                                />
                            </View>

                            {/* Summarized Content */}
                            <View style={styles.textContainer}>
                                <Text style={styles.sectionTitle}>
                                    Pace Pleasantville Drinking Water
                                </Text>
                                <Text style={styles.paragraph}>
                                    This guide provides an overview of our campus water sources,
                                    quality regulations, and safety reports.
                                </Text>

                                <Text style={styles.subHeader}>Where does it come from?</Text>
                                <Text style={styles.paragraph}>
                                    <Text style={styles.bold}>Primary Source: </Text>
                                    Pace Pleasantville water originates 91 miles away in the{' '}
                                    <Text style={styles.bold}>Ashokan Reservoir</Text> (Catskill
                                    Mountains). It flows through deep underground aqueducts beneath
                                    the Hudson River before reaching our campus.
                                </Text>
                                <Text style={styles.paragraph}>
                                    <Text style={styles.bold}>Secondary Source: </Text>
                                    The <Text style={styles.bold}>Croton Reservoir</Text>, located
                                    just 12 miles away, serves as a backup source during emergencies
                                    or maintenance.
                                </Text>

                                <Text style={styles.subHeader}>Safety & Compliance</Text>
                                <Text style={styles.paragraph}>
                                    Pace operates as a classified "community water system." We
                                    strictly adhere to the Federal Safe Drinking Water Act and the
                                    NY State Sanitary Code.
                                </Text>
                                <Text style={styles.paragraph}>
                                    Annual Water Quality Reports are issued every May 31st,
                                    detailing testing results for the previous year to ensure
                                    transparency and safety.
                                </Text>

                                <View style={styles.footerNote}>
                                    <Text style={styles.footerText}>
                                        Data provided by the Blue CoLab team.
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
        justifyContent: 'flex-end',
    },
    safeArea: {
        flex: 1,
        justifyContent: 'center', // Centers modal vertically
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        height: '85%', // Takes up 85% of screen height
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        overflow: 'hidden',
    },
    header: {
        backgroundColor: '#1c2b4b', // Matches the Pace/Navy Blue from video
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
        flex: 1,
    },
    closeButton: {
        padding: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 30,
    },
    imageContainer: {
        width: '100%',
        height: 475,
        backgroundColor: '#00000',
        marginBottom: 10,
    },
    gifImage: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1c2b4b',
        marginBottom: 10,
    },
    subHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 15,
        marginBottom: 5,
    },
    paragraph: {
        fontSize: 15,
        color: '#444',
        lineHeight: 22,
        marginBottom: 10,
    },
    bold: {
        fontWeight: 'bold',
        color: '#000',
    },
    footerNote: {
        marginTop: 20,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    footerText: {
        fontSize: 12,
        color: '#888',
        fontStyle: 'italic',
        textAlign: 'center',
    },
});

export default WaterSourceModal;
