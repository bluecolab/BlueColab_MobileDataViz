import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';

const { width } = Dimensions.get('window'); // Get the width of the device to set the image width

// Define the GradientCard component with props for customization
const GradientCard = ({ imageSource, title, buttonText, onButtonPress, isMain }) => {
    // Determine if imageSource is a URI or a local image
    const image = typeof imageSource === 'string' ? { uri: imageSource } : imageSource;
    return (
        <TouchableOpacity onPress={onButtonPress}>
            <View className={`my-2 rounded-3xl overflow-hidden bg-white dark:bg-gray-700 ${isMain ? '' : 'mr-4'}`}>
                <ImageBackground
                    source={image}
                    style={[
                        {
                            width: isMain ? width : width / 1.8,
                            height: isMain ? 200 : 100,
                        },
                    ]}
                    imageStyle={{ borderRadiusTopLeft: 24, borderRadiusTopRight: 24 }}
                >

                </ImageBackground>
                <Text className={`text-gray-700 dark:text-white font-bold ${isMain ? 'text-3xl' : 'text-2xl'}  pl-1`}>{title}</Text>
                <Text className={`text-gray-600 dark:text-white ${isMain ? 'text-lg' : 'text-sm'} pb-4 pl-1`}>{buttonText}</Text>
            </View>
        </TouchableOpacity>

    );
};

export default GradientCard;
