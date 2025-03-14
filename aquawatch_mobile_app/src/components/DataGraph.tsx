import React, { useRef, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { VictoryChart, VictoryArea, VictoryLine, VictoryAxis,  VictoryLabel } from 'victory-native';
import EmptyGraph from './EmptyGraph';
import LinkComp from './LinkComp';
import { useIsDark } from '@contexts';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

function DataGraph({ loading, yAxisLabel, data, unit, meta, defaultTempUnit, unitMap }) {
    const containerWidth = width * 0.95;
    const { isDark }  = useIsDark();
    const flipAnimation = useRef(new Animated.Value(0)).current;
    const [flipped, setFlipped] = useState(false);

    const PercentageDotLine = ({ percentage }) => {
        const dotPosition = `${percentage}%`; // Calculate dot's position based on percentage
      
        return (
            <View className="flex-1 justify-center items-center my-2">
                <View className="relative w-4/5 h-1.5 bg-gray-500 dark:bg-gray-300">
                    <View
                        className="absolute w-2.5 h-3.5 rounded-full bg-fuchsia-400"
                        style={{ left: dotPosition, top: -3 }}
                    />
                </View>
            </View>
        );
    };
      
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

    let chartData = [];
    let tickValues = [];
    let overallMin = 0;
    let overallMax = 0;
    let overallAvg = 0;

    if (Array.isArray(data) && !loading) {
        const groupedData = data.reduce((acc, item) => {
            const date = new Date(item.timestamp).toISOString().split('T')[0];
            const value = unit === 'Temp' && defaultTempUnit.trim() === 'Fahrenheit' ? item[unit] * (9 / 5) + 32 : item[unit];
            if (!acc[date]) acc[date] = [];
            acc[date].push(value);
    
            return acc;
        }, {});

        chartData = Object.keys(groupedData).map((date) => ({
            day: new Date(date),
            avg: groupedData[date].reduce((sum, v) => sum + v, 0) / groupedData[date].length,
            y0: Math.min(...groupedData[date]),
            y: Math.max(...groupedData[date]),
        }));

        chartData.forEach(
            (ele) => {
                ele.avg = !isNaN(ele.avg) && ele.avg !== -999999 ? ele.avg : null;
                ele.y = !isNaN(ele.y) && ele.y !== -999999 ? ele.y : null;
                ele.y0 = !isNaN(ele.y0) && ele.y0 !== -999999 ? ele.y0 : null;
            },
        );
        
        // Calculate overall min, max, and average
        const allValues = Object.values(groupedData).flat();
        overallMin = Math.min(...allValues);
        overallMax = Math.max(...allValues);
        overallAvg = allValues.reduce((sum, value) => sum + value, 0) / allValues.length;

        tickValues = chartData.map(({ day }, index) => (index % 5 === 0 ? day : null)).filter(Boolean);
    }
    
    return (
        <View style={{ width, marginTop: 10 }}>
            <View className="elevation-[5]">
                {/* Title Bar */}
                <View className="w-[95%] self-center">
                    <Text className="text-2xl bg-white dark:bg-gray-700 rounded-3xl font-bold text-center dark:text-white p-1">
                        {yAxisLabel} {unitMap ? `- ${
                            unit === 'Temp' ? 
                                defaultTempUnit.trim() === 'Fahrenheit' ? 
                                    '°F'
                                    :  unitMap[unit] : unitMap[unit]
                        }` : ''}
                    </Text>
                    <TouchableOpacity className="absolute top-1 right-2" onPress={startAnimation}>
                        <FontAwesome name="info-circle" size={32} color={isDark ? 'white' : 'grey'} />
                    </TouchableOpacity>
                </View>

                {/* Graph Container */}
                <View className="w-[95%] self-center z-10">
                    <View className="h-[310]">
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
                                }
                            }
                        >
                            <View className="bg-white dark:bg-gray-700 rounded-3xl px-2 h-full">
                                {loading ? (
                                    <EmptyGraph />
                                ) : data?.error ? (
                                    <EmptyGraph text={data?.error} />
                                ) : !Array.isArray(data) ? (
                                    <EmptyGraph text={'No data :('} />
                                ) : (
                                    chartData.length ? <VictoryChart padding={{ left: 60, top: 20, right: 50, bottom: 50 }}>
                                        <VictoryAxis
                                            label="Time"
                                            tickValues={tickValues}
                                            tickFormat={(t) => `${t ? t.getMonth() + 1 : ''}/${t ? t.getDate() : ''}`}
                                            style={{
                                                axis: { stroke: isDark ? '#fff' : '#000' },
                                                axisLabel: { fill: isDark ? '#fff' : '#000' },
                                                tickLabels: {
                                                    fontSize: 12,
                                                    padding: 5,
                                                    fill: isDark ? '#fff' : '#000',
                                                },
                                            }}
                                        />
                                        <VictoryAxis
                                            dependentAxis
                                            label={yAxisLabel}
                                            style={{
                                                axis: { stroke: isDark ? '#fff' : '#000' },
                                                axisLabel: { fill: isDark ? '#fff' : '#000' },
                                                tickLabels: { fill: isDark ? '#fff' : '#000' },
                                            }}
                                            axisLabelComponent={<VictoryLabel dy={-20} angle={270} />}
                                        />
                                        <VictoryArea
                                            data={chartData}
                                            x="day"
                                            y0="y0"
                                            y="y"
                                            style={{
                                                data: {
                                                    fill: isDark ? 'rgba(73, 146, 255, 0.95)' : 'rgba(0, 100, 255, 0.4)',
                                                },
                                            }}
                                        />
                                        <VictoryLine
                                            data={chartData}
                                            x="day"
                                            y="avg"
                                            style={{
                                                data: { stroke: isDark ? 'rgb(0, 0, 138)' : 'rgb(0, 0, 255)' },
                                            }}
                                        />
                                    </VictoryChart> :  <EmptyGraph text={'No data for parameter at this month.'} />

                                )}
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
                            <ScrollView nestedScrollEnabled={true} className="bg-white dark:bg-gray-700 rounded-3xl p-4 h-full">
                                <View style={{ borderBottomWidth: 1, borderBottomColor: isDark ? 'white' : 'black', marginVertical: 10 }} />

                                <Text className="text-lg font-semibold dark:text-white text-center">
                                    Quick Summary
                                </Text>
                                <View className="flex-row justify-center items-center w-full ">
                                    <View className="flex-1">
                                        <Text className="text-3xl text-center font-bold dark:text-white">
                                            {overallMin.toFixed(1)}
                                        </Text>
                                        <Text className="text-center dark:text-white">
                                            Low
                                        </Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-3xl text-center font-bold dark:text-white">
                                            {overallAvg.toFixed(1)}
                                        </Text>
                                        <Text className="text-center dark:text-white">
                                            Average
                                        </Text>
                                    </View>                           
                                    <View className="flex-1">
                                        <Text className="text-3xl text-center font-bold dark:text-white">
                                            {overallMax.toFixed(1)}
                                        </Text>
                                        <Text className="text-center dark:text-white">
                                            High
                                        </Text>
                                    </View>
                                </View>

                                <Text className="text-lg font-semibold dark:text-white text-center">
                                    Skew of Average 
                                </Text>

                                <PercentageDotLine percentage={((overallAvg - overallMin) / (overallMax - overallMin)) * 100}/>

                                <View style={{ borderBottomWidth: 1, borderBottomColor: isDark ? 'white' : 'black', marginVertical: 10 }} />

                                <Text className="text-lg font-semibold dark:text-white">
                                    What is {yAxisLabel}?
                                </Text>
                                <Text className="text-md dark:text-gray-300">
                                    {meta.description}
                                </Text>
                                <Text className="text-lg font-semibold dark:text-white mt-4">
                                    Why does it matter?
                                </Text>
                                <Text className="text-md dark:text-gray-300">
                                    {meta?.reason}
                                </Text>
                                <Text className="text-lg font-semibold dark:text-white pt-4">
                                    References
                                </Text>
                                {
                                    meta.ref && meta.ref.map((ref,index) => (
                                        <LinkComp key={index} label={ref.label} url={ref.url} />
                                    ))
                                }
                                <Text></Text>
                            </ScrollView>
                        </Animated.View>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default DataGraph;
