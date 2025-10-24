import axios, { isAxiosError } from 'axios';
import { useNetworkState } from 'expo-network';
import { useCallback } from 'react';

import { config } from '@/hooks/useConfig';
import { OpenWeatherAQI } from '@/types/water.interface';

export default function useGetAQIData() {
    const networkState = useNetworkState();

    const fetchAQIData = useCallback(
        async (latitude: number, longitude: number): Promise<OpenWeatherAQI> => {
            if (networkState.isInternetReachable === false) {
                throw new Error('No internet connection');
            }

            const apiKey = 'd4ed5de7a585258cb8851ed5cc64525d';
            const url = `${config.OPEN_WEATHER_API_URL}/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

            console.log('Fetching with React Query:', url);

            try {
                const response = await axios.get(url);
                const apiData = response.data;
                return apiData;
            } catch (error) {
                // Log the original error for debugging
                console.error('Data fetching error:', error);

                // Re-throw a new, user-friendly error for React Query to catch
                if (isAxiosError(error)) {
                    if (error.response?.status === 404) {
                        throw new Error('No data available for the selected date range.');
                    }
                    if (error.response) {
                        throw new Error(`HTTP Error: ${error.response.status}`);
                    }
                    if (error.request) {
                        throw new Error('No response from server. Check your network connection.');
                    }
                }
                throw new Error('An unknown error occurred while fetching data.');
            }
        },
        [networkState.isInternetReachable]
    );

    return {
        fetchAQIData,
    };
}
