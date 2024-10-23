import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    RefreshControl,  
} from "react-native";
import styles from "../../styles";

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

const getAirQuality = async (latitude, longitude) => {
    const apiKey = '4fd184c24fcacbb3bdf4ffcfb79ed8b9';  
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching air quality data:', error);
    }
};

const AirQuality = () => {
    const [airQualityData, setAirQualityData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);  // State for refreshing

    useEffect(() => {
        fetchAirQualityData();  // Fetch data on initial load
    }, []);

    const fetchAirQualityData = async () => {
        setRefreshing(true);  // Show loading indicator when fetching starts
        const latitude = 40.7128;  // Example latitude
        const longitude = -74.0060;  // Example longitude

        const data = await getAirQuality(latitude, longitude);
        if (data) {
            setAirQualityData(data);
        }
        setRefreshing(false);  // Hide loading when data is fetched
    };

    // Function to handle the pull-to-refresh event
    const onRefresh = () => {
        fetchAirQualityData();  // Refresh data when user pulls down
    };

     // Function to get the color based on AQI rating
     const getAQIColor = (aqi) => {
        switch (aqi) {
            case 1:
                return '#00e400';  // Green for 'Good'
            case 2:
                return '#ffff00';  // Yellow for 'Fair'
            case 3:
                return '#ff7e00';  // Orange for 'Moderate'
            case 4:
                return '#ff0000';  // Red for 'Poor'
            case 5:
                return '#8f3f97';  // Purple for 'Very Poor'
            default:
                return '#ffffff';  // White as a fallback
        }
    };

    return (
        <ScrollView 
            contentContainerStyle={styles.airQualityContainer}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}  // Show the indicator when refreshing
                    onRefresh={onRefresh}  // Pull-to-refresh action
                />
            }
        >
            <Text style={styles.airQualityHeader}>Air Quality at Pace University</Text>
            {airQualityData ? (
                <View style={styles.airQualityInfo}>
                <Text 
                    style={[
                        styles.airQualityText, 
                        { backgroundColor: getAQIColor(airQualityData.list[0].main.aqi) }  // Dynamically change AQI background color
                    ]}
                >
                    AQI: {airQualityData.list[0].main.aqi}
                </Text>
                <Text style={styles.airQualityText}>CO: {airQualityData.list[0].components.co} µg/m³</Text>
                <Text style={styles.airQualityText}>NO: {airQualityData.list[0].components.no} µg/m³</Text>
                <Text style={styles.airQualityText}>NO2: {airQualityData.list[0].components.no2} µg/m³</Text>
                <Text style={styles.airQualityText}>O3: {airQualityData.list[0].components.o3} µg/m³</Text>
                <Text style={styles.airQualityText}>PM2.5: {airQualityData.list[0].components.pm2_5} µg/m³</Text>
                <Text style={styles.airQualityText}>PM10: {airQualityData.list[0].components.pm10} µg/m³</Text>
                <Text style={styles.airQualityText}>SO2: {airQualityData.list[0].components.so2} µg/m³</Text>
            </View>
            ) : (
                <Text style={styles.loadingText}>Loading air quality data...</Text>
            )}
            {/* Loading indicator when fetching data */}
            {loading && (
                <ActivityIndicator size="large" color="#007BFF" style={styles.loadingIndicator} />
            )}
        </ScrollView>
    );
};

export default AirQuality;
