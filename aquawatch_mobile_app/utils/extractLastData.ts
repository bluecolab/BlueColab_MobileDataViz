import { config } from '@/hooks/useConfig';
import { ErrorType } from '@/types/error.interface';
import { CleanedWaterData, CurrentData } from '@/types/water.interface';

import dataUtils from './dataUtils';
import getMetadata from './getMetadata';

// Conversion helpers
function uscmToPpt(uscm: number): number {
    // µS/cm to ppt: multiply by 0.00055
    return uscm * 0.00055;
}
function fnuToNtu(fnu: number): number {
    // FNU to NTU: 1:1 for most practical purposes
    return fnu;
}
function psuToPpt(psu: number): number {
    // PSU to ppt: 1:1 for Hudson
    return psu;
}

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

export function extractLastData(
    data: CleanedWaterData[] | undefined,
    defaultLocation: string | undefined,
    defaultTempUnit: string | undefined,
    loading: boolean,
    error: ErrorType | undefined,
    showConvertedUnits?: boolean
): CurrentData {
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
    let conductivity = lastDataPoint.Cond?.toFixed(2) ?? 'N/A';
    let turbidity = lastDataPoint.Turb?.toFixed(2) ?? 'N/A';
    let salinity = lastDataPoint.Sal?.toFixed(2) ?? 'N/A';
    let condUnit = unitMap.Cond || '';
    let turbUnit = unitMap.Turb || '';
    let salUnit = unitMap.Sal || '';

    // Conversion logic based on the location's unit map (not hardcoded names)
    if (showConvertedUnits) {
        // Cond: µS/cm -> ppt
        if (unitMap.Cond === 'µS/cm') {
            if (lastDataPoint.Cond !== undefined && lastDataPoint.Cond !== null) {
                conductivity = uscmToPpt(lastDataPoint.Cond).toFixed(3);
            }
            condUnit = 'ppt';
        }
        // Turb: FNU -> NTU
        if (unitMap.Turb === 'FNU') {
            if (lastDataPoint.Turb !== undefined && lastDataPoint.Turb !== null) {
                turbidity = fnuToNtu(lastDataPoint.Turb).toFixed(2);
            }
            turbUnit = 'NTU';
        }
        // Sal: PSU -> ppt
        if (unitMap.Sal === 'PSU') {
            if (lastDataPoint.Sal !== undefined && lastDataPoint.Sal !== null) {
                salinity = psuToPpt(lastDataPoint.Sal).toFixed(2);
            }
            salUnit = 'ppt';
        }
    }

    const shouldConvertTemp = defaultTempUnit
        ? defaultTempUnit.trim().toLowerCase() === 'fahrenheit'
        : false;
    const displayedTemperature = !lastDataPoint.Temp
        ? 'N/A'
        : shouldConvertTemp
          ? ((lastDataPoint.Temp * 9) / 5 + 32).toFixed(2)
          : lastDataPoint.Temp.toFixed(2);

    // For Choate Pond, always use original units for WQI, regardless of toggle
    let wqiCond = lastDataPoint.Cond ?? 0;
    let wqiDOpct = lastDataPoint.DOpct ?? 0;
    let wqiSal = lastDataPoint.Sal ?? 0;
    let wqiTemp = lastDataPoint.Temp ?? 0;
    let wqiTurb = lastDataPoint.Turb ?? 0;
    let wqiPh = lastDataPoint.pH ?? 0;

    // WQI uses original units for all locations. For Choate Pond this is required; for others we also keep originals.

    const waterQualityIndex: number = config.BLUE_COLAB_API_CONFIG.validMatches.includes(
        defaultLocation
    )
        ? calculateWQI(
              [
                  {
                      Cond: wqiCond,
                      DOpct: wqiDOpct,
                      Sal: wqiSal,
                      Temp: wqiTemp,
                      Turb: wqiTurb,
                      pH: wqiPh,
                  },
              ],
              false
          )
        : -9999;

    return {
        timestamp: lastDataPoint.timestamp || 'Loading...',
        cond: conductivity,
        condUnit: condUnit,
        do: dissolvedOxygen,
        doUnit: unitMap.DOpct || unitMap.DO || '',
        pH: pH,
        temp: displayedTemperature,
        tempUnit: !unitMap.Temp ? '' : shouldConvertTemp ? '°F' : unitMap.Temp,
        turb: turbidity,
        turbUnit: turbUnit,
        sal: salinity,
        salUnit: salUnit,
        wqi: waterQualityIndex,
    };
}
