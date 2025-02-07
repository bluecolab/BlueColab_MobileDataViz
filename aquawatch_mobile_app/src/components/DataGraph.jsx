import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { VictoryChart, VictoryArea, VictoryLine, VictoryLabel, VictoryAxis } from "victory-native";
import EmptyGraph from "./EmptyGraph";
import { useIsDark } from "@contexts"
import { FontAwesome } from '@expo/vector-icons';

function DataGraph({ loading, yAxisLabel, data, unit }) {
    const isDark = useIsDark();
    let chartData = [];
    let tickValues = [];

    if (Array.isArray(data)) {
        const timestamps = data.map(({ timestamp }) => timestamp);
        const sensors = data.map(({ sensors }) => (unit == "Temp" ? (sensors[unit] * (9 / 5)) + 32 : sensors[unit]));

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
            days.push(new Date(date));
            const timestampsForDay = groupedByDay[date];
            const sensorValuesForDay = timestampsForDay.map((timestamp) => sensorMap[timestamp]);

            const total = sensorValuesForDay.reduce((sum, value) => sum + value, 0);
            averages.push(total / sensorValuesForDay.length);
            min.push(Math.min(...sensorValuesForDay));
            max.push(Math.max(...sensorValuesForDay));
        });

        chartData = days.map((day, index) => ({
            day,
            avgTmp: averages[index],
            y0: min[index],
            y: max[index],
        }));

        tickValues = days.filter((_, index) => index % 5 === 0);
    }

    return (
        <View className="flex-1 items-center justify-center mt-default">
            <View className="rounded-3xl w-[95%] bg-white dark:bg-gray-700 elevation-[5] ">
                <View className="relative mt-2">
                    <Text className="text-2xl font-bold text-center dark:text-white">
                        {yAxisLabel}
                    </Text>
                    <TouchableOpacity
                        onPress={() => console.log("Info icon clicked!", unit)}
                        className="absolute top-1 right-2"
                    >
                        <FontAwesome name="info-circle" size={24} color="grey" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <EmptyGraph />
                ) : data?.error ? (
                    <EmptyGraph text={"No Wifi, please connect to Wifi!"} />
                ) : !Array.isArray(data) ? (
                    <EmptyGraph text={"No data for location, try another."} />
                ) : (
                    <VictoryChart padding={{ left: 70, top: 20, right: 50, bottom: 50 }} >
                        <VictoryAxis
                            label="Time"
                            tickValues={tickValues}
                            tickFormat={(t) => `${t.getMonth() + 1}/${t.getDate()}`}
                            style={{
                                axis: { stroke: isDark ? "#fff" : "#000" },
                                axisLabel: { fill: isDark ? "#fff" : "#000" },
                                tickLabels: {
                                    fontSize: 12, padding: 5, fill: isDark ? "#fff" : "#000",
                                }
                            }}

                        />
                        <VictoryAxis dependentAxis label={yAxisLabel}
                            style={{
                                axis: { stroke: isDark ? "#fff" : "#000" },
                                axisLabel: { fill: isDark ? "#fff" : "#000" },
                                tickLabels: {
                                    fill: isDark ? "#fff" : "#000",
                                }
                            }}
                            axisLabelComponent={
                                <VictoryLabel dy={-20} angle={270} />
                            } />
                        <VictoryArea
                            data={chartData}
                            x="day"
                            y0="y0"
                            y="y"
                            style={{ data: { fill: isDark ? "rgba(73, 146, 255, 0.95)" : "rgba(0, 100, 255, 0.4);" } }}
                        />
                        <VictoryLine
                            data={chartData}
                            x="day"
                            y="avgTmp"
                            style={{ data: { stroke: isDark ? "rgb(0, 0, 138)" : "rgb(0, 0, 255)" } }}
                        />
                    </VictoryChart>
                )}
            </View>
        </View>
    );
}

export default DataGraph;
