import React, { useEffect, useState } from "react";
import { View, Text, ImageBackground, StyleSheet, ScrollView } from "react-native";
import { VictoryChart, VictoryArea, VictoryLine } from "victory-native";
import axios from "axios";

function Graph() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState('java');

  useEffect(() => {
    axios
      .get('https://colabprod01.pace.edu/api/influx/sensordata/Alan/delta?days=30')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setData({ error: "Failed to load data" });
      })
      .finally(() => setLoading(false));
  }, []);

  // Extract data if available and valid
  let chartData = [];
  if (Array.isArray(data)) {
    const timestamps = data.map(({ timestamp }) => timestamp);
    const sensors = data.map(({ sensors }) => (sensors["Temp"] * (9 / 5)) + 32);

    const sensorMap = timestamps.reduce((acc, timestamp, index) => {
      acc[timestamp] = sensors[index];
      return acc;
    }, {});

    const groupedByDay = timestamps.reduce((acc, timestamp) => {
      const day = new Date(timestamp).toISOString().split("T")[0];
      if (!acc[day]) acc[day] = [];
      acc[day].push(timestamp);
      return acc;
    }, {});

    const days = [];
    const averages = [];
    const min = [];
    const max = [];

    Object.keys(groupedByDay).forEach((date) => {
      days.push(date);
      const timestampsForDay = groupedByDay[date];
      const sensorValuesForDay = timestampsForDay.map((timestamp) => sensorMap[timestamp]);

      const total = sensorValuesForDay.reduce((sum, value) => sum + value, 0);
      averages.push(total / sensorValuesForDay.length);
      min.push(Math.min(...sensorValuesForDay));
      max.push(Math.max(...sensorValuesForDay));
    });

    chartData = days.map((day, index) => ({
      day: new Date(day),
      avgTmp: averages[index],
      y0: min[index],
      y: max[index],
    }));
  }

  return (
    <ScrollView
      style={styles.background}

    >

      <View
      >

        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : data?.error ? (
          <Text style={styles.errorText}>{data.error}</Text>
        ) : !Array.isArray(data) ? (
          <Text style={styles.errorText}>Invalid data format</Text>
        ) : (
          <View style={styles.chartContainer}>
            <VictoryChart>
              <VictoryArea
                data={chartData}
                x="day"
                y0="y0"
                y="y"
                style={{ data: { fill: "rgba(0, 100, 255, 0.4)" } }}
              />
              <VictoryLine
                data={chartData}
                x="day"
                y="avgTmp"
                style={{ data: { stroke: "rgba(0, 0, 255, 1)" } }}
              />
            </VictoryChart>
          </View>
        )}
        <View className="m-[10] bg-white rounded-3xl">
          <Text className='text-xl m-1 font-bold'>Options</Text>
          <Text className='m-1 pb-[32px]'>Test</Text>
        </View>
      </View>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "rgb(230, 230, 230)",
  },
  loadingText: {
    color: "black",
    textAlign: "center",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 18,
  },
  chartContainer: {
    margin: 10,
    borderRadius: 20,
    backgroundColor: "rgb(255, 255, 255)",

    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,

    // For android
    elevation: 5,
  },
});

export default Graph;
