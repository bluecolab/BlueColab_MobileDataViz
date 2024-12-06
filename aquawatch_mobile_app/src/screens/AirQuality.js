import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
    TextInput,
    Alert,
} from "react-native";
import styles from "../../styles";
import * as Location from "expo-location";
import RNPickerSelect from 'react-native-picker-select';

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

// Function to get coordinates of a city from PositionStack API
const getCoordinatesFromCity = async (city) => {
    const apiKey = '4925f2810962e0647c896b2cffd6edf3'; // Your PositionStack API key
    const url = `https://api.positionstack.com/v1/forward?access_key=${apiKey}&query=${city}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.data && data.data.length > 0) {
            const { latitude, longitude } = data.data[0];
            return { latitude, longitude };
        } else {
            Alert.alert("City Not Found", "Please enter a valid city name.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching coordinates:", error);
        Alert.alert("Error", "Could not fetch coordinates. Please try again.");
        return null;
    }
};

const AirQuality = () => {
    const [airQualityData, setAirQualityData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);  // State for refreshing
    const [location, setLocation] = useState({ latitude: 41.128380, longitude: -73.808189 }); // Default to Pace University Pleasantville Campus
    const [selectedOption, setSelectedOption] = useState('currentLocation'); // Default selected option
    const [title, setTitle] = useState("Air Quality Data"); // Dynamic title
    const [searchQuery, setSearchQuery] = useState(""); // State for the search query

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

    const handleDropdownChange = (value) => {
        setSelectedOption(value);

        if (value === 'currentLocation') {
            setTitle("Current Location AQI Data");  // Change title to 'Current Location AQI Data'
            useCurrentLocation();  // Use current location
        } else if (value === 'paceUniversity') {
            setTitle("Pace University AQI Data");  // Change title to 'Pace University AQI Data'
            setLocation({ latitude: 41.128380, longitude: -73.808189 });
        }
        else if (value === 'paceUniversityNYC') {
            setTitle("Pace University NYC Campus AQI Data");  // Change title to 'Pace University NYC Campus AQI Data'
            setLocation({ latitude: 40.711220, longitude: -74.006477 });
        }
    };

    // Function to determine AQI color based on AQI value
    const getAQIColor = (aqi) => {
        switch (aqi) {
            case 1: return "#00E400"; // Good
            case 2: return "#FFFF00"; // Moderate
            case 3: return "#FF7E00"; // Unhealthy for Sensitive Groups
            case 4: return "#FF0000"; // Unhealthy
            case 5: return "#99004C"; // Very Unhealthy
            default: return "#7E0023"; // Hazardous
        }
    };

    // Function to classify AQI and return a label
    const getAQILabel = (aqi) => {
        if (aqi <= 1) {
            return "Great"; 
        } else if (aqi <= 2) {
            return "Moderate"; 
        } else if (aqi <= 3) {
            return "Bad"; 
        } else if (aqi <= 4) {
            return "Very Bad"; 
        } else if (aqi <= 5) {
            return "Hazardous"; 
        } else {
            return "Hazardous"; 
        }
    };

    const handleSearch = async () => {
        const coordinates = await getCoordinatesFromCity(searchQuery);
        if (coordinates) {
            setLocation(coordinates);
            setTitle(`Air Quality Data for ${searchQuery}`);
        }
    };

    return (
        <ScrollView 
            contentContainerStyle={styles.airQualityContainer}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}  // Show the indicator when refreshing
                    onRefresh={fetchAirQualityData}  // Pull-to-refresh action
                />
            }
        >
            {/* Display dynamic title */}
            <Text style={styles.currentLocationButton}>{title}</Text>

            {/* Search Bar */}
            <TextInput
                style={searchBarStyles.input}
                placeholder="Search for a location..."
                placeholderTextColor="#ccc"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
            />

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
                            { backgroundColor: getAQIColor(airQualityData.list[0].main.aqi) }  
                        ]}
                    >
                        AQI: {airQualityData.list[0].main.aqi + "  " + getAQILabel(airQualityData.list[0].main.aqi)}
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

const searchBarStyles = StyleSheet.create({
    input: {
        height: 40,
        width: 300,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 10,
        color: 'white',
    }
});

export default AirQuality;
