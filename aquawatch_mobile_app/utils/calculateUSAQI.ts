/**
 * US EPA AQI Calculation Utility
 *
 * Calculates the US EPA Air Quality Index (AQI) from pollutant concentrations.
 * Based on EPA's Technical Assistance Document for the Reporting of Daily Air Quality.
 *
 * Note: OpenWeather API returns concentrations in μg/m³, which is what we use.
 * For CO, the EPA uses mg/m³, so we convert from μg/m³ to mg/m³.
 *
 * Reference: https://www.airnow.gov/aqi/aqi-basics/
 */

/**
 * AQI breakpoints for each pollutant
 * Format: [AQI_low, AQI_high, concentration_low, concentration_high]
 */

// PM2.5 (μg/m³) - 24-hour average
// Using the 2024 EPA breakpoints
const PM25_BREAKPOINTS = [
    { aqiLow: 0, aqiHigh: 50, concLow: 0.0, concHigh: 9.0 },
    { aqiLow: 51, aqiHigh: 100, concLow: 9.1, concHigh: 35.4 },
    { aqiLow: 101, aqiHigh: 150, concLow: 35.5, concHigh: 55.4 },
    { aqiLow: 151, aqiHigh: 200, concLow: 55.5, concHigh: 125.4 },
    { aqiLow: 201, aqiHigh: 300, concLow: 125.5, concHigh: 225.4 },
    { aqiLow: 301, aqiHigh: 500, concLow: 225.5, concHigh: 500.4 },
];

// PM10 (μg/m³) - 24-hour average
const PM10_BREAKPOINTS = [
    { aqiLow: 0, aqiHigh: 50, concLow: 0, concHigh: 54 },
    { aqiLow: 51, aqiHigh: 100, concLow: 55, concHigh: 154 },
    { aqiLow: 101, aqiHigh: 150, concLow: 155, concHigh: 254 },
    { aqiLow: 151, aqiHigh: 200, concLow: 255, concHigh: 354 },
    { aqiLow: 201, aqiHigh: 300, concLow: 355, concHigh: 424 },
    { aqiLow: 301, aqiHigh: 500, concLow: 425, concHigh: 604 },
];

// Ozone O3 (μg/m³) - 8-hour average (converted from ppb)
// OpenWeather returns O3 in μg/m³, EPA uses ppb
// 1 ppb O3 ≈ 1.96 μg/m³ at 25°C and 1 atm
// So we convert μg/m³ to ppb by dividing by 1.96
const O3_BREAKPOINTS = [
    { aqiLow: 0, aqiHigh: 50, concLow: 0, concHigh: 108 }, // 0-54 ppb * 2
    { aqiLow: 51, aqiHigh: 100, concLow: 109, concHigh: 140 }, // 55-70 ppb * 2
    { aqiLow: 101, aqiHigh: 150, concLow: 141, concHigh: 170 }, // 71-85 ppb * 2
    { aqiLow: 151, aqiHigh: 200, concLow: 171, concHigh: 210 }, // 86-105 ppb * 2
    { aqiLow: 201, aqiHigh: 300, concLow: 211, concHigh: 400 }, // 106-200 ppb * 2
];

// CO (mg/m³) - 8-hour average
// OpenWeather returns CO in μg/m³, need to convert to mg/m³
// EPA uses ppm: 1 ppm CO ≈ 1.145 mg/m³
const CO_BREAKPOINTS = [
    { aqiLow: 0, aqiHigh: 50, concLow: 0, concHigh: 5030 }, // 0-4.4 ppm * 1145
    { aqiLow: 51, aqiHigh: 100, concLow: 5031, concHigh: 10950 }, // 4.5-9.4 ppm * 1145
    { aqiLow: 101, aqiHigh: 150, concLow: 10951, concHigh: 14210 }, // 9.5-12.4 ppm * 1145
    { aqiLow: 151, aqiHigh: 200, concLow: 14211, concHigh: 17620 }, // 12.5-15.4 ppm * 1145
    { aqiLow: 201, aqiHigh: 300, concLow: 17621, concHigh: 34800 }, // 15.5-30.4 ppm * 1145
    { aqiLow: 301, aqiHigh: 500, concLow: 34801, concHigh: 57500 }, // 30.5-50.4 ppm * 1145
];

// SO2 (μg/m³) - 1-hour average
// EPA uses ppb: 1 ppb SO2 ≈ 2.62 μg/m³
const SO2_BREAKPOINTS = [
    { aqiLow: 0, aqiHigh: 50, concLow: 0, concHigh: 93 }, // 0-35 ppb * 2.66
    { aqiLow: 51, aqiHigh: 100, concLow: 94, concHigh: 199 }, // 36-75 ppb * 2.66
    { aqiLow: 101, aqiHigh: 150, concLow: 200, concHigh: 486 }, // 76-185 ppb * 2.66
    { aqiLow: 151, aqiHigh: 200, concLow: 487, concHigh: 797 }, // 186-304 ppb * 2.66
    { aqiLow: 201, aqiHigh: 300, concLow: 798, concHigh: 1583 }, // 305-604 ppb * 2.66
    { aqiLow: 301, aqiHigh: 500, concLow: 1584, concHigh: 2630 }, // 605-1004 ppb * 2.66
];

