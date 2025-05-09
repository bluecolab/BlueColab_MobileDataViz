import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useCurrentData } from '@contexts';

// ← adjust this path if your WQIGauge is elsewhere
import WQIGauge from '../components/WQIGauge';

function CurrentData() {
  const { data, defaultLocation, defaultTempUnit, loading } =
    useCurrentData();

  // grab the latest sample
  const last = data[data.length - 1];

  if (loading) return <Text>Loading...</Text>;
  if (!last) return <Text>No data available</Text>;

  // convert temperature if needed
  const temp = last.Temp;
  const waterTemp =
    (defaultTempUnit?.trim() ?? 'Fahrenheit') === 'Fahrenheit'
      ? temp * (9 / 5) + 32
      : temp;

  // sensor values
  const cond = last.Cond;
  const sal = last.Sal;
  const pH = last.pH;
  const turb = last.Turb;
  const dOpct = last.DOpct;

  // status & color logic
  const getStatusAndColor = (name, value) => {
    if (isNaN(value)) return { label: 'NA', color: 'text-gray-500' };
    switch (name) {
      case 'Water Temperature':
        if (value < 77) return { label: 'Good', color: 'text-green-600' };
        else if (value < 86)
          return { label: 'Warning', color: 'text-yellow-600' };
        else return { label: 'Bad', color: 'text-red-600' };

      case 'Conductivity':
        return value < 53999
          ? { label: 'Good', color: 'text-green-600' }
          : { label: 'Bad', color: 'text-red-600' };

      case 'Salinity':
        if (value < 4) return { label: 'Good', color: 'text-green-600' };
        else if (value < 9)
          return { label: 'Warning', color: 'text-yellow-600' };
        else return { label: 'Bad', color: 'text-red-600' };

      case 'pH':
        if (value < 4 || value > 11) return { label: 'Bad', color: 'text-red-600' };
        else if ((value >= 4 && value < 6) || (value > 8 && value <= 11))
          return { label: 'Warning', color: 'text-yellow-600' };
        else return { label: 'Good', color: 'text-green-600' };

      case 'Turbidity':
        if (value < 24) return { label: 'Good', color: 'text-green-600' };
        else if (value < 49)
          return { label: 'Warning', color: 'text-yellow-600' };
        else return { label: 'Bad', color: 'text-red-600' };

      case 'Oxygen':
        if (value >= 66 && value <= 199)
          return { label: 'Good', color: 'text-green-600' };
        else if ((value >= 41 && value < 66) || (value > 199 && value <= 299))
          return { label: 'Warning', color: 'text-yellow-600' };
        else return { label: 'Bad', color: 'text-red-600' };

      default:
        return { label: '', color: 'text-gray-500' };
    }
  };

  // flip‐card descriptions
  const DESCRIPTIONS = {
    'Water Temperature':
      'The temperature of the water, in °F or °C. Affects oxygen solubility and aquatic life metabolism.',
    Conductivity:
      'How well water conducts electricity (µS/cm). Higher values often mean more dissolved salts.',
    Salinity: 'The amount of dissolved salts in water (ppt).',
    pH:
      'A measure of acidity or alkalinity on a 0–14 scale (7 is neutral). Below 7 is acidic, above 7 is alkaline.',
    Turbidity:
      'The cloudiness of water caused by suspended particles (NTU). High turbidity can harm habitats.',
    Oxygen: 'Dissolved oxygen in water (mg/L). Essential for fish and other organisms.',
  };

  // your existing 6‐widget flip‐card
  const Widget = ({ name, value }) => {
    const numericValue = parseFloat(value);
    const { label, color } = getStatusAndColor(name, numericValue);

    const anim = useRef(new Animated.Value(0)).current;
    const [flipped, setFlipped] = useState(false);

    const frontRotate = anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });
    const backRotate = anim.interpolate({
      inputRange: [0, 1],
      outputRange: ['180deg', '360deg'],
    });

    const doFlip = () => {
      Animated.timing(anim, {
        toValue: flipped ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setFlipped(!flipped));
    };

    return (
      <View className="w-1/2 p-4">
        <TouchableOpacity activeOpacity={0.9} onPress={doFlip}>
          {/* FRONT */}
          <Animated.View
            style={{
              backfaceVisibility: 'hidden',
              transform: [{ perspective: 1000 }, { rotateY: frontRotate }],
            }}
          >
            <View className="relative p-6 h-[120px] bg-blue-100 rounded-3xl">
              <TouchableOpacity
                onPress={doFlip}
                className="absolute top-3 right-3"
              >
                <FontAwesome name="info-circle" size={20} color="gray" />
              </TouchableOpacity>

              <Text className="text-md font-bold text-center">{name}</Text>
              <View className="mt-4 items-center">
                <Text className="text-base">{value}</Text>
                <Text className={`text-sm italic ${color}`}>{label}</Text>
              </View>
            </View>
          </Animated.View>

          {/* BACK */}
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backfaceVisibility: 'hidden',
              transform: [{ perspective: 1000 }, { rotateY: backRotate }],
            }}
          >
            <View className="p-4 h-[120px] bg-blue-100 rounded-3xl justify-center">
              <Text className="font-bold mb-1 text-center">{name}</Text>
              <Text className="text-sm text-center">
                {DESCRIPTIONS[name]}
              </Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView className="bg-defaultbackground dark:bg-defaultdarkbackground">
      {/* — Title — */}
      <View>
        <Text className="mt-7 text-center text-2xl font-bold dark:text-white">
          {defaultLocation} Data
        </Text>
      </View>

      {/* — Your 6 Widgets — */}
      <View className="flex flex-row flex-wrap">
        <Widget
          name="Water Temperature"
          value={waterTemp?.toFixed(2) ?? 'NA'}
        />
        <Widget name="Conductivity" value={cond?.toFixed(2) ?? 'NA'} />
        <Widget name="Salinity" value={sal?.toFixed(2) ?? 'NA'} />
        <Widget name="pH" value={pH?.toFixed(2) ?? 'NA'} />
        <Widget name="Turbidity" value={turb?.toFixed(2) ?? 'NA'} />
        <Widget name="Oxygen" value={dOpct?.toFixed(2) ?? 'NA'} />
      </View>

      {/* — Current‐Data WQI Gauge — */}
      <View className="mt-6 px-4 items-center">
        <WQIGauge
          loading={loading}
          data={[last]}   // run WQI on the latest point
          size={180}     // adjust as you like
        />
      </View>
    </ScrollView>
  );
}

export default CurrentData;


