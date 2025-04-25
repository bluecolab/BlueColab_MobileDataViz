import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useCurrentData } from '@contexts';
// import { useLocationMetaProvider } from '@hooks';

function CurrentData() {
    const { data, defaultLocation, defaultTempUnit, loading } = useCurrentData();
    // const { units } = useLocationMetaProvider();

    const last = data[data.length - 1];

    if (loading) return <Text>Loading...</Text>;

    if (data.length === 0) {
        return <Text>No data available</Text>;
    }

    const adaData = last;
    // const adaTimestamp = adaData?.timestamp;;
    const temp = last?.Temp;
    const waterTemp = temp === 'NA' ? 'NA' : (defaultTempUnit ? defaultTempUnit.trim() : 'Fahrenheit') === 'Fahrenheit' ? (temp * (9 / 5) + 32) : temp;
    const cond = adaData?.Cond;
    const dOpct = adaData?.DOpct;
    const sal = adaData?.Sal;
    const pH = adaData?.pH;
    const turb = adaData?.Turb;

    // ✅ Status and text color logic
    const getStatusAndColor = (name, value) => {
        if (value === 'NA') return { label: 'NA', color: 'text-gray-500' };

        switch (name) {
            case 'Water Temperature':
                if (value < 77) return { label: 'Good', color: 'text-green-600' };
                else if (value < 86) return { label: 'Warning', color: 'text-yellow-600' };
                else return { label: 'Bad', color: 'text-red-600' };

            case 'Conductivity':
                if (value < 53999) return { label: 'Good', color: 'text-green-600' };
                //else if (value < 1000) return { label: 'Warning', color: 'text-yellow-600' };
                else return { label: 'Bad', color: 'text-red-600' };

            case 'Salinity':
                if (value < 4) return { label: 'Good', color: 'text-green-600' };
                else if (value < 9) return { label: 'Warning', color: 'text-yellow-600' };
                else return { label: 'Bad', color: 'text-red-600' };

            case 'pH':
                if (value < 4 || value > 11) return { label: 'Bad', color: 'text-red-600' };
                else if ((value >= 4 && value <= 10) || (value >= 9 && value <= 11)) return { label: 'Warning', color: 'text-yellow-600' };
                else if (value >= 6 && value <= 8) return { label: 'Good', color: 'text-green-600' };
                else return { label: 'Bad', color: 'text-red-600' }; // fallback just in case


            case 'Turbidity':
                if (value < 24) return { label: 'Good', color: 'text-green-600' };
                else if (value < 49) return { label: 'Warning', color: 'text-yellow-600' };
                else return { label: 'Bad', color: 'text-red-600' };

            case 'Oxygen':
                if (value >= 66 && value <= 199) return { label: 'Good', color: 'text-green-600' };
                else if ((value >= 41 && value < 65) || (value > 200 && value <= 299)) return { label: 'Warning', color: 'text-yellow-600' };
                else return { label: 'Bad', color: 'text-red-600' };

            default:
                return { label: '', color: 'text-gray-500' };
        }
    };

    // ✅ Widget with colored status label
    const Widget = ({ name, value }) => {
        const numericValue = parseFloat(value);
        const { label, color } = getStatusAndColor(name, numericValue);

        return (
            <View className="w-1/2 p-4">
                <View className="p-6 h-[120px] bg-blue-100 rounded-3xl flex items-center justify-center">
                    <View className="text-center">
                        <Text className="text-center text-md font-bold">{name}</Text>
                        <Text className="text-center text-base">{value}</Text>
                        <Text className={`text-center text-sm italic ${color}`}>{label}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <ScrollView className="bg-defaultbackground dark:bg-defaultdarkbackground">
            <View>
                <Text className="mt-7 text-center text-2xl font-bold dark:text-white">
                    {defaultLocation} Data
                </Text>
            </View>
            <View className="flex flex-row flex-wrap">
  
                <Widget name="Water Temperature" value={waterTemp?.toFixed(2) ?? "NA"}/>

                <Widget name="Conductivity" value={cond?.toFixed(2) ?? "NA"}/>

                <Widget name="Salinity" value={sal?.toFixed(2) ?? "NA"}/>

                <Widget name="pH" value={pH?.toFixed(2) ?? "NA"}/>

                <Widget name="Turbidity" value={turb?.toFixed(2) ?? "NA"}/>

                <Widget name="Oxygen" value={dOpct?.toFixed(2) ?? "NA"}/>
  
            </View>
        </ScrollView>
    );
}

export default CurrentData;
