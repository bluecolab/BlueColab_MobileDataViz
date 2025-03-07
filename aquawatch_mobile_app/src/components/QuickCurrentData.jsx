import React, { useState, useEffect } from 'react';
import { Text, View, Dimensions, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient'; // if using Expo
import { useCurrentData } from "@contexts";
import moment from "moment";


const Timer = ({ timestamp }) => {
    const [minutes, setMinutes] = useState(null); 

    useEffect(() => {
        if (!timestamp) return;

        const intervalId = setInterval(() => {
            const currentTime = moment();
            const timestampMoment = moment(timestamp); 
            
            if (timestampMoment.isValid()) {
                const diffInSeconds = currentTime.diff(timestampMoment, 'seconds');
                setMinutes(diffInSeconds); 
            } else {
                console.error("Invalid timestamp", timestamp); 
                setMinutes("Invalid Timestamp");
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

    const last = data[data.length - 1]

    const dopct = last?.DOpct ?? 0;
    const ph = last?.pH ?? 0;
    const temp = last?.Temp ?? 0;
    const cond = last?.Cond ?? 0;
    const turb = last?.Turb ?? 0;
    const sal = last?.Sal ?? 0;
    const timestamp = last?.timestamp ?? "Loading";

    const const_doptc = 0.34 * dopct;
    const const_ph = 0.22 * ph;
    const const_temp = 0.2 * temp;
    const const_cond = 0.08 * cond;
    const const_turb = 0.16 * turb;
    const wqi = const_doptc + const_ph + const_temp + const_cond + const_turb;

    const ParamView = ({ param, name }) => {
        return (<View style={{ width: itemWidth }}
            className="rounded-lg flex items-center justify-center "
        >
            <Text className="text-2xl  text-white text-center">{param}</Text>
            <Text className="text-lg text-white  text-center">{name}</Text>
        </View>)
    }
    const screenWidth = Dimensions.get("window").width;
    const itemWidth = (screenWidth - 100) / 2; // Adjust 32px for padding/margins

    return (
        <TouchableOpacity
            onPress={handleMiddlePress}>
            <View className="px-4 pt-4">
                <LinearGradient
                    colors={["#00104d", "#3fb8ab"]}
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
                        <ParamView param={(defaultTempUnit ? defaultTempUnit.trim() : "Fahrenheit") === 'Fahrenheit' ? temp * (9 / 5) + 32 : temp} name={"Temperature"} />
                        <ParamView param={ph} name={"pH"} />
                        <ParamView param={dopct} name={"Dissolved O2"} />
                        <ParamView param={turb} name={"Turbidity"} />
                        <ParamView param={cond} name={"Conductivity"} />
                        <ParamView param={sal} name={"Salinity"} />
                        {defaultLocation == "Choate Pond" ?
                            <ParamView param={wqi.toFixed(2)} name={"WQI"} /> : <></>}
                    </View>

                    <Timer timestamp={timestamp} />
                </LinearGradient>
            </View>
        </TouchableOpacity>
    );

}



