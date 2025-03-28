import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import axios from 'axios';
import { useCurrentData } from '@contexts';
import { useLocationMetaProvider } from '@hooks';

// you can see this page by going to the home page of the app
// scroll all the way down
// then click on the very last card 

function CurrentData() {
    const { data, defaultLocation, defaultTempUnit, loading } = useCurrentData();
    const { units } = useLocationMetaProvider();

    const last = data[data.length - 1];


    // temporary screen to show while data is loading
    if (loading) return <Text>Loading...</Text>;

    // Ensure data exists before accessing properties
    if (data.length === 0) {
        return <Text>No data available</Text>;
    }

    const adaData = last;
    const adaTimestamp = adaData.timestamp;
    const temp = last?.Temp ?? 'NA';
    const waterTemp = temp === 'NA' ? 'NA' : (defaultTempUnit ? defaultTempUnit.trim() : 'Fahrenheit') === 'Fahrenheit' ? (temp * (9 / 5) + 32)?.toFixed(2) : temp;
    const cond = adaData.Cond;
    const dOpct = adaData.DOpct;
    const sal = adaData.Sal;
    const pH = adaData.pH;
    const turb = adaData.Turb;

    const Widget = ({ name, value } ) => (
        <View className="w-1/2 p-4">
            <View className="p-6 h-[120px] bg-blue-100 rounded-3xl flex items-center justify-center"> 
                {/*Flexbox for centering content horizontally and vertically.*/}
                <View className="text-center">
                    <Text className="text-center text-md font-bold">{name}</Text>
                    <Text className="text-center text-base">{value}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <ScrollView className="bg-defaultbackground dark:bg-defaultdarkbackground">
            <View>
                <Text className="text-center text-2xl font-bold dark:text-white">{defaultLocation} Data</Text>
            </View>
            <View className="flex flex-row flex-wrap">
  
                <Widget name="Water Temperature" value={waterTemp.toFixed(2)}/>

                <Widget name="Conductivity" value={cond.toFixed(2)}/>

                <Widget name="Salinity" value={sal.toFixed(2)}/>

                <Widget name="pH" value={pH.toFixed(2)}/>

                <Widget name="Turbidity" value={turb.toFixed(2)}/>

                <Widget name="Oxygen" value={dOpct.toFixed(2)}/>
  
            </View>
        </ScrollView>

    );

}

export default CurrentData;
