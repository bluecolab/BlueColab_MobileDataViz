// /components/HomeScreenCard.tsx
import { useRouter } from 'expo-router';
import { View, Text, Pressable, Dimensions, ImageBackground } from 'react-native';

const { width } = Dimensions.get('window');

interface HomeScreenCardProps {
    imageSource: string | { uri: string };
    title: string;
    buttonText: string;
    route: string;
    isMain?: boolean;
}

export default function HomeScreenCard({
    imageSource,
    title,
    buttonText,
    route,
    isMain,
}: HomeScreenCardProps) {
    const router = useRouter();

    // Determine if imageSource is a URI or a local image
    const image = typeof imageSource === 'string' ? { uri: imageSource } : imageSource;
    return (
        <Pressable onPress={() => router.push({ pathname: route as any })}>
            <View
                className={`my-2 overflow-hidden rounded-3xl bg-white dark:bg-gray-700 ${isMain ? '' : 'mr-4'}`}>
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
                    className={`font-bold text-gray-700 dark:text-white ${isMain ? 'text-3xl' : 'text-2xl'}  pl-1`}>
                    {title}
                </Text>
                <Text
                    className={`text-gray-600 dark:text-white ${isMain ? 'text-lg' : 'text-sm'} pb-4 pl-1`}>
                    {buttonText}
                </Text>
            </View>
        </Pressable>
    );
}
