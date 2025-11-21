// /components/HomeScreenCard.tsx
import { useRouter } from 'expo-router';
import { View, Text, Pressable, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface HomeScreenCardProps {
    imageSource: string | { uri: string };
    title: string;
    buttonText: string;
    route: string;
    isMain?: boolean;
    isSafe?: boolean;
}

export default function HomeScreenCard({
    imageSource,
    title,
    buttonText,
    route,
    isMain,
    isSafe,
}: HomeScreenCardProps) {
    const router = useRouter();

    // Determine if imageSource is a URI or a local image
    const image = typeof imageSource === 'string' ? { uri: imageSource } : imageSource;
    return (
        <Pressable onPress={() => router.push({ pathname: route as any })}>
            <View
                className={`my-2 overflow-hidden rounded-2xl bg-transparent ${isMain ? '' : 'mr-4'}`}
                style={{ width: isMain ? '100%' : width / 1.8 }}>
                <ImageBackground
                    source={image}
                    style={{
                        width: '100%',
                        height: isMain ? 220 : 130,
                        justifyContent: 'flex-end',
                    }}
                    imageStyle={{ borderRadius: 16 }}>
                    <LinearGradient
                        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.55)']}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={{ width: '100%', padding: 12 }}>
                        <View className="flex-row items-center justify-between">
                            <Text
                                className={`font-semibold ${isMain ? 'text-xl' : 'text-base'} text-white`}
                                numberOfLines={1}>
                                {title}
                            </Text>
                            {isSafe !== undefined && (
                                <View
                                    className={`rounded-full px-2 py-1 ${isSafe ? 'bg-emerald-400/90' : 'bg-rose-500/90'}`}>
                                    <Text className="text-[10px] font-semibold text-white">
                                        {isSafe ? 'SAFE' : 'UNSAFE'}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <Text
                            className={`mt-1 ${isMain ? 'text-sm' : 'text-xs'} text-gray-200`}
                            numberOfLines={2}>
                            {buttonText}
                        </Text>
                    </LinearGradient>
                </ImageBackground>
            </View>
        </Pressable>
    );
}
