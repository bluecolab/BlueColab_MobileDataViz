import axios, { isAxiosError } from 'axios';

import useGetMetadata from '@/hooks/useGetMetadata';
import { useCallback, useMemo } from 'react';

export default function useGetWaterData() {
    const { usgsParameterMappings, stationIds } = useGetMetadata();
    interface TimeSeries {
        sourceInfo: {
            siteName: string;
            siteCode: {
                value: string;
                network: string;
                agencyCode: string;
            }[];
            timeZoneInfo: {
                defaultTimeZone: {
                    zoneOffset: string;
                    zoneAbbreviation: string;
                };
                daylightTimeZone: {
                    zoneOffset: string;
                    zoneAbbreviation: string;
                };
                siteUsesDaylightTime: boolean;
            };
            geoLocation: {
                geogLocation: {
                    srs: string;
                    latitude: number;
                    longitude: number;
                };
                localSiteXY: {
                    x: string;
                    y: string;
                }[];
            };
            note: [];
            siteType: [];
            siteProperty: {
                value: string;
                name: string;
            }[];
        };
        variable: {
            variableCode: {
                value: string;
                name: string;
            }[];
            variableName: string;
            variableDescription: string;
            valueType: string;
            unit: {
                unitCode: string;
            };
            note: [];
            noDataValue: number;
            variableProperty: [];
            oid: string;
        };
        values: {
            value: {
                dateTime: string;
                value: string;
            }[];
        }[];
        name: string;
    }
    interface CleanWaterRiverDataProps {
        declaredType: string;
        globalScope: boolean;
        name: string;
        scope: string;
        typeSubstituted: boolean;
        value: {
            queryInfo: {
                queryURL: string;
                criteria: {
                    locationparam: string;
                    variableparam: string;
                    parameter: [];
                };
                note: {
                    value: string;
                    title: string;
                }[];
            };
            timeSeries: TimeSeries[];
        };
    }

    const USGSParameterMappingsEnum = useMemo(
        () =>
            Object.fromEntries(
                Object.entries(usgsParameterMappings).map(([key, value]) => [key, value])
            ) as { [key: string]: string },
        [usgsParameterMappings]
    );

    const cleanHudsonRiverData = useCallback(
        (rawData: CleanWaterRiverDataProps) => {
            if (!rawData?.value?.timeSeries) {
                console.error('Invalid data format');
                return [];
            }

            const parsedData: {
                timestamp: string;
                Cond?: number;
                DO?: number;
                DOpct?: number;
                pH?: number;
                Temp?: number;
                Turb?: number;
                Sal?: number;
            }[] = [];

            type ParameterName = 'Cond' | 'DO' | 'DOpct' | 'pH' | 'Temp' | 'Turb' | 'Sal';

            rawData.value.timeSeries.forEach((series: TimeSeries) => {
                const paramCode = series.variable.variableCode[0].value;
                const paramName = USGSParameterMappingsEnum[paramCode];

                if (!paramName) return; // Skip unneeded parameters

                // Extracts array containing all values for selected parameter
                const valuesList =
                    series.values[0].value.length > 0
                        ? series.values[0].value
                        : (series.values[1]?.value ?? []);

                valuesList.forEach((entry) => {
                    const timestamp = entry.dateTime;
                    const value = parseFloat(entry.value);

                    let existingEntry = parsedData.find((data) => data.timestamp === timestamp);

                    if (!existingEntry) {
                        existingEntry = {
                            timestamp,
                        };
                        if (paramName in existingEntry) {
                            existingEntry[paramName as ParameterName] = value;
                        }
                        parsedData.push(existingEntry);
                    }
                    existingEntry[paramName as ParameterName] = value;
                });
            });
            return parsedData;
        },
        [USGSParameterMappingsEnum]
    );

    const fetchData = useCallback(
        (
            defaultLocation: string,
            isCurrentData: boolean,
            year: number,
            month: number,
            start_day: number,
            end_day: number,
            setData: (data: any) => void,
            setLoading: (loading: boolean) => void
        ) => {
            let baseURL = '';
            let query = '';
            switch (defaultLocation) {
                case 'Choate Pond':
                    baseURL = 'https://colabprod01.pace.edu/api/influx/sensordata/Alan/';
                    query = isCurrentData
                        ? 'delta?days=1'
                        : `range?stream=false&start_date=${year}-${month.toString().padStart(2, '0')}-${start_day}T00%3A00%3A00%2B00%3A00&stop_date=${year}-${month.toString().padStart(2, '0')}-${end_day}T23%3A59%3A59%2B00%3A00`;
                    break;
                case 'New York City':
                case 'Piermont':
                case 'West Point':
                case 'Poughkeepsie':
                case 'Albany':
                case 'Cohoes':
                case 'Gowanda':
                case 'Bronx River':
                    baseURL = 'https://waterservices.usgs.gov/nwis/iv/';
                    query = isCurrentData
                        ? `?sites=${stationIds[defaultLocation] ?? '01376269'}&period=P2D&format=json&parameterCd=00010,00301,00300,90860,00095,63680,00400`
                        : `?sites=${stationIds[defaultLocation] ?? '01376269'}&startDT=${year}-${month.toString().padStart(2, '0')}-${start_day.toString().padStart(2, '0')}&endDT=${year}-${month.toString().padStart(2, '0')}-${end_day.toString().padStart(2, '0')}&format=json&parameterCd=00010,00301,00300,90860,00095,63680,00400`;
                    break;
                default:
                    baseURL = 'https://colabprod01.pace.edu/api/influx/sensordata/Alan/';
                    query = isCurrentData
                        ? 'delta?days=1'
                        : `range?stream=false&start_date=${year}-${month.toString().padStart(2, '0')}-${start_day}T00%3A00%3A00%2B00%3A00&stop_date=${year}-${month.toString().padStart(2, '0')}-${end_day}T23%3A59%3A59%2B00%3A00`;
                    break;
            }

            axios
                .get(baseURL + query)
                .then((response) => {
                    const apiData = response.data;
                    console.log(baseURL + query, response.status);
                    if (defaultLocation === 'Choate Pond') {
                        const cleanedData = apiData.map(
                            (item: {
                                sensors: {
                                    Cond: number;
                                    Sal: number;
                                    Turb: number;
                                    DO: number;
                                    DOpct: number;
                                    pH: number;
                                    Temp: number;
                                };
                            }) => {
                                const { sensors, ...rest } = item;
                                return { ...rest, ...sensors };
                            }
                        );
                        setData(cleanedData);
                    } else {
                        const cleanedData = cleanHudsonRiverData(apiData);
                        setData(cleanedData);
                    }
                })
                .catch((error) => {
                    if (isAxiosError(error)) {
                        if (error.response) {
                            console.error(`Response error: ${error.response.status}`);
                            if (error.response.data.status === 404)
                                setData({ error: 'No data available for the selected range.' });
                            else setData({ error: `HTTP Error: ${error.response.status}` });
                            console.error(error.response.headers); // Server response headers
                        } else if (error.request) {
                            console.error('Request error: No response received');
                            console.error(error.request);
                            setData({ error: 'No response from server, check WiFi connection' });
                        } else {
                            console.error(`General Axios error: ${error.message}`);
                            setData({ error: `Error: ${error.message}` });
                        }
                    } else {
                        console.error('Non-Axios error: ', error);
                        setData({ error: 'Unknown error occurred' });
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [stationIds, cleanHudsonRiverData]
    );

    return {
        fetchData,
    };
}
