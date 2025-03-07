import React, { useRef, useState } from 'react';
import { VictoryPie, VictoryLabel, VictoryChart, VictoryAxis } from 'victory-native';
import { useIsDark } from '@contexts';
import { View, Text, Animated, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import LinkComp from './LinkComp';

// Average sensors function - updated for flattened structure
const averageSensors = (data) => data.reduce((acc, { Cond, DOpct, Sal, Temp, Turb, pH }) => {
  acc.Cond = (acc.Cond || 0) + Cond;
  acc.DOpct = (acc.DOpct || 0) + DOpct;
  acc.Sal = (acc.Sal || 0) + Sal;
  acc.Temp = (acc.Temp || 0) + Temp;
  acc.Turb = (acc.Turb || 0) + Turb;
  acc.pH = (acc.pH || 0) + pH;
  return acc;
}, {});

const WQIGauge = ({ loading, data, size = 200 }) => {
  const { width } = Dimensions.get('window');
  const containerWidth = width * 0.95;
  const { isDark }  = useIsDark();
  const flipAnimation = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  const startAnimation = () => {
    Animated.timing(flipAnimation, {
      toValue: flipped ? 0 : 1,
      duration: 500,
      useNativeDriver: true, // RotateY doesn't support native driver
    }).start(() => setFlipped(!flipped));
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

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
    for (const sensor in sensorAverages) {
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
  if (percentage >= 0 && percentage < 25) color = 'darkred';
  else if (percentage >= 25 && percentage < 50) color = 'darkorange';
  else if (percentage >= 50 && percentage < 70) color = 'yellow';
  else if (percentage >= 70 && percentage < 90) color = 'green';
  else if (percentage >= 90 && percentage <= 100) color = 'darkgreen';

  return (
    <View style={{ width, marginTop: 10 }}>
      <View className="elevation-[5]">
        {/* Title Bar */}
        <View className="w-[95%] self-center">
          <Text className="text-3xl bg-white dark:bg-gray-700 rounded-3xl font-bold text-center dark:text-white p-1">
            WQI
          </Text>
          <TouchableOpacity className="absolute top-1 right-2" onPress={startAnimation}>
            <FontAwesome name="info-circle" size={32} color={isDark ? 'white' : 'grey'} />
          </TouchableOpacity>
        </View>

        {/* Graph Container */}
        <View className="self-center z-10">
          <View className="h-[250]">
            {/* Front View - Graph */}
            <Animated.View
              style={
                {
                  marginTop: 5,
                  height: '100%',
                  width: containerWidth,
                  position: 'absolute',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  backfaceVisibility: 'hidden',
                  transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
                }}
            >
              <View className="rounded-3xl bg-white elevation-[5] p-default  flex-1 justify-center items-center dark:bg-gray-700 ">
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
                      { x: 'Completed', y: percentage },
                      { x: 'Remaining', y: 100 - percentage },
                    ]}
                    colorScale={[color, '#E0E0E0']}
                    labels={() => null}
                  />
                  {/* Label in the center */}
                  <VictoryLabel
                    text={loading ? 'NA' : `${percentage}%`}
                    x={size / 2}  // Center X position
                    y={size / 2}  // Center Y position
                    textAnchor="middle"
                    style={{ fontSize: 32, fontWeight: 'bold', fill: isDark ? '#fff' : '#000' }} // Customize the label style
                  />
                </VictoryChart>
              </View>
            </Animated.View>

            {/* Back View - Information Card */}
            <Animated.View
              style={
                {
                  marginTop: 5,
                  height: '100%',
                  width: containerWidth,
                  position: 'absolute',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  backfaceVisibility: 'hidden',
                  transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
                }
              }
              pointerEvents={flipped ? 'auto' : 'none'}

            >
              <ScrollView className="bg-white dark:bg-gray-700 rounded-3xl p-4 h-full">

                <Text className="text-lg font-semibold dark:text-white">
                  What is WQI?
                </Text>
                <Text className="text-md dark:text-gray-300">
                  WQI - water quality index - is a score that expresses the overall quality of water. It serves as a single, comprehensive indicator of the quality of water. The score ranges from 0 to 100.
                </Text>

                <Text className="text-lg font-semibold dark:text-white">
                  Methodology
                </Text>
                <Text className="text-md dark:text-gray-300">
                  The WQI for Choate Pond is calculated based on temperature, dissolved oxygen, pH, turbidity, and salinity. We then multiply each parameter by an assigned weight. Finally the product of each calculation is summed.
                </Text>

                <Text className="text-lg font-semibold dark:text-white">
                  References
                </Text>
                <LinkComp url={'https://bluecolab.pace.edu/water-quality-index-dashboard-2/'} label={'Learn More'}/>
                <Text></Text>
              </ScrollView>

            </Animated.View>
          </View>
        </View>
      </View>
    </View>

  );
};

export default WQIGauge;
