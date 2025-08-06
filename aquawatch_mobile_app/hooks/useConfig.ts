import { useMemo } from 'react';
import { Config } from '@/types/config.interface';

export const config = {
    BLUE_COLAB_API_URL: 'https://colabprod01.pace.edu/api/influx/sensordata',
    BLUE_COLAB_API_CONFIG: {
        defaultMeasurement: 'Alan',
        currentDataQuery: 'delta?days=1',
        rangeDataQuery: (year: number, month: number, start_day: number, end_day: number) =>
            `range?stream=false&start_date=${year}-${month.toString().padStart(2, '0')}-${start_day}T00%3A00%3A00%2B00%3A00&stop_date=${year}-${month.toString().padStart(2, '0')}-${end_day}T23%3A59%3A59%2B00%3A00`,
        validMatches: ['Choate Pond'],
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
        validMatches: [
            'New York City',
            'Piermont',
            'West Point',
            'Poughkeepsie',
            'Albany',
            'Cohoes',
            'Gowanda',
            'Bronx River',
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
                defaultLocation: string,
                isCurrentData: boolean,
                year: number,
                month: number,
                start_day: number,
                end_day: number,
                stationIds: { [key: string]: string }
            ) => {
                let baseURL = '';
                let query = '';

                if (config.BLUE_COLAB_API_CONFIG.validMatches.includes(defaultLocation)) {
                    baseURL = config.BLUE_COLAB_API_URL;
                    query = getBlueColabQuery(isCurrentData, year, month, start_day, end_day);
                } else if (
                    config.USGS_WATER_SERVICES_API_CONFIG.validMatches.includes(defaultLocation)
                ) {
                    const stationId =
                        stationIds[defaultLocation as keyof typeof stationIds] ??
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
