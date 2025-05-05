import axios, { isAxiosError } from 'axios';
import { default as useLocationMetaProvider } from './useLocationMetaProvider';

export default function useGetWaterData() {
    const { usgsParameterMappings, stationIds } = useLocationMetaProvider();

    const USGSParameterMappingsEnum = Object.fromEntries(
        Object.entries(usgsParameterMappings).map(([key, value]) => [key, value])
    );

    const cleanHudsonRiverData = (rawData) => {
        if (!rawData?.value?.timeSeries) {
            console.error('Invalid data format');
            return [];
        }

        const parsedData = [];

        rawData.value.timeSeries.forEach((series) => {
            const paramCode = series.variable.variableCode[0].value;
            const paramName = USGSParameterMappingsEnum[paramCode];
            if (!paramName) return;

            const valuesList =
                series.values[0].value.length > 0
                    ? series.values[0].value
                    : (series.values[1]?.value ?? []);

            valuesList.forEach((entry) => {
                const timestamp = entry.dateTime;
                const value = parseFloat(entry.value);

                let existingEntry = parsedData.find((data) => data.timestamp === timestamp);

                if (!existingEntry) {
                    existingEntry = { timestamp };
                    parsedData.push(existingEntry);
                }

                existingEntry[paramName] = value;
            });
        });

        return parsedData;
    };

    const fetchData = (
        defaultLocation,
        isCurrentData,
        year,
        month,
        start_day,
        end_day,
        setData,
        setLoading,
    ) => {
        let baseURL = '';
        let query = '';

        switch (defaultLocation) {
            case 'Choate Pond':
                baseURL = 'https://colabprod01.pace.edu/api/influx/sensordata/Ada/';
                query = isCurrentData
                    ? 'delta?days=1'
                    : `range?stream=false&start_date=${year}-${String(month).padStart(2, '0')}-${start_day}T00%3A00%3A00%2B00%3A00&stop_date=${year}-${String(month).padStart(2, '0')}-${end_day}T23%3A59%3A59%2B00%3A00`;
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
                    : `?sites=${stationIds[defaultLocation] ?? '01376269'}&startDT=${year}-${month}-${start_day}&endDT=${year}-${month}-${end_day}&format=json&parameterCd=00010,00301,00300,90860,00095,63680,00400`;
                break;
            default:
                baseURL = 'https://colabprod01.pace.edu/api/influx/sensordata/Ada/';
                query = isCurrentData
                    ? 'delta?days=1'
                    : `range?stream=false&start_date=${year}-${String(month).padStart(2, '0')}-${start_day}T00%3A00%3A00%2B00%3A00&stop_date=${year}-${String(month).padStart(2, '0')}-${end_day}T23%3A59%3A59%2B00%3A00`;
                break;
        }

        console.log('Fetching data from:', baseURL + query);

        axios
            .get(baseURL + query)
            .then((response) => {
                const apiData = response.data;
                console.log(baseURL + query, response.status);

                if (defaultLocation === 'Choate Pond') {
                    const cleanedData = apiData.map((item) => {
                        const { sensors, ...rest } = item;
                        return { ...rest, ...sensors };
                    });
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
                        if (error.response.data.status === 404) {
                            setData({ error: 'No data :(' });
                        } else {
                            setData({ error: `HTTP Error: ${error.response.status}` });
                        }
                        console.error(error.response.headers);
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
    };

    return {
        fetchData,
    };
}
