import React, { useState, useEffect } from "react";
import { Text, View, Dimensions, TouchableOpacity } from "react-native";
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient'; // if using Expo

export default function QuickCurrentData() {
    // useState, a way to keep track of states (the values of variables)
    const [data, setData] = useState([]); // (1) data is the variable (2) setData is how to set the variable (3) useState([]), set's the data to [] initially 
    // data stores the response from the API
    const [loading, setLoading] = useState(true); // loading is a way to track if API has loaded or not 
    const [error, setError] = useState(null);

    // you can ignore this for now but, this is how we get data
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const responses = await Promise.all([
                axios.get('https://colabprod01.pace.edu/api/influx/sensordata/Ada'),
            ]);
            // Reformat the data to remove nested objects
            const cleanedData1 = { ...responses[0].data, ...responses[0].data.sensors, ...responses[0].timestamp };
            delete cleanedData1.sensors;

            setData([cleanedData1]);
        } catch (err) {
            console.error(err); // Log the error for debugging
        } finally {
            setLoading(false);
        }
    };

    // helps handle api requests
    useEffect(() => {
        fetchData();
    }, []);
    if (error) return <Text>{error}</Text>;


    // Ensure data exists before accessing properties
    if (!data) {
        return <Text>No data available</Text>;
    }

    const dopct = data[0]?.DOpct ?? 0;
    const ph = data[0]?.pH ?? 0;
    const temp = data[0]?.Temp ?? 0;
    const cond = data[0]?.Cond ?? 0;
    const turb = data[0]?.Turb ?? 0;
    const sal = data[0]?.Sal ?? 0;

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
            onPress={()=>console.log("Hello")}>
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
                        <ParamView param={((temp * (9 / 5)) + 32).toFixed(2)} name={"Temperature"} />
                        <ParamView param={ph} name={"pH"} />
                        <ParamView param={dopct} name={"Dissolved O2"} />
                        <ParamView param={turb} name={"Turbidity"} />
                        <ParamView param={cond} name={"Conductivity"} />
                        <ParamView param={sal} name={"Salinity"} />
                        <ParamView param={wqi.toFixed(2)} name={"WQI"} />
                    </View>



                    <View>
                        <Text className="text-md text-white text-center py-4">As of {data[0]?.timestamp ?? "Loading"} UTC</Text>
                    </View>
                </LinearGradient>
            </View>
        </TouchableOpacity>
    );

}