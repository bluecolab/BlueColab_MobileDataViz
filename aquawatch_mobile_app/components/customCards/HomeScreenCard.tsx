// /components/HomeScreenCard.tsx
import { useRouter } from 'expo-router';
import { View, Text, Pressable, Dimensions, ImageBackground } from 'react-native';

const { width } = Dimensions.get('window');

interface HomeScreenCardProps {
    imageSource: string | { uri: string };
    title: string;
    buttonText: string;
    route?: string;
    isMain?: boolean;
    isSafe?: boolean;
    onPress?: () => void;
}

export default function HomeScreenCard({
    imageSource,
    title,
    buttonText,
    route,
    isMain,
    isSafe,
    onPress,
}: HomeScreenCardProps) {
    const router = useRouter();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else if (route) {
            router.push({ pathname: route as any });
        }
    };

    // Determine if imageSource is a URI or a local image
    const image = typeof imageSource === 'string' ? { uri: imageSource } : imageSource;
    return (
        <Pressable onPress={handlePress}>
            <View
                className={`my-2 overflow-hidden rounded-3xl bg-white dark:bg-gray-700 ${isMain ? '' : 'mr-4'}`}>
                {isSafe !== undefined && (
                    <View
                        className={`absolute right-4 top-4 z-10 rounded-full ${isSafe ? 'bg-green-400' : 'bg-red-400'} px-3 py-1`}>
                        <Text className="text-4xl dark:text-white">
                            {isSafe ? 'Safe' : 'Unsafe'}
                        </Text>
                    </View>
                )}
                <ImageBackground
                    source={image}
                    style={[
                        {
                            width: isMain ? width : width / 1.8,
                            height: isMain ? 200 : 100,
                        },
                    ]}
                    imageStyle={{
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                    }}
                />
                <Text
                    className={`font-bold text-gray-700 dark:text-white ${isMain ? 'pl-4 text-3xl' : 'pl-2 text-2xl'}  pl-1`}>
                    {title}
                </Text>
                <Text
                    className={`text-gray-600 dark:text-white ${isMain ? 'pl-4 text-lg' : 'pl-2 text-sm'} pb-4 pl-1`}>
                    {buttonText}
                </Text>
            </View>
        </Pressable>
    );
}
