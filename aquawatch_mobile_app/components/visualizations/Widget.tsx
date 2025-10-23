import { FontAwesome } from '@expo/vector-icons';
import { useRef } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';

import FlipCard from '@/components/customCards/FlipCard';

// status & color logic
const getStatusAndColor = (name: string, value: number) => {
    if (isNaN(value)) return { label: 'NA', color: 'text-gray-500' };
    switch (name) {
        case 'Water Temperature':
            if (value < 77) return { label: 'Good', color: 'text-green-600' };
            else if (value < 86) return { label: 'Warning', color: 'text-yellow-600' };
            else return { label: 'Bad', color: 'text-red-600' };

        case 'Conductivity':
            return value < 53999
                ? { label: 'Good', color: 'text-green-600' }
                : { label: 'Bad', color: 'text-red-600' };

        case 'Salinity':
            if (value < 4) return { label: 'Good', color: 'text-green-600' };
            else if (value < 9) return { label: 'Warning', color: 'text-yellow-600' };
            else return { label: 'Bad', color: 'text-red-600' };

        case 'pH':
            if (value < 4 || value > 11) return { label: 'Bad', color: 'text-red-600' };
            else if ((value >= 4 && value < 6) || (value > 8 && value <= 11))
                return { label: 'Warning', color: 'text-yellow-600' };
            else return { label: 'Good', color: 'text-green-600' };

        case 'Turbidity':
            if (value < 24) return { label: 'Good', color: 'text-green-600' };
            else if (value < 49) return { label: 'Warning', color: 'text-yellow-600' };
            else return { label: 'Bad', color: 'text-red-600' };

        case 'Oxygen':
            if (value >= 66 && value <= 199) return { label: 'Good', color: 'text-green-600' };
            else if ((value >= 41 && value < 66) || (value > 199 && value <= 299))
                return { label: 'Warning', color: 'text-yellow-600' };
            else return { label: 'Bad', color: 'text-red-600' };
        case 'Sulfur Dioxide': // SO2
            if (value < 20) return { label: 'Good', color: 'text-green-600' };
            else if (value < 80) return { label: 'Fair', color: 'text-lime-500' };
            else if (value < 250) return { label: 'Moderate', color: 'text-yellow-600' };
            else if (value < 350) return { label: 'Poor', color: 'text-orange-600' };
            else return { label: 'Very Poor', color: 'text-red-600' };

        case 'Nitrogen Dioxide': // NO2
            if (value < 40) return { label: 'Good', color: 'text-green-600' };
            else if (value < 70) return { label: 'Fair', color: 'text-lime-500' };
            else if (value < 150) return { label: 'Moderate', color: 'text-yellow-600' };
            else if (value < 200) return { label: 'Poor', color: 'text-orange-600' };
            else return { label: 'Very Poor', color: 'text-red-600' };

        case 'PM10':
            if (value < 20) return { label: 'Good', color: 'text-green-600' };
            else if (value < 50) return { label: 'Fair', color: 'text-lime-500' };
            else if (value < 100) return { label: 'Moderate', color: 'text-yellow-600' };
            else if (value < 200) return { label: 'Poor', color: 'text-orange-600' };
            else return { label: 'Very Poor', color: 'text-red-600' };

        case 'PM2.5':
            if (value < 10) return { label: 'Good', color: 'text-green-600' };
            else if (value < 25) return { label: 'Fair', color: 'text-lime-500' };
            else if (value < 50) return { label: 'Moderate', color: 'text-yellow-600' };
            else if (value < 75) return { label: 'Poor', color: 'text-orange-600' };
            else return { label: 'Very Poor', color: 'text-red-600' };

        case 'Ozone': // O3
            if (value < 60) return { label: 'Good', color: 'text-green-600' };
            else if (value < 100) return { label: 'Fair', color: 'text-lime-500' };
            else if (value < 140) return { label: 'Moderate', color: 'text-yellow-600' };
            else if (value < 180) return { label: 'Poor', color: 'text-orange-600' };
            else return { label: 'Very Poor', color: 'text-red-600' };

        case 'Carbon Monoxide': // CO
            if (value < 4400) return { label: 'Good', color: 'text-green-600' };
            else if (value < 9400) return { label: 'Fair', color: 'text-lime-500' };
            else if (value < 12400) return { label: 'Moderate', color: 'text-yellow-600' };
            else if (value < 15400) return { label: 'Poor', color: 'text-orange-600' };
            else return { label: 'Very Poor', color: 'text-red-600' };

        default:
            return { label: '', color: 'text-gray-500' };
    }
};

