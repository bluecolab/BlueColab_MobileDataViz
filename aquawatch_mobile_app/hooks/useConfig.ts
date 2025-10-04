import { useMemo } from 'react';

import { Config, LocationType } from '@/types/config.interface';

export const config = {
    // Not sure why only lets me query a minimum of 5 hours
    BLUE_COLAB_API_ODIN_URL:
        'https://colabprod01.pace.edu/api/influx/sensordata/Odin/delta?days=0&hours=5&minutes=0',
    BLUE_COLAB_API_URL: 'https://colabprod01.pace.edu/api/influx/sensordata',
    BLUE_COLAB_API_CONFIG: {
        defaultMeasurement: 'Alan',
        currentDataQuery: 'delta?days=1',
        rangeDataQuery: (year: number, month: number, start_day: number, end_day: number) =>
            `range?stream=false&start_date=${year}-${month.toString().padStart(2, '0')}-${start_day}T00%3A00%3A00%2B00%3A00&stop_date=${year}-${month.toString().padStart(2, '0')}-${end_day}T23%3A59%3A59%2B00%3A00`,
        validMatches: [{ name: 'Choate Pond', lat: 41.127494, long: -73.808235 }],
    },
    USGS_WATER_SERVICES_API_URL: 'https://waterservices.usgs.gov/nwis/iv',
    USGS_WATER_SERVICES_API_CONFIG: {
        defaultStation: '01376269',
        parameterCd: '00010,00301,00300,90860,00095,63680,00400',
        format: 'json',
        currentDataQuery: (stationId: string) =>
            `?sites=${stationId}&period=P2D&format=${config.USGS_WATER_SERVICES_API_CONFIG.format}&parameterCd=${config.USGS_WATER_SERVICES_API_CONFIG.parameterCd}`,
        rangeDataQuery: (
            stationId: string,
            year: number,
            month: number,
            start_day: number,
            end_day: number
        ) =>
            `?sites=${stationId}&startDT=${year}-${month.toString().padStart(2, '0')}-${start_day
                .toString()
                .padStart(2, '0')}&endDT=${year}-${month.toString().padStart(2, '0')}-${end_day
                .toString()
                .padStart(
                    2,
                    '0'
                )}&format=${config.USGS_WATER_SERVICES_API_CONFIG.format}&parameterCd=${config.USGS_WATER_SERVICES_API_CONFIG.parameterCd}`,
        // validMatches: [
        //     'New York City',
        //     'Piermont',
        //     'West Point',
        //     'Poughkeepsie',
        //     'Albany',
        //     'Cohoes',
        //     'Gowanda',
        //     'Bronx River',
        // ],
        validMatches: [
            { name: 'Botanical Garden', lat: 40.86230556, long: -73.87438889 },
            { name: 'Albany', lat: 42.61952778, long: -73.7589167 },
            { name: 'Poughkeepsie', lat: 41.72058333, long: -73.93875 },
            { name: 'West Point', lat: 41.3862049, long: -73.95513879 },
            { name: 'Piermont', lat: 41.04319444, long: -73.8960556 },
            { name: 'NYC', lat: 40.72152778, long: -74.0156111 },
            { name: 'Gowanda', lat: 42.46344444, long: -78.9345278 },
            { name: 'Cohoes', lat: 42.78569444, long: -73.7104167 },
        ],
    },
    OPEN_WEATHER_API_URL: '',
} as Config;

export const useAPIConfig = () => {
    const getBlueColabQuery = useMemo(
        () =>
            (
                isCurrentData: boolean,
                year: number,
                month: number,
                start_day: number,
                end_day: number
            ) => {
                return isCurrentData
                    ? `${config.BLUE_COLAB_API_CONFIG.defaultMeasurement}/${config.BLUE_COLAB_API_CONFIG.currentDataQuery}`
                    : `${config.BLUE_COLAB_API_CONFIG.defaultMeasurement}/${config.BLUE_COLAB_API_CONFIG.rangeDataQuery(year, month, start_day, end_day)}`;
            },
        []
    );

    const getUSGSQuery = useMemo(
        () =>
            (
                isCurrentData: boolean,
                stationId: string,
                year: number,
                month: number,
                start_day: number,
                end_day: number
            ) => {
                return isCurrentData
                    ? config.USGS_WATER_SERVICES_API_CONFIG.currentDataQuery(stationId)
                    : config.USGS_WATER_SERVICES_API_CONFIG.rangeDataQuery(
                          stationId,
                          year,
                          month,
                          start_day,
                          end_day
                      );
            },
        []
    );

    const getAPIUrl = useMemo(
        () =>
            (
                // Updated type from string to name, lat, long
                defaultLocation: LocationType,
                isCurrentData: boolean,
                year: number,
                month: number,
                start_day: number,
                end_day: number,
                stationIds: { [key: string]: string }
            ) => {
                let baseURL = '';
                let query = '';

                if (
                    config.BLUE_COLAB_API_CONFIG.validMatches.some(
                        (loc) => loc.name === defaultLocation.name
                    )
                ) {
                    baseURL = config.BLUE_COLAB_API_URL;
                    query = getBlueColabQuery(isCurrentData, year, month, start_day, end_day);
                } else if (
                    config.USGS_WATER_SERVICES_API_CONFIG.validMatches.some(
                        (loc) => loc.name === defaultLocation.name
                    )
                ) {
                    const stationId =
                        // Updated defaultLocation to defaultLocation.name
                        stationIds[defaultLocation.name as keyof typeof stationIds] ??
                        config.USGS_WATER_SERVICES_API_CONFIG.defaultStation;
                    baseURL = config.USGS_WATER_SERVICES_API_URL;
                    query = getUSGSQuery(isCurrentData, stationId, year, month, start_day, end_day);
                } else {
                    baseURL = `${config.BLUE_COLAB_API_URL}/${config.BLUE_COLAB_API_CONFIG.defaultMeasurement}`;
                    query = getBlueColabQuery(isCurrentData, year, month, start_day, end_day);
                }

                return `${baseURL}/${query}`;
            },
        [getBlueColabQuery, getUSGSQuery]
    );

    return {
        getAPIUrl,
    };
};
