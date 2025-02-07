import React, { useState } from "react";
import { View, Text,  } from "react-native";
import { VictoryChart, VictoryArea, VictoryLine, VictoryLabel, VictoryAxis } from "victory-native";
import {  EmptyGraph } from '@components';
import { useIsDark } from '@contexts';

function DataGraph() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const isDark = useIsDark();

    let chartData = [];
    let tickValues = [];
    let yAxisLabel = "Temperature";

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
        <>
            <View className="rounded-3xl bg-white dark:bg-gray-700  elevation-[5]">
                <Text className="text-2xl font-bold text-center dark:text-white">
                    {yAxisLabel}
                </Text>
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
                                axis: { stroke: isDark ? '#fff' : "#000" },
                                axisLabel: { fill: isDark ? '#fff' : "#000" },
                                tickLabels: {
                                    fontSize: 12, padding: 5, fill: isDark ? '#fff' : "#000",
                                }
                            }}

                        />
                        <VictoryAxis dependentAxis label={yAxisLabel}
                            style={{
                                axis: { stroke: isDark ? '#fff' : "#000" },
                                axisLabel: { fill: isDark ? '#fff' : "#000" },
                                tickLabels: {
                                    fill: isDark ? '#fff' : "#000",
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
        </>
    );
}

export default Graph;
