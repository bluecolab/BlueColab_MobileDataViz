/**
 * Unit conversion utilities for water quality parameters
 * Converts various units to standardized "parts per thousand" format as used in Grafana
 */

export interface UnitConversion {
    originalValue: number;
    convertedValue: number;
    originalUnit: string;
    convertedUnit: string;
    parameter: string;
}

/**
 * Convert PSU (Practical Salinity Units) to ppt (parts per thousand)
 * PSU ≈ ppt for practical purposes in water quality monitoring
 */
export const convertPSUtoPPT = (value: number): number => {
    return value; // PSU and ppt are approximately equivalent
};

/**
 * Convert µS/cm to mS/cm for better readability in high conductivity waters
 */
export const convertConductivity = (value: number): number => {
    return value / 1000; // Convert microsiemens to millisiemens
};

/**
 * Convert FNU to NTU (both are turbidity units, approximately equivalent)
 */
export const convertFNUtoNTU = (value: number): number => {
    return value; // FNU and NTU are approximately equivalent for most practical purposes
};

/**
 * Convert temperature between Celsius and Fahrenheit
 */
export const convertTemperature = (value: number, toFahrenheit: boolean): number => {
    return toFahrenheit ? (value * 9) / 5 + 32 : ((value - 32) * 5) / 9;
};

/**
 * Main conversion function that handles all parameter conversions
 */
export const convertParameter = (
    value: number,
    parameter: string,
    originalUnit: string,
    useConvertedUnits: boolean,
    useFahrenheit?: boolean
): UnitConversion => {
    let convertedValue = value;
    let convertedUnit = originalUnit;

    if (!useConvertedUnits) {
        return {
            originalValue: value,
            convertedValue: value,
            originalUnit,
            convertedUnit: originalUnit,
            parameter,
        };
    }

    switch (parameter) {
        case 'Sal':
            if (originalUnit === 'PSU') {
                convertedValue = convertPSUtoPPT(value);
                convertedUnit = 'ppt';
            }
            break;

        case 'Cond':
            if (originalUnit === 'µS/cm') {
                convertedValue = convertConductivity(value);
                convertedUnit = 'mS/cm';
            }
            break;

        case 'Turb':
            if (originalUnit === 'FNU') {
                convertedValue = convertFNUtoNTU(value);
                convertedUnit = 'NTU';
            }
            break;

        case 'Temp':
            if (useFahrenheit && originalUnit === '°C') {
                convertedValue = convertTemperature(value, true);
                convertedUnit = '°F';
            }
            break;

        default:
            // No conversion needed for other parameters
            break;
    }

    return {
        originalValue: value,
        convertedValue,
        originalUnit,
        convertedUnit,
        parameter,
    };
};

/**
 * Get the display unit for a parameter based on conversion settings
 */
export const getDisplayUnit = (
    parameter: string,
    originalUnit: string,
    useConvertedUnits: boolean,
    useFahrenheit?: boolean
): string => {
    if (!useConvertedUnits) {
        return originalUnit;
    }

    switch (parameter) {
        case 'Sal':
            return originalUnit === 'PSU' ? 'ppt' : originalUnit;
        case 'Cond':
            return originalUnit === 'µS/cm' ? 'mS/cm' : originalUnit;
        case 'Turb':
            return originalUnit === 'FNU' ? 'NTU' : originalUnit;
        case 'Temp':
            if (useFahrenheit && originalUnit === '°C') {
                return '°F';
            }
            return originalUnit;
        default:
            return originalUnit;
    }
};