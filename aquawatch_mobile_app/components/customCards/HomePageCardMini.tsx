import { router } from 'expo-router';
import { View, Image, Text, ImageSourcePropType, Pressable } from 'react-native';

export function HomepageCard({
    image,
    title,
    description,
    path,
}: {
    image: ImageSourcePropType;
    title: string;
    description: string;
    path: string;
}) {
    return (
        <Pressable
            onPress={() => router.push(path as any)}
            className="mx-4 my-2 flex-row items-center rounded-xl border border-gray-700 bg-gray-900 p-4 shadow-lg dark:bg-gray-900">
            <View className="mr-4 rounded-2xl border border-gray-700 bg-gray-950 p-3 shadow-md">
                <Image source={image} className="h-16 w-16 rounded-xl" resizeMode="contain" />
            </View>
            <View className="flex-1">
                <Text className="mb-1 text-lg font-bold text-white">{title}</Text>
                <Text className="text-gray-300">{description}</Text>
            </View>
        </Pressable>
    );
}
