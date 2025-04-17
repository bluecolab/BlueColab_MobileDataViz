// src/components/MyChart.tsx
import React from 'react';
import { VictoryChart, VictoryLine } from 'victory-native';
import Svg from 'react-native-svg';

const MyChart = () => {
  return (
    <Svg width="100%" height="300">
      <VictoryChart
        width={350}
        height={300}
        standalone={false} // Important for embedding in Svg
      >
        <VictoryLine
          data={[
            { x: 1, y: 2 },
            { x: 2, y: 3 },
            { x: 3, y: 5 },
            { x: 4, y: 4 },
            { x: 5, y: 6 },
          ]}
        />
      </VictoryChart>
    </Svg>
  );
};

export default MyChart;
