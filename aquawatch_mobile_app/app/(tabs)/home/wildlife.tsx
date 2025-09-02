// app/(tabs)/home/wildlife.tsx
import { getMonth } from 'date-fns';
import { Stack } from 'expo-router';
import type { RefObject, Dispatch, SetStateAction } from 'react';
import { useRef, useState } from 'react';
import { View, Text, FlatList, Image, Dimensions, StyleSheet } from 'react-native';

import { useColorScheme } from '@/contexts/ColorSchemeContext';
import { AnimalFact } from '@/types/animal.interfaces';
import getAnimalFacts from '@/utils/getAnimalFacts';

const windowWidth = Dimensions.get('window').width;

// Function to check the current season
const getCurrentSeason = () => {
    const month = getMonth(new Date()) + 1; // `getMonth` is 0-indexed

    if ([12, 1, 2, 3, 4, 5, 6, 7, 8].includes(month)) return 'winter';
    return 'summer';
};

// Process wildlife data to include seasonal facts
const processWildlifeData = (baseData: AnimalFact[], currentSeason: 'winter' | 'summer') => {
    return baseData.map((animal, index) => {
        const funFact =
            animal.seasonalFacts && animal.seasonalFacts[currentSeason]
                ? animal.seasonalFacts[currentSeason]
                : animal.defaultFact;

        return {
            ...animal,
            funFact,
            id: `${animal.animalName.toLowerCase().replace(/\s/g, '-')}-${index}`, // Add unique ID for FlatList
        };
    });
};

/** The wildlife screen of the app. It contains a list of wildlife data.
 * @returns {JSX.Element}
 */
export default function Wildlife() {
    const { isDark } = useColorScheme();
    const currentSeason = getCurrentSeason();
    const { choateWildlifeBase, hudsonWildlifeBase } = getAnimalFacts();

    // State to track the current carousel indices
    const [choateActiveIndex, setChoateActiveIndex] = useState(0);
    const [hudsonActiveIndex, setHudsonActiveIndex] = useState(0);

    // Refs for FlatLists to programmatically scroll
    const choateListRef = useRef<FlatList<AnimalFact>>(null);
    const hudsonListRef = useRef<FlatList<AnimalFact>>(null);

    const choateWildlifeData = processWildlifeData(choateWildlifeBase, currentSeason);
    const hudsonWildlifeData = processWildlifeData(hudsonWildlifeBase, currentSeason);

    // Render item for FlatList
    const renderWildlifeItem = ({ item }: { item: AnimalFact }) => (
        <View style={styles.cardContainer}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.imageUri }} style={styles.image} />
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.animalName}>{item.animalName}</Text>
                <Text style={styles.scientificName}>{item.scientificName}</Text>
                <Text style={styles.factText}>{item.seasonalFacts[currentSeason]}</Text>
            </View>
        </View>
    );

    const renderWildlifeSection = (
        data: AnimalFact[],
        activeIndex: number,
        setActiveIndex: Dispatch<SetStateAction<number>>,
        listRef: RefObject<FlatList<AnimalFact> | null>
    ) => {
        return (
            <View>
                <FlatList
                    ref={listRef}
                    data={data}
                    renderItem={renderWildlifeItem}
                    keyExtractor={(item, index) =>
                        `${item.animalName.toLowerCase().replace(/\s/g, '-')}-${index}`
                    }
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    snapToInterval={windowWidth * 0.85 + windowWidth * 0.075} // Card width + margin
                    decelerationRate="fast"
                    onMomentumScrollEnd={(event) => {
                        const position = event.nativeEvent.contentOffset.x;
                        const index = Math.round(
                            position / (windowWidth * 0.85 + (windowWidth * 0.075) / 2)
                        );
                        setActiveIndex(index);
                    }}
                    contentContainerStyle={{ paddingHorizontal: (windowWidth * 0.075) / 4 }}
                    initialScrollIndex={activeIndex}
                    getItemLayout={(_, index) => ({
                        length: windowWidth * 0.85 + (windowWidth * 0.075) / 2,
                        offset: (windowWidth * 0.85 + (windowWidth * 0.075) / 2) * index,
                        index,
                    })}
                />
            </View>
        );
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#1a202c' : 'rgb(220, 220, 220)',
            paddingBottom: 40,
        },

        sectionHeader: {
            fontSize: 30,
            fontWeight: 'bold',
            color: isDark ? '#fff' : '#333',
            textAlign: 'center',
            marginTop: 20,
            marginBottom: 5,
        },
        cardContainer: {
            width: windowWidth * 0.85,
            marginHorizontal: (windowWidth * 0.075) / 2,
            marginVertical: 12,
            borderRadius: 12,
            backgroundColor: isDark ? '#374151' : '#fff',
        },
        imageContainer: {
            width: '100%',
            height: 200, // Fixed height for images
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            overflow: 'hidden',
        },
        image: {
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
        },
        cardContent: {
            padding: 15,
        },
        animalName: {
            fontSize: 20,
            fontWeight: 'bold',
            color: isDark ? '#fff' : '#333',
            marginBottom: 5,
        },
        scientificName: {
            fontSize: 16,
            fontStyle: 'italic',
            color: isDark ? '#fff' : '#666',
            marginBottom: 12,
        },
        factText: {
            fontSize: 16,
            color: isDark ? '#fff' : '#333',
            lineHeight: 22,
        },

        paginationDot: {
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 5,
        },
        activeDot: {
            backgroundColor: '#007AFF',
        },
        inactiveDot: {
            backgroundColor: '#ccc',
        },
        contentContainer: {
            paddingBottom: 60,
        },
    });

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Wildlife',
                    headerStyle: {
                        backgroundColor: isDark ? '#2e2e3b' : 'white',
                    },
                    headerTintColor: isDark ? 'white' : 'black',
                }}
            />
            <View>
                <FlatList
                    data={[{ key: 'choate' }, { key: 'hudson' }]}
                    renderItem={({ item }) => {
                        if (item.key === 'choate') {
                            return renderWildlifeSection(
                                choateWildlifeData,
                                choateActiveIndex,
                                setChoateActiveIndex,
                                choateListRef
                            );
                        } else {
                            return renderWildlifeSection(
                                hudsonWildlifeData,
                                hudsonActiveIndex,
                                setHudsonActiveIndex,
                                hudsonListRef
                            );
                        }
                    }}
                    keyExtractor={(item) => item.key}
                    contentContainerStyle={styles.contentContainer}
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={true}
                />
            </View>
        </>
    );
}
