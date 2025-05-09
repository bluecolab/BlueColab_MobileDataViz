export default function useDataCleaner() {
    const clean = (
        data: any,
        loading: boolean,
        finalUnitToUse?: string,
        defaultTempUnit?: string
    ) => {
        if (!Array.isArray(data) && loading) {
            return {
                dailySummary: [],
                overallMin: 0,
                overallMax: 0,
                overallAvg: 0,
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

        interface DailySummaryType {
            day: Date;
            avg: number | undefined;
            min: number | undefined;
            max: number | undefined;
        }

        const dailySummary = Object.keys(groupedData).map(
            (date): DailySummaryType => ({
                day: new Date(date),
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

        return {
            dailySummary,
            overallMin,
            overallMax,
            overallAvg,
            tickValues,
        };
    };

    return { clean };
}
