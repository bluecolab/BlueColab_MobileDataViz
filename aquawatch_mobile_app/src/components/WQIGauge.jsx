import React from "react";
import { VictoryPie, VictoryLabel, VictoryChart, VictoryAxis } from "victory-native";
import { useIsDark } from '@contexts';


const WQIGauge = ({ score = 0, size = 200 }) => {
  const isDark = useIsDark();

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
      text={`${percentage}%`}
      x={size / 2}  // Center X position
      y={size / 2}  // Center Y position
      textAnchor="middle"
      style={{ fontSize: 32, fontWeight: "bold", fill: isDark ? "#fff" : "#000" }} // Customize the label style
    />
  </VictoryChart>
  );
};

export default WQIGauge;