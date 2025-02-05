import React, { useEffect, useState } from 'react';
import {
  LineChart,
} from "react-native-chart-kit";
import {
  View,
  Text,
  Dimensions
} from "react-native";
import axios from 'axios';

export default function Graph() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Example of making a GET request with Axios
    axios
      .get('https://colabprod01.pace.edu/api/influx/sensordata/Alan/delta?days=30')
      .then((response) => {
        setData(response.data); // Set data from the response
        setLoading(false); // Turn off the loading state
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  } else {
    console.log(data.length)
  }

  const timestamps = data.map((data) => {
    return data.timestamp
  })

  const sensors = data.map((data) => {
    return data.sensors['Temp']
  })

  // Step 1: Convert timestamps to Date objects and extract just the date part (without the time).
  const groupedByDay = timestamps.reduce((acc, timestamp) => {
    const date = new Date(timestamp);
    const day = date.toISOString().split('T')[0];  // Get the date in YYYY-MM-DD format
    console.log(day)
    // Step 2: Group them by date
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(timestamp);

    return acc;
  }, {});

  const days = [];
  const sonds = [];
  Object.keys(groupedByDay).forEach(date => {
    console.log(`Date: ${date}`);
    days.push(date)
    const arr = groupedByDay[date];
    let total = 0;
    let index = 0;
    arr.forEach( (cutaways) => {
      total += sensors[timestamps.findIndex((time) => time== cutaways)];
      index++;
    })   
    sonds.push(total/index);
  });

  console.log(
    days,
    sonds
  )

  return (
    <View>
      <Text>Bezier Line Chart</Text>
      <LineChart
        data={{
          labels: days,
          datasets: [
            {
              data: sonds
            }
          ]
        }}
        width={Dimensions.get("window").width} // from react-native
        height={400}
        // yAxisLabel="$"
        // yAxisSuffix="k"
        yAxisInterval={1} // optional, defaults to 1
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