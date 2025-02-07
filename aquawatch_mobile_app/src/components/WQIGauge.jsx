import React from "react";
import { VictoryPie, VictoryLabel, VictoryChart, VictoryAxis } from "victory-native";
import { useIsDark } from '@contexts';

// Average sensors function
const averageSensors = (data) => {
  
  return data.reduce((acc, { sensors }) => {
    Object.entries(sensors).forEach(([sensor, value]) => {
      acc[sensor] = (acc[sensor] || 0) + value;
    });
    return acc;
  }, {});
};
const WQIGauge = ({ loading, data , size = 200 }) => {
  const isDark = useIsDark();


  let score = 0;

  if (!loading) {
    const const_doptc = 0.34;
    const const_ph = 0.22;
    const const_temp = 0.2;
    const const_cond = 0.08;
    const const_turb = 0.16;

    const sensorAverages = averageSensors(data);
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
  let color = '#E0E0E0';
  if (percentage >= 0 && percentage < 25)
    color = 'darkred';
  else if (percentage >= 25 && percentage < 50)
    color = 'darkorange';
  else if (percentage >= 50 && percentage < 70)
    color = 'yellow';
  else if (percentage >= 70 && percentage < 90)
    color = 'green';
  else if (percentage >= 90 && percentage <= 100)
    color = 'darkgreen';

  return (
    
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
      text={loading ? 'NA' : `${percentage}%`}
      x={size / 2}  // Center X position
      y={size / 2}  // Center Y position
      textAnchor="middle"
      style={{ fontSize: 32, fontWeight: "bold", fill: isDark ? "#fff" : "#000" }} // Customize the label style
    />
  </VictoryChart>
  );
};

export default WQIGauge;


// try:
// doptc_value = sum(data['DOpct'])/len(data['DOpct'])
// ph_value = sum(data['pH'])/len(data['pH'])
// temp_value = sum(data['Temp'] * 9/5 + 32)/len(data['Temp'])
// cond_value = sum(data['Cond'])/len(data['Cond'])
// turb_value = sum(data['Turb'])/len(data['Turb'])
// except KeyError as e:
// print(f"KeyError: {e} was raised. This column does not exist.")
// doptc_value = 0
// ph_value = 0
// temp_value = 0
// cond_value = 0
// turb_value = 0

// def calculate_wqi(doptc: float, ph: float, temp: float, cond: float, turb: float) -> float:
//     # Constants
//     const_doptc = 0.34
//     const_ph = 0.22
//     const_temp = 0.2
//     const_cond = 0.08
//     const_turb = 0.16
//     # Calculate WQI
//     return (doptc * const_doptc) + (ph * const_ph) + (temp * const_temp) + (cond * const_cond) + (turb * const_turb)
    
// # Calculate WQI for each set of values
// wqi = calculate_wqi(doptc_value, ph_value, temp_value, cond_value, turb_value)
