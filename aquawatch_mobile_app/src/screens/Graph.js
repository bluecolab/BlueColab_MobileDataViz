import React, { useEffect, useState } from 'react';
import { View, Text } from "react-native";
import { CartesianChart, Line } from "victory-native";
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

  // Extract timestamps and sensor data
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

  // Prepare the data for the chart in the format required by Victory
  const chartData = days.map((day, index) => ({
    day,         // The x-axis (dates)
    highTmp: averages[index], // The y-axis (averages)
  }));

  return (
    <View style={{ height: 400 }}>
      <CartesianChart data={chartData} xKey="day" yKeys={["highTmp"]}>
        {({ points }) => (
          <Line points={points.highTmp} color="blue" strokeWidth={3} />
        )}
      </CartesianChart>
    </View>
  );
}