// NO2 (μg/m³) - 1-hour average
// EPA uses ppb: 1 ppb NO2 ≈ 1.88 μg/m³
const NO2_BREAKPOINTS = [
    { aqiLow: 0, aqiHigh: 50, concLow: 0, concHigh: 100 }, // 0-53 ppb * 1.88
    { aqiLow: 51, aqiHigh: 100, concLow: 101, concHigh: 188 }, // 54-100 ppb * 1.88
    { aqiLow: 101, aqiHigh: 150, concLow: 189, concHigh: 677 }, // 101-360 ppb * 1.88
    { aqiLow: 151, aqiHigh: 200, concLow: 678, concHigh: 1221 }, // 361-649 ppb * 1.88
    { aqiLow: 201, aqiHigh: 300, concLow: 1222, concHigh: 2350 }, // 650-1249 ppb * 1.88
    { aqiLow: 301, aqiHigh: 500, concLow: 2351, concHigh: 3853 }, // 1250-2049 ppb * 1.88
];

interface Breakpoint {
    aqiLow: number;
    aqiHigh: number;
    concLow: number;
    concHigh: number;
}

/**
 * Calculate AQI for a single pollutant using linear interpolation
 */
function calculatePollutantAQI(concentration: number, breakpoints: Breakpoint[]): number {
    // Find the appropriate breakpoint range
    for (const bp of breakpoints) {
        if (concentration >= bp.concLow && concentration <= bp.concHigh) {
            // Linear interpolation formula:
            // AQI = ((AQI_high - AQI_low) / (Conc_high - Conc_low)) * (Conc - Conc_low) + AQI_low
            const aqi =
                ((bp.aqiHigh - bp.aqiLow) / (bp.concHigh - bp.concLow)) *
                    (concentration - bp.concLow) +
                bp.aqiLow;
            return Math.round(aqi);
        }
    }

    // If concentration is above the highest breakpoint, cap at 500
    const lastBreakpoint = breakpoints[breakpoints.length - 1];
    if (concentration > lastBreakpoint.concHigh) {
        return 500;
    }

    // If concentration is negative or invalid
    return 0;
}

export interface AQIPollutantComponents {
    co: number; // Carbon Monoxide in μg/m³
    no2: number; // Nitrogen Dioxide in μg/m³
    o3: number; // Ozone in μg/m³
    so2: number; // Sulfur Dioxide in μg/m³
    pm2_5: number; // PM2.5 in μg/m³
    pm10: number; // PM10 in μg/m³
}

export interface USAQIResult {
    aqi: number;
    category: string;
    dominantPollutant: string;
    pollutantAQIs: {
        pm25: number;
        pm10: number;
        o3: number;
        co: number;
        so2: number;
        no2: number;
    };
}

/**
 * Get the AQI category based on the AQI value
 */
function getAQICategory(aqi: number): string {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
}

/**
 * Calculate the US EPA AQI from pollutant concentrations
 *
 * @param components - Pollutant concentrations from OpenWeather API
 * @returns US EPA AQI result with overall AQI, category, and individual pollutant AQIs
 */
export function calculateUSAQI(components: AQIPollutantComponents): USAQIResult {
    // Calculate individual pollutant AQIs
    const pm25AQI = calculatePollutantAQI(components.pm2_5, PM25_BREAKPOINTS);
    const pm10AQI = calculatePollutantAQI(components.pm10, PM10_BREAKPOINTS);
    const o3AQI = calculatePollutantAQI(components.o3, O3_BREAKPOINTS);
    const coAQI = calculatePollutantAQI(components.co, CO_BREAKPOINTS);
    const so2AQI = calculatePollutantAQI(components.so2, SO2_BREAKPOINTS);
    const no2AQI = calculatePollutantAQI(components.no2, NO2_BREAKPOINTS);

    const pollutantAQIs = {
        pm25: pm25AQI,
        pm10: pm10AQI,
        o3: o3AQI,
        co: coAQI,
        so2: so2AQI,
        no2: no2AQI,
    };

    // Find the dominant pollutant (highest AQI)
    const pollutants = [
        { name: 'PM2.5', aqi: pm25AQI },
        { name: 'PM10', aqi: pm10AQI },
        { name: 'Ozone', aqi: o3AQI },
        { name: 'CO', aqi: coAQI },
        { name: 'SO2', aqi: so2AQI },
        { name: 'NO2', aqi: no2AQI },
    ];

    const dominant = pollutants.reduce((max, p) => (p.aqi > max.aqi ? p : max), pollutants[0]);

    return {
        aqi: dominant.aqi,
        category: getAQICategory(dominant.aqi),
        dominantPollutant: dominant.name,
        pollutantAQIs,
    };
}
