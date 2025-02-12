import React from "react";
import { VictoryChart, VictoryLabel, VictoryAxis } from "victory-native";
import { useIsDark } from "@contexts";

function EmptyGraph( {text="Loading data..."}) {
    const isDark = useIsDark();

    return (

        <VictoryChart padding={{ left: 70, top: 20, right: 50, bottom: 50 }}
        >
            <VictoryAxis
                label="Time"
                style={{
                    axis: { stroke: isDark ? "#fff" : "#000" },
                    axisLabel: { fill: isDark ? "#fff" : "#000" },
                    tickLabels: {
                        fontSize: 12, padding: 5, fill: isDark ? "#fff" : "#000",
                    }
                }}

            />
            <VictoryAxis dependentAxis
                style={{
                    axis: { stroke: isDark ? "#fff" : "#000" },
                    axisLabel: { fill: isDark ? "#fff" : "#000" },
                    tickLabels: {
                        fill: isDark ? "#fff" : "#000",
                    }
                }}
            />

            <VictoryLabel
                style={{
                    fill: isDark ? "#fff" : "#000", // Correctly setting the text color
                }}
                text={text}
                x={175}
                y={150}
                textAnchor="middle"
            />
        </VictoryChart>

    );
}

export default EmptyGraph;
