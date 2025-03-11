import { default as useLocationMetaProvider } from './useLocationMetaProvider';
import axios from 'axios';

export default function useGetWaterData() {
    const { usgsParameterMappings, stationIds } = useLocationMetaProvider();
    const cleanHudsonRiverData = (rawData) => {
        if (!rawData?.value?.timeSeries) {
            console.error('Invalid data format');
            return [];
        }

        const parsedData = {};

        rawData.value.timeSeries.forEach(series => {
            const paramCode = series.variable.variableCode[0].value;
            const paramName = usgsParameterMappings[paramCode];

            if (!paramName) return; // Skip unneeded parameters

            const valuesList = series.values[0].value.length > 0 ? series.values[0].value : series.values[1]?.value ?? [];

            valuesList.forEach(entry => {
                const timestamp = entry.dateTime;
                const value = parseFloat(entry.value);

                if (!parsedData[timestamp]) {
                    parsedData[timestamp] = { timestamp };
                }
                parsedData[timestamp][paramName] = value;
            });
        });

        return Object.values(parsedData);
    };

    const fetchData = (defaultLocation, isCurrentData, year, month, start_day, end_day, setData, setLoading) => {
        let baseURL = '';
        let query = '';
        switch (defaultLocation) {
        case 'Choate Pond':
            baseURL = 'https://colabprod01.pace.edu/api/influx/sensordata/Ada/';
            query = isCurrentData ? 'delta?days=1' : `range?stream=false&start_date=${year}-${month.toString().padStart(2, '0')}-${start_day}T00%3A00%3A00%2B00%3A00&stop_date=${year}-${month.toString().padStart(2, '0')}-${end_day}T23%3A59%3A59%2B00%3A00` ;
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
            query = isCurrentData ?  `?sites=${stationIds[defaultLocation] ?? '01376269'}&period=P2D&format=json` : `?sites=${stationIds[defaultLocation] ?? '01376269'}&startDT=${year}-${month}-${start_day}&endDT=${year}-${month}-${end_day}&format=json`;
            break;
        default:
            baseURL = 'https://colabprod01.pace.edu/api/influx/sensordata/Ada/';
            query = isCurrentData ? 'delta?days=1' : `range?stream=false&start_date=${year}-${month.toString().padStart(2, '0')}-${start_day}T00%3A00%3A00%2B00%3A00&stop_date=${year}-${month.toString().padStart(2, '0')}-${end_day}T23%3A59%3A59%2B00%3A00` ;
            break;
        }

        axios
            .get(baseURL+query)
            .then((response) => {
                const apiData = response.data;
                console.log(baseURL+query, response.status);
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
                console.error('Error fetching data:', error);
                setData({ error: 'Failed to load data' });
            })
            .finally(() => {
                setLoading(false);
            });

    };

    return {
        fetchData,
    };
}
