import axios, { isAxiosError } from 'axios';
import { useNetworkState } from 'expo-network';
import { useCallback } from 'react';

// import { config } from '@/hooks/useConfig';
import { OpenWeatherAQI } from '@/types/water.interface';

export default function useGetWaterReportsData() {
    const networkState = useNetworkState();

    const fetchWaterReportsData = useCallback(
        async (year: string): Promise<OpenWeatherAQI> => {
            if (networkState.isInternetReachable === false) {
                throw new Error('No internet connection');
            }

            const url = `http://127.0.0.1:8080/waterReports/latest/report/${year}`;

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
        fetchWaterReportsData,
    };
}
