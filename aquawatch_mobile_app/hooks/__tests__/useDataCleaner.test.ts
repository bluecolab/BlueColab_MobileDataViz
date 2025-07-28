import useDataCleaner from '@/hooks/useDataCleaner';

describe('useDataCleaner', () => {
    let dataCleaner: ReturnType<typeof useDataCleaner>;

    beforeEach(() => {
        dataCleaner = useDataCleaner();
    });

    describe('clean', () => {
        it('returns default values when data is not an array and loading is true', () => {
            const result = dataCleaner.clean(null, true);

            expect(result).toEqual({
                dailySummary: [],
                overallMin: 0,
                overallMax: 0,
                overallAvg: 0,
                tickValues: [],
                error: undefined,
            });
        });

        it('groups data by date and calculates daily summary', () => {
            const mockData = [
                {
                    timestamp: '2025-07-01T12:00:00Z',
                    Temp: 20,
                    Cond: 7650,
                    DOpct: 89,
                    Sal: 4.2,
                    Turb: 19.7,
                    pH: 7.7,
                },
                {
                    timestamp: '2025-07-01T15:00:00Z',
                    Temp: 25,
                    Cond: 7700,
                    DOpct: 90,
                    Sal: 4.3,
                    Turb: 19.8,
                    pH: 7.8,
                },
                {
                    timestamp: '2025-07-02T12:00:00Z',
                    Temp: 30,
                    Cond: 7800,
                    DOpct: 91,
                    Sal: 4.4,
                    Turb: 19.9,
                    pH: 7.9,
                },
            ];

            const result = dataCleaner.clean(mockData, false, 'Temp');

            expect(result.dailySummary).toEqual([
                { day: 30, avg: 22.5, min: 20, max: 25 },
                { day: 1, avg: 30, min: 30, max: 30 },
            ]);

            expect(result.overallMin).toBe(20);
            expect(result.overallMax).toBe(30);
            expect(result.overallAvg).toBe(25);
            expect(result.tickValues).toEqual([30]);
        });

        it('converts temperature to Fahrenheit when defaultTempUnit is Fahrenheit', () => {
            const mockData = [
                { timestamp: '2025-07-01T12:00:00Z', Temp: 20 },
                { timestamp: '2025-07-01T15:00:00Z', Temp: 25 },
            ];

            const result = dataCleaner.clean(mockData, false, 'Temp', 'Fahrenheit');

            expect(result.dailySummary).toEqual([{ day: 30, avg: 72.5, min: 68, max: 77 }]);
        });

        it('filters out invalid values in daily summary', () => {
            const mockData = [
                { timestamp: '2025-07-01T12:00:00Z', Temp: -999999 },
                { timestamp: '2025-07-01T15:00:00Z', Temp: 25 },
            ];

            const result = dataCleaner.clean(mockData, false, 'Temp');
            expect(result.dailySummary).toEqual([
                { day: 30, avg: -499987, min: undefined, max: 25 },
            ]);
        });

        it('filters out NaN values in daily summary', () => {
            const mockData = [
                { timestamp: '2025-07-01T12:00:00Z', Temp: NaN },
                { timestamp: '2025-07-01T15:00:00Z', Temp: 25 },
            ];

            const result = dataCleaner.clean(mockData, false, 'Temp');

            expect(result.dailySummary).toEqual([
                { day: 30, avg: undefined, min: undefined, max: undefined },
            ]);
        });

        it('defaults to temperature when no unit is specified', () => {
            const mockData = [
                { timestamp: '2025-07-01T12:00:00Z', Temp: 20 },
                { timestamp: '2025-07-01T15:00:00Z', Temp: 30 },
            ];

            const result = dataCleaner.clean(mockData, false, undefined, undefined);

            expect(result.dailySummary).toEqual([{ day: 30, avg: 25, min: 20, max: 30 }]);
        });

        it('handles undefined values in daily summary', () => {
            const mockData = [
                { timestamp: '2025-07-01T12:00:00Z', Temp: undefined },
                { timestamp: '2025-07-01T15:00:00Z', Temp: 25 },
            ];

            const result = dataCleaner.clean(mockData, false, 'Temp');

            expect(result.dailySummary).toEqual([
                { day: 30, avg: undefined, min: undefined, max: undefined },
            ]);
        });

        it('handles mixed invalid and valid values in daily summary', () => {
            const mockData = [
                { timestamp: '2025-07-01T12:00:00Z', Temp: -999999 },
                { timestamp: '2025-07-01T15:00:00Z', Temp: NaN },
                { timestamp: '2025-07-01T18:00:00Z', Temp: 25 },
            ];

            const result = dataCleaner.clean(mockData, false, 'Temp');

            expect(result.dailySummary).toEqual([
                { day: 30, avg: undefined, min: undefined, max: undefined },
            ]);
        });

        it('filters out all invalid values in daily summary', () => {
            const mockData = [
                { timestamp: '2025-07-01T12:00:00Z', Temp: -999999 },
                { timestamp: '2025-07-01T15:00:00Z', Temp: NaN },
            ];

            const result = dataCleaner.clean(mockData, false, 'Temp');

            expect(result.dailySummary).toEqual([]);
        });
    });
});

describe('calculateWQI', () => {
    let dataCleaner: ReturnType<typeof useDataCleaner>;

    beforeEach(() => {
        dataCleaner = useDataCleaner();
    });
    it('returns 0 when loading is true or data is empty', () => {
        const result = dataCleaner.calculateWQI([], true);
        expect(result).toBe(0);
    });

    it('calculates WQI based on sensor data', () => {
        const mockData = [
            { Cond: 100, DOpct: 80, Sal: 0, Temp: 20, Turb: 5, pH: 7 },
            { Cond: 120, DOpct: 85, Sal: 0, Temp: 22, Turb: 6, pH: 7.2 },
        ];

        const result = dataCleaner.calculateWQI(mockData, false);

        // Expected WQI calculation:
        // DOpct: (80 + 85) / 2 * 0.34 = 28.05
        // pH: (7 + 7.2) / 2 * 0.22 = 1.584
        // Temp: (20 + 22) / 2 * 0.2 = 4.2
        // Cond: (100 + 120) / 2 * 0.08 = 8.8
        // Turb: (5 + 6) / 2 * 0.16 = 0.88
        // Total = 28.05 + 1.584 + 4.2 + 8.8 + 0.88 = ~43.5
        expect(result).toBe(43);
    });
});
