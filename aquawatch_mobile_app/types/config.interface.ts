export interface Config {
    BLUE_COLAB_API_URL: string;
    BLUE_COLAB_API_CONFIG: {
        defaultMeasurement: string;
        currentDataQuery: string;
        rangeDataQuery: (year: number, month: number, start_day: number, end_day: number) => string;
        validMatches: string[];
    };
    USGS_WATER_SERVICES_API_URL: string;
    USGS_WATER_SERVICES_API_CONFIG: {
        defaultStation: string;
        parameterCd: string;
        format: 'rdb' | 'json';
        currentDataQuery: (stationId: string) => string;
        rangeDataQuery: (
            stationId: string,
            year: number,
            month: number,
            start_day: number,
            end_day: number
        ) => string;
        validMatches: string[];
    };
    OPEN_WEATHER_API_URL: string;
}
