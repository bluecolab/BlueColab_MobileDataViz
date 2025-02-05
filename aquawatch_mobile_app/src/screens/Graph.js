import React, { useEffect, useState } from 'react';
import { LineChart } from "react-native-chart-kit";
import { View, Text, Dimensions } from "react-native";
import axios from 'axios';

export default function Graph() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('https://colabprod01.pace.edu/api/influx/sensordata/Alan/delta?days=30')
      .then((response) => {
        setData(response.data); 
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setData({ error: 'Failed to load data' });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (data?.error) {
    return <Text>{data.error}</Text>;
  }

  if (!Array.isArray(data)) {
    return <Text>Invalid data format</Text>;
  }

  const timestamps = data.map(({ timestamp }) => timestamp);
  const sensors = data.map(({ sensors }) => sensors['Temp']);

  // Create a mapping from timestamp to sensor value
  const sensorMap = timestamps.reduce((acc, timestamp, index) => {
    acc[timestamp] = sensors[index];
    return acc;
  }, {});

  // Group data by day and calculate daily average
  const groupedByDay = timestamps.reduce((acc, timestamp) => {
    const day = new Date(timestamp).toISOString().split('T')[0];
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(timestamp);
    return acc;
  }, {});

  const days = [];
  const averages = [];

  Object.keys(groupedByDay).forEach((date) => {
    days.push(date);
    const timestampsForDay = groupedByDay[date];
    const total = timestampsForDay.reduce((sum, timestamp) => sum + sensorMap[timestamp], 0);
    averages.push(total / timestampsForDay.length);
  });

  return (
    <View>
      <Text>Temperature Over Time</Text>
      <LineChart
        data={{
          labels: days,
          datasets: [{ data: averages }]
        }}
        width={Dimensions.get("window").width} // from react-native
        height={400}
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#ffa726"
          }
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
      />
    </View>
  );
}
