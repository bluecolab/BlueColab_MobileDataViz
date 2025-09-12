import { config } from '@/hooks/useConfig';
import { ErrorType } from '@/types/error.interface';
import { CleanedWaterData, CurrentData } from '@/types/water.interface';

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

    // Uses % DO first, fallback to DO if not available
    const dissolvedOxygen =
        lastDataPoint.DOpct?.toFixed(2) ?? lastDataPoint.DO?.toFixed(2) ?? 'N/A';
    const pH = lastDataPoint.pH?.toFixed(2) ?? 'N/A';
    const conductivity = lastDataPoint.Cond?.toFixed(2) ?? 'N/A';
    const turbidity = lastDataPoint.Turb?.toFixed(2) ?? 'N/A';
    const salinity = lastDataPoint.Sal?.toFixed(2) ?? 'N/A';

    const shouldConvertTemp = defaultTempUnit
        ? defaultTempUnit.trim().toLowerCase() === 'fahrenheit'
        : false;
    const displayedTemperature = !lastDataPoint.Temp
        ? 'N/A'
        : shouldConvertTemp
          ? ((lastDataPoint.Temp * 9) / 5 + 32).toFixed(2)
          : lastDataPoint.Temp.toFixed(2);

    const waterQualityIndex: number = config.BLUE_COLAB_API_CONFIG.validMatches.includes(
        defaultLocation
    )
        ? calculateWQI(
              [
                  {
                      Cond: lastDataPoint.Cond ?? 0,
                      DOpct: lastDataPoint.DOpct ?? 0,
                      Sal: lastDataPoint.Sal ?? 0,
                      Temp: lastDataPoint.Temp ?? 0,
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
        condUnit: unitMap.Cond || '',
        do: dissolvedOxygen,
        doUnit: unitMap.DOpct || unitMap.DO || '',
        pH: pH,
        temp: displayedTemperature,
        tempUnit: !unitMap.Temp ? '' : shouldConvertTemp ? '°F' : unitMap.Temp,
        turb: turbidity,
        turbUnit: unitMap.Turb || '',
        sal: salinity,
        salUnit: unitMap.Sal || '',
        wqi: waterQualityIndex,
    };
};
