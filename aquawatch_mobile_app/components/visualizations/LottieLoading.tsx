import LottieView from 'lottie-react-native';
import { useRef } from 'react';
import { View } from 'react-native';

export default function LottieLoading() {
    const animation = useRef<LottieView>(null);

    return (
        <View className="items-center justify-center">
            <LottieView
                autoPlay
                ref={animation}
                style={{
                    width: 200,
                    height: 200,
                }}
                source={require('@/assets/WaterAnimation.json')}
            />
        </View>
    );
}
