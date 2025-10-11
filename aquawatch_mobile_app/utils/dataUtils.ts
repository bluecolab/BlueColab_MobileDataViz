import { CleanedWaterData, SensorData } from '@/types/water.interface';

export default function dataUtils() {
    const generateDataSummary = (
        data: CleanedWaterData[] | undefined,
        loading: boolean,
        finalUnitToUse?: string,
        defaultTempUnit?: string
    ) => {
        if (!data || loading || (!Array.isArray(data) && loading)) {
            return {
                dailySummary: [],
                overallMin: 'N/A' as 'N/A',
                overallMax: 'N/A' as 'N/A',
                overallAvg: 'N/A' as 'N/A',
                tickValues: [],
            };
        }
        interface GroupedData {
            [date: string]: number[];
        }

        // Group the data by date for unit indicated by finalUnitToUse (i.e. the key is the date, the value is list of number
        // values for that date) and convert the temperature to Fahrenheit if needed
        const groupedData: GroupedData = data.reduce((acc: GroupedData, item: any) => {
            const date = new Date(item.timestamp).toISOString().split('T')[0];
            const value =
                finalUnitToUse === 'Temp' && defaultTempUnit?.trim() === 'Fahrenheit'
                    ? item[finalUnitToUse] * (9 / 5) + 32
                    : item[finalUnitToUse ?? 'Temp'];
            if (!acc[date]) acc[date] = [];
            acc[date].push(value);
            return acc;
        }, {});

        const dailySummary = Object.keys(groupedData).map(
            (date): DailySummaryType => ({
                day: new Date(date).getUTCDate(),
                avg: groupedData[date].reduce((sum, v) => sum + v, 0) / groupedData[date].length,
                min: Math.min(...groupedData[date]),
                max: Math.max(...groupedData[date]),
            })
        );

        dailySummary.forEach((ele: DailySummaryType) => {
            ele.avg = !isNaN(ele.avg ?? NaN) && ele.avg !== -999999 ? ele.avg : undefined;
            ele.min = !isNaN(ele.min ?? NaN) && ele.min !== -999999 ? ele.min : undefined;
            ele.max = !isNaN(ele.max ?? NaN) && ele.max !== -999999 ? ele.max : undefined;
        });

        // Calculate overall min, max, and average
        const allValues = Object.values(groupedData)
            .flat()
            .filter((value) => value !== undefined && !Number.isNaN(value));
        let overallMin = 0;
        let overallMax = 0;
        let overallAvg = 0;
        overallMin = Math.min(...allValues);
        overallMax = Math.max(...allValues);
        overallAvg = allValues.reduce((sum, value) => sum + value, 0) / allValues.length;

        const tickValues = dailySummary
            .map(({ day }, index) => (index % 5 === 0 ? day : null))
            .filter(Boolean);

        const allUndefined = dailySummary.every(
            (entry) => entry.avg === undefined && entry.min === undefined && entry.max === undefined
        );

        if (allUndefined) {
            return {
                dailySummary: [],
                overallMin: 'N/A' as 'N/A',
                overallMax: 'N/A' as 'N/A',
                overallAvg: 'N/A' as 'N/A',
                tickValues: [],
            };
        }

        return {
            dailySummary,
            overallMin,
            overallMax,
            overallAvg,
            tickValues,
        };
    };

    const averageSensors = (data: SensorData[]): SensorData =>
        data.reduce<SensorData>(
            (acc, { Cond, DOpct, Sal, Temp, Turb, pH }) => {
                acc.Cond += Cond;
                acc.DOpct += DOpct;
                acc.Sal += Sal;
                acc.Temp += Temp;
                acc.Turb += Turb;
                acc.pH += pH;
                return acc;
            },
            { Cond: 0, DOpct: 0, Sal: 0, Temp: 0, Turb: 0, pH: 0 } // Initial accumulator
        );

    const calculateWQI = (data: SensorData[], loading: boolean): number => {
        let score = 0;

        if (!loading && data.length >= 1) {
            const const_dopct = 0.34;
            const const_ph = 0.22;
            const const_temp = 0.2;
            const const_cond = 0.08;
            const const_turb = 0.16;

            // Get averaged sensor data
            const sensorAverages = averageSensors(data);

            // Normalize sensor values
            Object.keys(sensorAverages).forEach((sensor) => {
                sensorAverages[sensor as keyof SensorData] /= data.length;
            });

            // Apply weights
            const result = {
                DOpct: sensorAverages.DOpct * const_dopct,
                pH: sensorAverages.pH * const_ph,
                Temp: sensorAverages.Temp * const_temp,
                Cond: sensorAverages.Cond * const_cond,
                Turb: sensorAverages.Turb * const_turb,
            };

            // Compute final score
            score = Math.round(Object.values(result).reduce((acc, value) => acc + value, 0));
        }

        return score;
    };

    return { generateDataSummary, calculateWQI };
}

export interface DailySummaryType {
    [key: string]: unknown;
    day: number;
    avg: number | undefined;
    min: number | undefined;
    max: number | undefined;
}
