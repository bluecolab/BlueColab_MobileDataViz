import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import styles from '../../styles';  
import * as Location from 'expo-location';
import RNPickerSelect from 'react-native-picker-select';

// AQIBar Component
const AQIBar = ({ aqiGrade }) => {
  const getBarStyle = (grade) => { 
    let widthPercentage = '0%';
    let backgroundColor = 'green';

    if (grade === 1) {
      widthPercentage = '20%';
      backgroundColor = '#00E400';
    } else if (grade === 2) {
      widthPercentage = '35%';
      backgroundColor = '#FFFF00';
    } else if (grade === 3) {
      widthPercentage = '50%';
      backgroundColor = '#FF7E00';
    } else if (grade === 4) {
      widthPercentage = '70%';
      backgroundColor = '#FF0000';
    } else if (grade === 5) {
      widthPercentage = '100%';
      backgroundColor = '#99004C';
    }

    return { width: widthPercentage, backgroundColor };
  };

  const getAQILabel = (aqi) => {
    switch (aqi) {
    case 1: return 'Good';
    case 2: return 'Moderate';
    case 3: return 'Unhealthy for Sensitive Groups';
    case 4: return 'Unhealthy';
    case 5: return 'Very Unhealthy';
    default: return 'Hazardous';
    }
  };

  return (
    <View style={aqiBarStyles.container}>
      <View style={aqiBarStyles.textContainer}>
        <Text style={aqiBarStyles.aqiText}>AQI: {aqiGrade}</Text>
        <Text style={aqiBarStyles.aqiLabel}>{getAQILabel(aqiGrade)}</Text>
      </View>
      <View style={aqiBarStyles.barBackground}>
        <View style={[aqiBarStyles.barFill, getBarStyle(aqiGrade)]} />
      </View>
    </View>
  );
};

const aqiBarStyles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: 'center',
    width: '80%',
    marginTop: -15,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 5,
  },
  aqiText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  barBackground: {
    width: '100%',
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 10,
  },
  aqiLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

// Function to get air quality data
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

// Function to get coordinates of a city
const getCoordinatesFromCity = async (city) => {
  const apiKey2 = '4925f2810962e0647c896b2cffd6edf3'; // Your PositionStack API key
  const url = `https://api.positionstack.com/v1/forward?access_key=${apiKey2}&query=${city}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.data && data.data.length > 0) {
      const { latitude, longitude } = data.data[0];
      return { latitude, longitude };
    } else {
      Alert.alert('City Not Found', 'Please enter a valid city name.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    Alert.alert('Error', 'Could not fetch coordinates. Please try again.');
    return null;
  }
};

const AirQuality = () => {
  const [airQualityData, setAirQualityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOption, setSelectedOption] = useState('currentLocation');
  const [location, setLocation] = useState({
    latitude: 41.12838,
    longitude: -73.808189,
  });
  const [title, setTitle] = useState('Air Quality Data');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAirQualityData();
  }, [location]);

  const fetchAirQualityData = async () => {
    setLoading(true); // Show loading indicator
    setRefreshing(true);
    try {
      const data = await getAirQuality(location.latitude, location.longitude);
      if (data) {
        setAirQualityData(data);
      }
    } catch (error) {
      console.error('Error fetching air quality data:', error);
    } finally {
      setRefreshing(false);
      setLoading(false); // Hide loading indicator
    }
  };

  const useCurrentLocation = async () => {
    setLoading(true);
    
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      setLoading(false);
      Alert.alert('Permission denied', 'Location permission is required to fetch your current location.');
      console.log('Permission to access location was denied');
      return;
    }
    
    try {
      const location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
      const { latitude, longitude } = location.coords;
      setLocation({ latitude, longitude });
      setTitle('Current Location AQI Data');  // Change title when location is fetched
      fetchAirQualityData();  // Trigger fetching air quality data
    } catch (error) {
      Alert.alert('Error', 'Could not fetch location. Please try again.');
      console.error('Error getting location:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDropdownChange = (value) => {
    setSelectedOption(value);
    
    if (value === 'currentLocation') {
      setTitle('Current Location AQI Data');
      useCurrentLocation();  // Use current location
    } else if (value === 'paceUniversity') {
      setTitle('Pace University AQI Data');
      setLocation({ latitude: 41.128380, longitude: -73.808189 });
    } else if (value === 'paceUniversityNYC') {
      setTitle('Pace University NYC Campus AQI Data');
      setLocation({ latitude: 40.711220, longitude: -74.006477 });
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
          refreshing={refreshing}
          onRefresh={fetchAirQualityData}
        />
      }
    >   

      {/* Display dynamic title */}
      <Text style={styles.currentLocationTitle}>{title}</Text>

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
            marginBottom: 50,                   
          },
          inputIOS: {
            color: 'white', // Text color for iOS
            backgroundColor: '#46484f', 
            margin: 10,
            marginBottom: 50, 
          },
          placeholder: {
            color: 'white', // Placeholder color
            backgroundColor: '#46484f', 
            margin: 10,
            marginBottom: 50,
          },
        }}
        placeholder={{ label: 'Select an option...', value: null }}
      />

      {/* AQI Bar below dropdown */}
      {airQualityData && (
        <AQIBar aqiGrade={airQualityData.list[0].main.aqi} />
      )}

      {/* Display AQI data */}
      {airQualityData ? (
        <View style={styles.airQualityInfo}>
          <Text style={styles.airQualityText}>
                        CO: {airQualityData.list[0].components.co} µg/m³
          </Text>
          <Text style={styles.airQualityText}>
                        NO2: {airQualityData.list[0].components.no2} µg/m³
          </Text>
          <Text style={styles.airQualityText}>
                        PM2.5: {airQualityData.list[0].components.pm2_5} µg/m³
          </Text>
        </View>
      ) : (
        <Text style={styles.loadingText}>Loading air quality data...</Text>
      )}

      {loading && (
        <ActivityIndicator
          size="large"
          color="#007BFF"
          style={styles.loadingIndicator}
        />
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
    color: 'white',
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
});

export default AirQuality;

