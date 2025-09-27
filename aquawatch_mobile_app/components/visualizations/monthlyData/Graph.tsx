import { SkFont } from '@shopify/react-native-skia';
import { AreaRange, CartesianChart, Line } from 'victory-native';

import { DailySummaryType } from '@/utils/dataUtils';
import { getOrdinalSuffix } from '@/utils/getOrdinalSuffix';

type GraphProps = {
    dailySummary: DailySummaryType[];
    isDark: boolean;
    font: SkFont | null | undefined;
};

export default function Graph({ dailySummary, isDark, font }: GraphProps) {
    return (
        <CartesianChart
            data={dailySummary}
            xKey="day"
            yKeys={['avg', 'min', 'max']}
            xAxis={{
                font,
                tickCount: 5,
                lineWidth: 0,
                formatXLabel: (label: any) => {
                    return getOrdinalSuffix(label);
                },
                labelColor: isDark ? 'white' : '#000000',
            }}
            yAxis={[
                {
                    labelColor: isDark ? 'white' : '#000000',
                    font,
                },
            ]}
            frame={{
                lineColor: isDark ? 'white' : '#000000',
                lineWidth: { top: 0, bottom: 4, left: 4, right: 0 },
            }}
            padding={{ left: 0, bottom: 20, top: 5, right: 5 }}>
            {({ points }) => (
                <>
                    <AreaRange
                        upperPoints={points.max}
                        lowerPoints={points.min}
                        color={isDark ? 'rgba(73, 146, 255, 0.95)' : 'rgba(0, 100, 255, 0.4)'}
                        animate={{ type: 'timing' }}
                    />
                    <Line
                        points={points.avg}
                        color="blue"
                        strokeWidth={2}
                        animate={{ type: 'timing' }}
                    />
                </>
            )}
        </CartesianChart>
    );
}
