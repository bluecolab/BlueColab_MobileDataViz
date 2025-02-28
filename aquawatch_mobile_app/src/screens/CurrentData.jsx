import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import axios from 'axios';

// you can see this page by going to the home page of the app
// scroll all the way down
// then click on the very last card 

function CurrentData() {
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
        axios.get('https://colabprod01.pace.edu/api/influx/sensordata/Alan'),
        axios.get('https://colabprod01.pace.edu/api/influx/sensordata/Odin'),
      ]);

      console.log(responses[0].data);
      
      // Reformat the data to remove nested objects
      const cleanedData1 = { ...responses[0].data, ...responses[0].data.sensors };
      delete cleanedData1.sensors;

      const cleanedData2 = { ...responses[1].data, ...responses[1].data.sensors };
      delete cleanedData2.sensors;

      setData([cleanedData1, cleanedData2]);
    } catch (err) {
      setError('Error fetching data');
      console.error(err); // Log the error for debugging
    } finally {
      setLoading(false);
    }
  };

  // helps handle api requests
  useEffect(() => {
    fetchData();
  }, []);

  // temprary screen to show while data is loading
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;

  // Ensure data exists before accessing properties
  if (data.length === 0) {
    return <Text>No data available</Text>;
  }

  // fyi - this page may not work right now
  // looks like API is down

  // Alan Data
  const alanData = data[0];
  const alanTimestamp = alanData.timestamp;
  const waterTemp = alanData.Temp * (9 / 5) + 32; // Celsius to Fahrenheit
  const cond = alanData.Cond;
  const dOpct = alanData.DOpct;
  const sal = alanData.Sal;
  const pH = alanData.pH;
  const turb = alanData.Turb;

  // Odin Data
  const odinData = data[1];
  const odinTimestamp = odinData.timestamp;
  const airTemp = odinData.AirTemp * (9 / 5) + 32; // Celsius to Fahrenheit
  const pressure = odinData.BaroPressure;
  const distLightning = odinData.DistLightning;
  const lightningStrikes = odinData.LightningStrikes;
  const maxWindSpeed = odinData.MaxWindSpeed;
  const rain = odinData.Rain;
  const relHumid = odinData.RelHumid;
  const relHumidTemp = odinData.RelHumidTemp;
  const solarFlux = odinData.SolarFlux;
  const solarTotalFlux = odinData.SolarTotalFlux;
  const tiltNS = odinData.TiltNS;
  const tiltWE = odinData.TiltWE;
  const vaporPressure = odinData.VaporPressure;
  const windDir = odinData.WindDir;
  const windSpeed = odinData.WindSpeed;

  console.log(
    {
        alanTimestamp, waterTemp, cond, dOpct, sal, pH, turb
    }
  )

  console.log(
    {
        odinTimestamp, airTemp, pressure, distLightning, lightningStrikes, maxWindSpeed, rain, relHumid, relHumidTemp, solarFlux,
        solarTotalFlux, tiltNS, tiltWE, vaporPressure, windDir, windSpeed,
    }
  )

  return (
    <ScrollView className="m-4 bg-default"> 
    <View className="flex flex-row flex-wrap">
  
      {/* Box #1 */}
      <View className="w-1/2 p-4"> 
        <View className="border border-solid p-6 min-h-[100px]">
          <Text className="text-center text-xl font-bold">Water Temperature</Text>
          <Text className="text-center text-lg">{waterTemp}</Text>
        </View>
      </View>
  
      {/* Box #2 */}
      <View className="w-1/2 p-4">
        <View className="border border-solid p-6 min-h-[100px]">
          <Text className="text-center text-xl font-bold">Conductivity</Text>
          <Text className="text-center text-lg">{cond}</Text>
        </View>
      </View>
  
      {/* Box #3 */}
      <View className="w-1/2 p-4">
        <View className="border border-solid p-6 min-h-[100px]">
          <Text className="text-center text-xl font-bold">Salinity</Text>
          <Text className="text-center text-lg">{sal}</Text>
        </View>
      </View>
  
      {/* Box #4 */}
      <View className="w-1/2 p-4">
        <View className="border border-solid p-6 min-h-[100px]">
          <Text className="text-center text-xl font-bold">pH</Text>
          <Text className="text-center text-lg">{pH}</Text>
        </View>
      </View>
  
      {/* Box #5 */}
      <View className="w-1/2 p-4">
        <View className="border border-solid p-6 min-h-[100px]">
          <Text className="text-center text-xl font-bold">Turbidity</Text>
          <Text className="text-center text-lg">{turb}</Text>
        </View>
      </View>
  
      {/* Box #6 */}
      <View className="w-1/2 p-4">
        <View className="border border-solid p-6 min-h-[100px]">
          <Text className="text-center text-xl font-bold">Oxygen</Text>
          <Text className="text-center text-lg">{dOpct}</Text>
        </View>
      </View>
  
    </View>
  </ScrollView>

  );

}


export default CurrentData;