// flip‐card descriptions
const DESCRIPTIONS = {
    // Water Quality
    'Water Temperature':
        'The temperature of the water, in °F or °C. Affects oxygen solubility and aquatic life metabolism.',
    Conductivity:
        'How well water conducts electricity (µS/cm). Higher values often mean more dissolved salts.',
    Salinity: 'The amount of dissolved salts in water (ppt).',
    pH: 'A measure of acidity or alkalinity on a 0-14 scale (7 is neutral). Below 7 is acidic, above 7 is alkaline.',
    Turbidity:
        'The cloudiness of water caused by suspended particles (NTU). High turbidity can harm habitats.',
    Oxygen: 'Dissolved oxygen in water (mg/L). Essential for fish and other organisms.',

    // Atmospheric Conditions
    'Air Temperature': 'The ambient air temperature, measured in degrees Celsius (°C).',
    'Relative Humidity':
        'The amount of water vapor in the air, expressed as a percentage of the maximum amount the air could hold.',
    'Barometric Pressure':
        'The weight of the atmosphere, measured in hectopascals (hPa). Changes can indicate shifts in weather.',
    'Vapor Pressure':
        'The pressure exerted by water vapor in the air, measured in kilopascals (kPa).',
    'Solar Flux':
        'The amount of solar radiation energy received per unit area, measured in Watts per square meter (W/m²).',

    // Wind
    'Wind Speed':
        'The speed of air movement over the ground, measured in kilometers per hour (km/h).',
    'Max Wind Speed':
        'The highest recorded wind speed during a measurement period, in kilometers per hour (km/h).',
    'Wind Direction':
        'The direction from which the wind is blowing, measured in degrees from 0° to 360° (North is 0°).',

    // Precipitation & Events
    Rain: 'The amount of rainfall over a period, measured in millimeters (mm).',
    'Lightning Strikes': 'The total number of lightning strikes detected by the sensor.',
    'Distance to Lightning':
        'The estimated distance to the last detected lightning strike, in kilometers.',

    // Sensor Orientation
    'Tilt NS': 'The North-South tilt of the sensor in degrees.',
    'Tilt WE': 'The West-East tilt of the sensor in degrees.',
    'Carbon Monoxide':
        'Concentration of CO gas in the air, in micrograms per cubic meter (µg/m³). High concentrations lead to less oxygen delivery in the body.',
    'Nitric Oxide':
        'Concentration of NO gas in the air, in micrograms per cubic meter (µg/m³). Becomes a irritant at high levels when breathing.',
    'Nitrogen Dioxide':
        'Concentration of NO2 gas in the air, in micrograms per cubic meter (µg/m³). Becomes a irritant at high levels when breathing',
    Ozone: 'Concentration of O3 gas in the air, in micrograms per cubic meter (µg/m³). Cause breathing difficulties at high levels, especially for asthmatics.',
    'Sulfur Dioxide':
        'Concentration of SO2 gas in the air, in micrograms per cubic meter (µg/m³).  Cause breathing difficulties at high levels, especially for asthmatics.',
    'PM2.5':
        'Concentration of particulate matter ≤2.5 micrometers in diameter, in micrograms per cubic meter (µg/m³). Small particles can penetrate deep into lungs and bloodstream.',
    PM10: 'Concentration of particulate matter ≤10 micrometers in diameter, in micrograms per cubic meter (µg/m³). Small particles can penetrate deep into lungs and bloodstream.',
    Ammonia:
        'Concentration of NH3 gas in the air, in micrograms per cubic meter (µg/m³). Cause irritation to eyes, nose, and throat at high levels.',
};

// Add this map in your CurrentData.tsx file
export const SENSOR_MAP: { [key: string]: DescriptionKeys | null } = {
    AirTemp: 'Air Temperature',
    BaroPressure: 'Barometric Pressure',
    DistLightning: 'Distance to Lightning',
    LightningStrikes: 'Lightning Strikes',
    MaxWindSpeed: 'Max Wind Speed',
    Rain: 'Rain',
    RelHumid: 'Relative Humidity',
    SolarFlux: 'Solar Flux',
    TiltNS: 'Tilt NS',
    TiltWE: 'Tilt WE',
    VaporPressure: 'Vapor Pressure',
    WindDir: 'Wind Direction',
    WindSpeed: 'Wind Speed',
    // Set keys to null if you want to ignore them
    RelHumidTemp: null,
    SolarTotalFlux: null,
    co: 'Carbon Monoxide',
    no: null,
    no2: 'Nitrogen Dioxide',
    o3: 'Ozone',
    so2: 'Sulfur Dioxide',
    pm2_5: 'PM2.5',
    pm10: null,
    nh3: 'Ammonia',
};

export type DescriptionKeys = keyof typeof DESCRIPTIONS;

interface WidgetProp {
    name: DescriptionKeys;
    value: number | string;
}

export function Widget({ name, value }: WidgetProp) {
    const numericValue = parseFloat(value.toString());
    const { label, color } = getStatusAndColor(name, numericValue);

    const flipCardRef = useRef<{ flip: () => void }>(null);

    const flipCard = () => flipCardRef.current?.flip();

    return (
        <View className="w-1/2 p-4">
            <Pressable
                onPress={flipCard}
                onStartShouldSetResponder={() => true} // Prevents Pressable from blocking ScrollView
            >
                {/* FRONT */}
                <FlipCard
                    height={140}
                    flipCardRef={flipCardRef}
                    Front={
                        <View className="relative h-[150] rounded-3xl bg-white p-6 dark:bg-gray-700">
                            <Pressable onPress={flipCard} className="absolute right-3 top-3">
                                <FontAwesome name="info-circle" size={20} color="gray" />
                            </Pressable>

                            {/* -13px aligns water temperature with others */}
                            <Text
                                className={`text-md text-center font-bold dark:text-white ${
                                    name === 'Water Temperature' ? 'mt-[-13px]' : ''
                                }`}>
                                {name}
                            </Text>
                            <View className="mt-4 items-center">
                                <Text className="text-base dark:text-white">{value}</Text>
                                <Text className={`text-sm italic ${color}`}>{label}</Text>
                            </View>
                        </View>
                    }
                    Back={
                        <View className="h-[150]">
                            <ScrollView
                                className="h-[150] rounded-3xl bg-white p-4 dark:bg-gray-700"
                                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                                keyboardShouldPersistTaps="handled" // Ensures ScrollView handles taps
                            >
                                <Pressable onPress={flipCard}>
                                    <Text className="mb-1 text-center font-bold dark:text-white">
                                        {name}
                                    </Text>
                                    <Text className="text-center text-sm dark:text-white">
                                        {DESCRIPTIONS[name]}
                                    </Text>
                                </Pressable>
                            </ScrollView>
                        </View>
                    }
                />
            </Pressable>
        </View>
    );
}
