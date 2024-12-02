/*
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

// Function to get the air quality data
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
        const latitude = 40.7128;  // Pace latitude
        const longitude = -74.0060;  // Pace longitude

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
                return '#CCCC00';  // Yellow for 'Fair'
            case 3:
                return '#ff7e00';  // Orange for 'Moderate'
            case 4:
                return '#ff0000';  // Red for 'Poor'
            case 5:
                return '#8f3f97';  // Purple for 'Very Poor'
            default:
                return '##4A6D7C';  // Uses this color as a fallback
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
            
            {loading && (
                <ActivityIndicator size="large" color="#007BFF" style={styles.loadingIndicator} />
            )}
        </ScrollView>
    );
};

export default AirQuality;
*/

import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from "react-native";
import styles from "../../styles";
import * as Location from "expo-location";
import RNPickerSelect from 'react-native-picker-select';
import { ReloadInstructions } from "react-native/Libraries/NewAppScreen";

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

// Function to get the air quality data
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
    const [location, setLocation] = useState({ latitude: 41.128380, longitude: -73.808189 }); // Default to Pace University
    const [selectedOption, setSelectedOption] = useState('currentLocation'); // Default selected option
    const [title, setTitle] = useState("Air Quality Data"); // Dynamic title

    useEffect(() => {
        fetchAirQualityData();  // Fetch data on initial load
    }, [location]);

    const fetchAirQualityData = async () => {
        setRefreshing(true);  // Show loading indicator when fetching starts

        const data = await getAirQuality(location.latitude, location.longitude);
        if (data) {
            setAirQualityData(data);
        }
        setRefreshing(false);  // Hide loading when data is fetched
    };

    const useCurrentLocation = async () => {
        setLoading(true);  // Show loading indicator when fetching location
    
        // Request permission to access location
        let { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
            setLoading(false);
            Alert.alert("Permission denied", "Location permission is required to fetch your current location.");
            console.log('Permission to access location was denied');
            return;
        }
    
        try {
            // Get the current location
            let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
            const { latitude, longitude } = location.coords;
            setLocation({ latitude, longitude });
        } catch (error) {
            Alert.alert("Error", "Could not fetch location. Please try again.");
            console.error("Error getting location:", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to get the air quality for Pace University
    const getPaceUniversityAirQuality = async () => {
        const paceCoordinates = { latitude: 41.128380, longitude: -73.808189 };
        setLoading(true);

        try {
            const data = await getAirQuality(paceCoordinates.latitude, paceCoordinates.longitude);
            if (data) {
                setAirQualityData(data);
            }
        } catch (error) {
            Alert.alert("Error", "Could not fetch air quality data for Pace University.");
            console.error("Error getting Pace University air quality:", error);
        } finally {
            setLoading(false);
        }
    };

    //Function to get the air quality for Pace University NYC Campus
    const getPaceUniversityNYCAirQuality = async () => {
        const nycCoordinates = { latitude: 40.711220, longitude: -74.006477 };
        setLoading(true);

        try {
            const data = await getAirQuality(nycCoordinates.latitude, nycCoordinates.longitude);
            if (data) {
                setAirQualityData(data);
            }
        } catch (error) {
            Alert.alert("Error", "Could not fetch air quality data for Pace University NYC Campus.");
            console.error("Error getting Pace University NYC air quality:", error);
        } finally {
            setLoading(false);
        }
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
                return '#CCCC00';  // Yellow for 'Fair'
            case 3:
                return '#ff7e00';  // Orange for 'Moderate'
            case 4:
                return '#ff0000';  // Red for 'Poor'
            case 5:
                return '#8f3f97';  // Purple for 'Very Poor'
            default:
                return '#4A6D7C';  // Fallback color
        }
    };

    const handleDropdownChange = (value) => {
        setSelectedOption(value);

        if (value === 'currentLocation') {
            setTitle("Current Location AQI Data");  // Change title to 'Current Location AQI Data'
            useCurrentLocation();  // Use current location
        } else if (value === 'paceUniversity') {
            setTitle("Pace University AQI Data");  // Change title to 'Pace University AQI Data'
            getPaceUniversityAirQuality();  
        }
        else if (value === 'paceUniversityNYC') {
            setTitle("Pace University NYC Campus AQI Data");  // Change title to 'Pace University NYC Campus AQI Data'
            getPaceUniversityNYCAirQuality();  
        }

    };

    const AqiCalculator = (aqi) => {
        if(aqi === 1){
            
        }
    }

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
            {/* Display dynamic title */}
            <Text style={styles.currentLocationButton}>{title}</Text>

            {/* Dropdown menu for selecting the location option */}
            <RNPickerSelect
                onValueChange={handleDropdownChange}
                items={[
                    { label: 'Use Your Current Location', value: 'currentLocation' },
                    { label: 'Get Air Quality at Pace University', value: 'paceUniversity' },
                    { label: 'Get Air Quality at Pace University NYC Campus', value: 'paceUniversityNYC' },
                ]}
                style={{
                    inputAndroid: {
                        color: 'white', // Text color for Android
                        backgroundColor: '#46484f', 
                        margin: 10,                       
                    },
                    inputIOS: {
                        color: 'white', // Text color for iOS
                        backgroundColor: '#46484f', 
                        margin: 10, 
                    },
                    placeholder: {
                        color: 'white', // Placeholder color
                        backgroundColor: '#46484f', 
                        margin: 10,
                    },
                }}
                placeholder={{ label: 'Select an option...', value: null }}
            />

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
            
            {loading && (
                <ActivityIndicator size="large" color="#007BFF" style={styles.loadingIndicator} />
            )}
        </ScrollView>
    );
};

export default AirQuality;
