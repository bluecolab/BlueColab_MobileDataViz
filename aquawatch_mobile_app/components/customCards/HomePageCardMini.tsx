import { View, Image, Text, ImageSourcePropType } from 'react-native';

export function HomepageCard({
    image,
    title,
    description,
}: {
    image: ImageSourcePropType;
    title: string;
    description: string;
}) {
    return (
        <View className="mx-4 my-2 flex-row items-center rounded-xl bg-white p-4  ">
            <Image source={image} className="mr-4 h-24 w-24 rounded-lg" resizeMode="cover" />
            <View className="flex-1">
                <Text className="mb-1 text-lg font-bold text-[#263A75]">{title}</Text>
                <Text className="text-[#263A75]">{description}</Text>
            </View>
        </View>
    );
}
