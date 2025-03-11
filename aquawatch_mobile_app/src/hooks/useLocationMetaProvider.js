import parameterInfo from './jsons/parameterInfo.json';
import stationIds from './jsons/stationIds.json';
import usgsParameterMappings from './jsons/usgsParameterMapping.json';
import locationOptions from './jsons/locationOptions.json';

export default function useLocationMetaProvider() {   

    return {
        parameterInfo,
        stationIds,
        usgsParameterMappings,
        locationOptions,
    };
}
