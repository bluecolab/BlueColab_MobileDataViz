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
            className="dark:bg-darkCardBackground bg-lightCardBackground my-2 flex-row items-center rounded-xl p-4">
            <View className="dark:bg-darkCardBackgroundLvl1 bg-lightCardBackgroundLvl1 mr-4 rounded-2xl  p-3 shadow-lg">
                <Image source={image} className="h-16 w-16 rounded-xl" resizeMode="contain" />
            </View>
            <View className="flex-1">
                <Text className="dark:text-darkText mb-1 text-lg font-bold">{title}</Text>
                <Text className="dark:text-darkTextLvl1">{description}</Text>
            </View>
        </Pressable>
    );
}
