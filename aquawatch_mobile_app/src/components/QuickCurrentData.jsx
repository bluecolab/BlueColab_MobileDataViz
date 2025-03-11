import React, { useState, useEffect } from 'react';
import { Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // if using Expo
import { useCurrentData } from '@contexts';
import moment from 'moment';

const Timer = ({ timestamp }) => {
    const [minutes, setMinutes] = useState(null); 

    useEffect(() => {
        if (!timestamp) return;

        const intervalId = setInterval(() => {
            const currentTime = moment();
            const timestampMoment = timestamp == 'Loading' ? moment() : moment(timestamp); 
            
            if (timestampMoment.isValid()) {
                const diffInSeconds = currentTime.diff(timestampMoment, 'seconds');
                setMinutes(diffInSeconds); 
            } else {
                console.error('Invalid timestamp', timestamp); 
                setMinutes('Invalid Timestamp');
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timestamp]); 

    return (
        <View>
            <Text className="text-md text-white text-center py-4">
                As of {minutes !== null ? `${Math.floor(minutes / 60)} minutes ago` : 'Loading...'}
            </Text>
        </View>
    );
};

export default function QuickCurrentData({ handleMiddlePress }) {
    const { data, defaultLocation, defaultTempUnit } = useCurrentData();

    const last = data[data.length - 1];
    
    const dopct = last?.DOpct?.toFixed(2) ?? 'NA';
    const ph = last?.pH?.toFixed(2) ?? 'NA';
    const temp = last?.Temp ?? 'NA';
    const convertedTemp = temp == 'NA' ? 'NA' : (defaultTempUnit ? defaultTempUnit.trim() : 'Fahrenheit') === 'Fahrenheit' ? (temp * (9 / 5) + 32)?.toFixed(2) : temp;
    const cond = last?.Cond?.toFixed(2) ?? 'NA';
    const turb = last?.Turb?.toFixed(2) ?? 'NA';
    const sal = last?.Sal?.toFixed(2) ?? 'NA';
    const timestamp = last?.timestamp ?? 'Loading';

    const const_doptc = !isNaN(dopct) ? 0.34 * dopct : 0;
    const const_ph =  !isNaN(ph) ? 0.22 * ph : 0;
    const const_temp = !isNaN(temp) ? 0.2 * temp : 0;
    const const_cond = !isNaN(cond) ? 0.08 * cond: 0;
    const const_turb = !isNaN(turb) ? 0.16 * turb: 0;
    const wqi = const_doptc + const_ph + const_temp + const_cond + const_turb;

    const ParamView = ({ param, name }) => (<View style={{ width: itemWidth }}
        className="rounded-lg flex items-center justify-center "
    >
        <Text className="text-2xl  text-white text-center">{param}</Text>
        <Text className="text-lg text-white  text-center">{name}</Text>
    </View>);
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = (screenWidth - 100) / 2; // Adjust 32px for padding/margins

    return (
        <TouchableOpacity
            onPress={handleMiddlePress}>
            <View className="px-4 pt-4">
                <LinearGradient
                    colors={['#00104d', '#3fb8ab']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={{
                        paddingTop: 4,
                        alignItems: 'center',
                        borderRadius: 20,
                    }}
                >
                    <View>
                        <Text className="text-2xl text-white font-bold text-center">Live Data Quick Look</Text>
                    </View>

                    <View className="flex flex-row flex-wrap gap-4 pt-4 items-center justify-center">
                        <ParamView param={convertedTemp} name={'Temperature'} />
                        <ParamView param={ph} name={'pH'} />
                        <ParamView param={dopct} name={'Dissolved O2'} />
                        <ParamView param={turb} name={'Turbidity'} />
                        <ParamView param={cond} name={'Conductivity'} />
                        <ParamView param={sal} name={'Salinity'} />
                        {defaultLocation == 'Choate Pond' ?
                            <ParamView param={
                                !isNaN(wqi) ? wqi?.toFixed(2) : 'NA'} name={'WQI'} /> : <></>}
                    </View>

                    <Timer timestamp={timestamp} />
                </LinearGradient>
            </View>
        </TouchableOpacity>
    );

}
