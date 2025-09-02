import React from 'react';
import { View } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

interface FlipCardProps {
    Front: React.ReactNode;
    Back: React.ReactNode;
    ref: React.Ref<{ flip: () => void }>;
    duration?: number;
}

/**
 * A card component that can be flipped to reveal different content on each side.
 *
 * **Usage**:
 *
 * Declare this function and send it as the ref parameter. Call this function inside onPress or alike:
 * ```
 * const flipCard = () => flipCardRef.current?.flip();
 *
 * <TouchableOpacity onPress={flipCard}>
 *    content
 * </TouchableOpacity>
 * ```
 *
 * @param Front - The front side of the card.
 * @param Back - The back side of the card.
 * @param ref - A ref to control the flip action from outside the component.
 * @param duration - The duration of the flip animation in milliseconds.
 */
export default function FlipCard({ Front, Back, ref, duration = 500 }: FlipCardProps) {
    const isFlipped = useSharedValue(false);

    const handlePress = () => {
        isFlipped.value = !isFlipped.value;
    };

    // Links flip ref to handlePress
    (ref as React.RefObject<{ flip: () => void }>).current = {
        flip: handlePress,
    };

    const regularCardAnimatedStyle = useAnimatedStyle(() => {
        const spinValue = interpolate(Number(isFlipped.value), [0, 1], [0, 180]);
        const rotateValue = withTiming(`${spinValue}deg`, { duration });

        return {
            transform: [{ rotateY: rotateValue }],
        };
    });

    const flippedCardAnimatedStyle = useAnimatedStyle(() => {
        const spinValue = interpolate(Number(isFlipped.value), [0, 1], [180, 360]);
        const rotateValue = withTiming(`${spinValue}deg`, { duration });

        return {
            transform: [{ rotateY: rotateValue }],
        };
    });

    return (
        <View>
            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        zIndex: 1,
                        backfaceVisibility: 'hidden',
                        width: '100%',
                    },
                    regularCardAnimatedStyle,
                ]}>
                {Front}
            </Animated.View>
            <Animated.View
                style={[
                    {
                        zIndex: 2,
                        backfaceVisibility: 'hidden',
                        width: '100%',
                    },
                    flippedCardAnimatedStyle,
                ]}>
                {Back}
            </Animated.View>
        </View>
    );
}
