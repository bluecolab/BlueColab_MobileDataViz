import { View, Text } from "react-native";
import { PolarChart, Pie } from "victory-native";
import useDataCleaner from "@/hooks/useDataCleaner";
import { useIsDark } from "@/contexts/ColorSchemeContext";

const getColor = (percentage: number) =>
  percentage >= 0 && percentage < 25 ? "darkred" :
    percentage >= 25 && percentage < 50 ? "darkorange" :
      percentage >= 50 && percentage < 70 ? "yellow" :
        percentage >= 70 && percentage < 90 ? "green" :
          percentage >= 90 && percentage <= 100 ? "darkgreen" :
            "red"; // Default color

interface WQICardFront {
  data: any
  loading: boolean
}

export default function WQICardFront({data, loading} : WQICardFront) {
  const {  calculateWQI } = useDataCleaner();
  const { isDark } = useIsDark();


  const percentage = calculateWQI(data, loading);

  const DATA = [
    {
      value: percentage,
      color: getColor(percentage),
      label: 'WQI'
    },
    {
      value: Math.max(0, 100 - percentage),
      color: 'lightgray',
      label: 'WQI'
    }
  ]
  return (
    <View style={{ height: 200 }}>
      <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <Text className="text-3xl font-bold text-black dark:text-white">{percentage}%</Text>
      </View>

      <PolarChart
        data={DATA} 
        labelKey={"label"} 
        valueKey={"value"} 
        colorKey={"color"}
      >
        <Pie.Chart innerRadius={"50%"} startAngle={270}>
          {({ slice }) => (
            <Pie.Slice
            >

              <Pie.SliceAngularInset
                angularInset={{
                  angularStrokeWidth: 5,
                  angularStrokeColor: isDark ? "#374151":  "white", // TODO: Fix to Background color for the gaps
                }}
              />
      
            </Pie.Slice>
          )
          }
        </Pie.Chart>
      </PolarChart>
    </View>
  );
}
