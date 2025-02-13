import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';

function CurrentData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;

  // Ensure data exists before accessing properties
  if (data.length === 0) {
    return <Text>No data available</Text>;
  }

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
    <ScrollView>
        <Text>Water Temp: {waterTemp}</Text>
     </ScrollView>
  );
}


export default CurrentData;
