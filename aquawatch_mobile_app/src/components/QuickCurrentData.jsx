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
                // axios.get('https://colabprod01.pace.edu/api/influx/sensordata/Odin'),
            ]);
            // Reformat the data to remove nested objects
            const cleanedData1 = { ...responses[0].data, ...responses[0].data.sensors, ...responses[0].timestamp };
            delete cleanedData1.sensors;

            // const cleanedData2 = { ...responses[1].data, ...responses[1].data.sensors };
            // delete cleanedData2.sensors;
            // console.log(cleanedData1, cleanedData2)
            setData([cleanedData1]);
        } catch (err) {
            // setError('Error fetching data');
            console.error(err); // Log the error for debugging
        } finally {
            setLoading(false);
        }
    };

    // helps handle api requests
    useEffect(() => {
        fetchData();
    }, []);

    // temporary screen to show while data is loading
    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>{error}</Text>;


    // Ensure data exists before accessing properties
    if (!data) {
        return <Text>No data available</Text>;
    }

    console.log(data[0].Cond)
    console.log(data[0].DOpct)
    console.log(data[0].Sal)
    console.log(data[0].Temp)
    console.log(data[0].Turb)
    console.log(data[0].pH)
    console.log(data[0].timestamp)

    const const_doptc = 0.34 * data[0].DOpct;
    const const_ph = 0.22 * data[0].pH;
    const const_temp = 0.2 * data[0].Temp;
    const const_cond = 0.08 * data[0].Cond;
    const const_turb = 0.16 * data[0].Turb;
    const wqi = const_doptc + const_ph + const_temp + const_cond + const_turb;

    const ParamView = ({ param, name }) => {
        return (<View style={{ width: itemWidth, backgroundColor: "rgba(0, 100, 255, 0.1)" }}
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
                    colors={["#00704d", "#9fb8ab"]}
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
                        <ParamView param={((data[0].Temp * (9 / 5)) + 32).toFixed(2)} name={"Temperature"} />
                        <ParamView param={data[0].pH} name={"pH"} />
                        <ParamView param={data[0].DOpct} name={"Dissolved O2"} />
                        <ParamView param={data[0].Turb} name={"Turbidity"} />
                        <ParamView param={data[0].Cond} name={"Conductivity"} />
                        <ParamView param={data[0].Sal} name={"Salinity"} />
                        <ParamView param={wqi.toFixed(2)} name={"WQI"} />
                    </View>



                    <View>
                        <Text className="text-md text-white text-center py-4">As of {data[0].timestamp} UTC</Text>
                    </View>
                </LinearGradient>
            </View>
        </TouchableOpacity>
    );

}