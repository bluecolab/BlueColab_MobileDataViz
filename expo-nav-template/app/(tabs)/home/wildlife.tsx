// app/(tabs)/home/wildlife.tsx
import { Stack } from 'expo-router';
import { View, Text, FlatList, Image, StyleSheet, Dimensions } from 'react-native';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

/**
 * @returns {JSX.Element}
 * @description The wildlife screen of the app. It contains a list of wildlife data.
 */
export default function Wildlife() {
    const choateWildlifeData = [
        {
            animalName: 'Largemouth Bass',
            scientificName: 'Micropterus Salmoides',
            funFact:
                'The largemouth bass is an ambush predator and often consumes prey in a single strike.',
            imageUri:
                'https://images.unsplash.com/photo-1601248981942-89b99a5b7427?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            animalName: 'Snapping Turtle',
            scientificName: 'Chelydra Serpentina',
            funFact: 'Snapping turtles are capable of living over 100 years.',
            imageUri:
                'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Common_Snapping_Turtle_Close_Up.jpg/1280px-Common_Snapping_Turtle_Close_Up.jpg',
        },
        // Add more wildlife data as needed...
    ];

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Wildlife',
                }}
            />
            <View style={styles.wildLifeContainer}>
                <Text style={styles.paragraphTextWildlife}>Wildlife in Choate Pond</Text>

                <FlatList
                    data={choateWildlifeData}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View>
                            <Image source={{ uri: item.imageUri }} style={styles.smallImage} />
                            <Text style={styles.animalName}>{item.animalName}</Text>
                            <Text style={styles.scientificName}>{item.scientificName}</Text>
                            <Text style={styles.funFact}>{item.funFact}</Text>
                        </View>
                    )}
                />
            </View>
        </>
    );
}
const styles = StyleSheet.create({
    //wildlife screen background
    wildLifeContainer: {
        flex: 1,
        backgroundColor: '#2B2D35',
        alignItems: 'center',
        width: deviceWidth,
        marginTop: deviceHeight / 200,
        marginBottom: deviceHeight / 200,
        color: 'white',
    },
    //header for the wildlife page
    paragraphTextWildlife: {
        color: 'white',
        fontSize: deviceHeight / 25,
        marginTop: deviceHeight / 100,
        marginBottom: deviceHeight / 100,
        marginLeft: deviceWidth / 15,
        marginRight: deviceWidth / 15,
        textAlign: 'center',
    },
    //image on wildlife page
    smallImage: {
        width: 350,
        height: 250,
        borderRadius: 10,
        margin: 10,
    },
    //animal name on wildlife page
    animalName: {
        color: 'white',
        textAlign: 'center',
        // fontStyle: 'strong',
    },
    //scientific name on wildlife page
    scientificName: {
        marginTop: 2,
        color: 'white',
        textAlign: 'center',
    },
    //fun fact for wildlife page
    funFact: {
        marginTop: 2,
        color: 'white',
        textAlign: 'center',
        width: 350,
    },
});
