import React from "react";
import { VictoryPie, VictoryLabel, VictoryChart, VictoryAxis } from "victory-native";
import { useIsDark } from "@contexts";
import { View } from 'react-native';
// Average sensors function - updated for flattened structure
const averageSensors = (data) => {
  return data.reduce((acc, { Cond, DOpct, Sal, Temp, Turb, pH }) => {
    acc.Cond = (acc.Cond || 0) + Cond;
    acc.DOpct = (acc.DOpct || 0) + DOpct;
    acc.Sal = (acc.Sal || 0) + Sal;
    acc.Temp = (acc.Temp || 0) + Temp;
    acc.Turb = (acc.Turb || 0) + Turb;
    acc.pH = (acc.pH || 0) + pH;
    return acc;
  }, {});
};

const WQIGauge = ({ loading, data, size = 200 }) => {
  const isDark = useIsDark();

  let score = 0;

  if (!loading && data && data.length >= 1) {
    const const_doptc = 0.34;
    const const_ph = 0.22;
    const const_temp = 0.2;
    const const_cond = 0.08;
    const const_turb = 0.16;

    // Use the updated averageSensors function to calculate averages
    const sensorAverages = averageSensors(data);

    // Divide each total by the number of data points to get the average
    for (let sensor in sensorAverages) {
      sensorAverages[sensor] = sensorAverages[sensor] / data.length;
    }

    // Multiply the averages by respective constants
    const result = {
      DOpct: sensorAverages.DOpct * const_doptc,
      pH: sensorAverages.pH * const_ph,
      Temp: sensorAverages.Temp * const_temp,
      Cond: sensorAverages.Cond * const_cond,
      Turb: sensorAverages.Turb * const_turb,
    };

    // Sum all values in the result
    const total = Object.values(result).reduce((acc, value) => acc + value, 0);

    score = Math.round(total);
  }

  const percentage = score > 100 ? 100 : score;
  let color = "#E0E0E0";
  if (percentage >= 0 && percentage < 25) color = "darkred";
  else if (percentage >= 25 && percentage < 50) color = "darkorange";
  else if (percentage >= 50 && percentage < 70) color = "yellow";
  else if (percentage >= 70 && percentage < 90) color = "green";
  else if (percentage >= 90 && percentage <= 100) color = "darkgreen";

  return (
    <View>
      <VictoryChart width={size} height={size}>
        <VictoryAxis style={{ axis: { opacity: 0 }, tickLabels: { opacity: 0 } }} />
        <VictoryAxis dependentAxis style={{ axis: { opacity: 0 }, tickLabels: { opacity: 0 } }} />
        {/* Pie Chart */}
        <VictoryPie
          standalone={true}
          width={size}
          height={size}
          innerRadius={size / 2.5}
          cornerRadius={5}
          padAngle={1}
          data={[
            { x: "Completed", y: percentage },
            { x: "Remaining", y: 100 - percentage },
          ]}
          colorScale={[color, "#E0E0E0"]}
          labels={() => null}
        />
        {/* Label in the center */}
        <VictoryLabel
          text={loading ? "NA" : `${percentage}%`}
          x={size / 2}  // Center X position
          y={size / 2}  // Center Y position
          textAnchor="middle"
          style={{ fontSize: 32, fontWeight: "bold", fill: isDark ? "#fff" : "#000" }} // Customize the label style
        />
      </VictoryChart>
    </View>
  );
};

export default WQIGauge;
