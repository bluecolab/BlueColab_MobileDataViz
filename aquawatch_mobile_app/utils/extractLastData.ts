import { config } from '@/hooks/useConfig';
import { ErrorType } from '@/types/error.interface';
import { CleanedWaterData, CurrentData } from '@/types/water.interface';
import { convertParameter, getDisplayUnit } from '@/utils/unitConversions';

import dataUtils from './dataUtils';
import getMetadata from './getMetadata';

const currentDataErrorObject: CurrentData = {
    timestamp: 'Loading...',
    cond: 'N/A',
    condUnit: '',
    do: 'N/A',
    doUnit: '',
    pH: 'NA',
    temp: 'N/A',
    tempUnit: '',
    turb: 'N/A',
    turbUnit: '',
    sal: 'N/A',
    salUnit: '',
    wqi: 'N/A',
};

export const extractLastData = (
    data: CleanedWaterData[] | undefined,
    defaultLocation: string | undefined,
    defaultTempUnit: string | undefined,
    defaultUnitConversion: boolean | undefined,
    loading: boolean,
    error: ErrorType | undefined
): CurrentData => {
    const { units } = getMetadata();
    const { calculateWQI } = dataUtils();

    if (
        (defaultLocation && !Object.prototype.hasOwnProperty.call(units, defaultLocation)) ||
        !defaultLocation ||
        error
    ) {
        return currentDataErrorObject;
    }

    const unitMap = units[defaultLocation as keyof typeof units];

    if (!data || data.length < 1 || loading) {
        return currentDataErrorObject;
    }

    const lastDataPoint = data[data.length - 1];

    // Determine if we should use converted units (but never for WQI calculation at Choate Pond)
    const useConvertedUnits = defaultUnitConversion ?? false;
    const useFahrenheit = defaultTempUnit?.trim().toLowerCase() === 'fahrenheit';

    // Extract base values
    const baseDissolvedOxygen = lastDataPoint.DOpct ?? lastDataPoint.DO ?? null;
    const basePH = lastDataPoint.pH ?? null;
    const baseConductivity = lastDataPoint.Cond ?? null;
    const baseTurbidity = lastDataPoint.Turb ?? null;
    const baseSalinity = lastDataPoint.Sal ?? null;
    const baseTemperature = lastDataPoint.Temp ?? null;

    // Apply conversions for display (but keep original values for WQI calculation)
    const dissolvedOxygenConversion = baseDissolvedOxygen !== null ? 
        convertParameter(baseDissolvedOxygen, 'DOpct', unitMap.DOpct || unitMap.DO || '', useConvertedUnits, useFahrenheit) : null;
    const pHConversion = basePH !== null ? 
        convertParameter(basePH, 'pH', '', useConvertedUnits, useFahrenheit) : null;
    const conductivityConversion = baseConductivity !== null ? 
        convertParameter(baseConductivity, 'Cond', unitMap.Cond || '', useConvertedUnits, useFahrenheit) : null;
    const turbidityConversion = baseTurbidity !== null ? 
        convertParameter(baseTurbidity, 'Turb', unitMap.Turb || '', useConvertedUnits, useFahrenheit) : null;
    const salinityConversion = baseSalinity !== null ? 
        convertParameter(baseSalinity, 'Sal', unitMap.Sal || '', useConvertedUnits, useFahrenheit) : null;
    const temperatureConversion = baseTemperature !== null ? 
        convertParameter(baseTemperature, 'Temp', unitMap.Temp || '', useConvertedUnits, useFahrenheit) : null;

    // Format display values
    const dissolvedOxygen = dissolvedOxygenConversion?.convertedValue.toFixed(2) ?? 'N/A';
    const pH = pHConversion?.convertedValue.toFixed(2) ?? 'N/A';
    const conductivity = conductivityConversion?.convertedValue.toFixed(2) ?? 'N/A';
    const turbidity = turbidityConversion?.convertedValue.toFixed(2) ?? 'N/A';
    const salinity = salinityConversion?.convertedValue.toFixed(2) ?? 'N/A';
    const displayedTemperature = temperatureConversion?.convertedValue.toFixed(2) ?? 'N/A';

    // WQI calculation - ALWAYS use original units for Choate Pond (as specified in requirements)
    const waterQualityIndex: number = config.BLUE_COLAB_API_CONFIG.validMatches.includes(
        defaultLocation
    )
        ? calculateWQI(
              [
                  {
                      Cond: lastDataPoint.Cond ?? 0,
                      DOpct: lastDataPoint.DOpct ?? 0,
                      Sal: lastDataPoint.Sal ?? 0,
                      Temp: lastDataPoint.Temp ?? 0, // Always use original temperature for WQI
                      Turb: lastDataPoint.Turb ?? 0,
                      pH: lastDataPoint.pH ?? 0,
                  },
              ],
              false
          )
        : -9999;

    return {
        timestamp: lastDataPoint.timestamp || 'Loading...',
        cond: conductivity,
        condUnit: getDisplayUnit('Cond', unitMap.Cond || '', useConvertedUnits, useFahrenheit),
        do: dissolvedOxygen,
        doUnit: getDisplayUnit('DOpct', unitMap.DOpct || unitMap.DO || '', useConvertedUnits, useFahrenheit),
        pH: pH,
        temp: displayedTemperature,
        tempUnit: getDisplayUnit('Temp', unitMap.Temp || '', useConvertedUnits, useFahrenheit),
        turb: turbidity,
        turbUnit: getDisplayUnit('Turb', unitMap.Turb || '', useConvertedUnits, useFahrenheit),
        sal: salinity,
        salUnit: getDisplayUnit('Sal', unitMap.Sal || '', useConvertedUnits, useFahrenheit),
        wqi: waterQualityIndex,
    };
};
