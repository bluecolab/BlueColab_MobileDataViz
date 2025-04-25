import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import { DateTime } from 'luxon';

const windowWidth = Dimensions.get('window').width;

const WildlifeScreen = () => {
  // State to track the current carousel indices
  const [choateActiveIndex, setChoateActiveIndex] = useState(0);
  const [hudsonActiveIndex, setHudsonActiveIndex] = useState(0);

  // Function to check the current season
  const getCurrentSeason = () => {
    const month = DateTime.now().month;
    
    if ([12, 1, 2, 3, 4, 5, 6, 7, 8].includes(month)) return 'winter';
    return 'fall';
  }

  const currentSeason = getCurrentSeason();
  const currentDate = DateTime.now().toFormat('MMMM d, yyyy');

  // Base wildlife data with regular fun facts
  const choateWildlifeBase = [
    {
      animalName: "Largemouth bass",
      scientificName: "Micropterus salmoides",
      defaultFact: "The largemouth bass is an ambush predator and often consumes prey in a single strike.",
      imageUri: "https://th.bing.com/th/id/R.6dc550e4629145cbd44548c0b36a6145?rik=gHN9%2bthmmTih9A&riu=http%3a%2f%2fupload.wikimedia.org%2fwikipedia%2fcommons%2fe%2fed%2fLargemouth_bass_fish_underwater_animal_in_natural_habitat_micropterus_salmoides.jpg&ehk=BjhvQX7mchDiAAH0iVqhZ7QGdUjUlcL9SFFuNcRo6PM%3d&risl=&pid=ImgRaw&r=0",
      seasonalFacts: {
        winter: "Largemouth Bass are currently slowing down their activity levels, seeking deeper water while feeding less frequently due to the colder temperatures affecting their metabolism."
      }
    },
    {
      animalName: "Snapping turtle",
      scientificName: "Chelydra serpentina",
      defaultFact: "Snapping turtles are capable of living over 100 years.",
      imageUri: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Common_Snapping_Turtle_Close_Up.jpg/1280px-Common_Snapping_Turtle_Close_Up.jpg",
      seasonalFacts: {
        winter: "Snapping Turtles in Choate Pond are entering a period of reduced activity, seeking out burrows or deeper water to hibernate and conserve energy during the colder months."
      }
    },
    {
      animalName: "Red-Eared Sliders",
      scientificName: "Trachemys scripta elegans",
      defaultFact: "Red-eared sliders are popular as pets but can live up to 30 years or more.",
      imageUri: "https://www.thesprucepets.com/thmb/v96sCG04MaXcJJMoiB_sjH-846U=/5500x0/filters:no_upscale():strip_icc()/red-eared-slider-swimming-520669620-57fff0185f9b5805c2b11b7b.jpg",
      seasonalFacts: {
        winter: "Red-Eared Sliders in Choate Pond are likely experiencing decreased activity levels, seeking shelter in aquatic environments or burrowing into mud to hibernate or limit their movements at this time of year."
      }
    },
    {
      animalName: "Goldfish",
      scientificName: "Carassius auratus",
      defaultFact: "Goldfish have a memory span of at least three months.",
      imageUri: "https://image.mlive.com/home/mlive-media/pgfull/img/grandrapidspress/photo/2016/04/26/-22847150d92e4f23.JPG",
      seasonalFacts: {
        winter: "Goldfish in Choate Pond continue to forage actively for food and adapt to varying water temperatures, displaying heightened movement and activity levels compared to some native fish species in the pond."
      }
    },
    {
      animalName: "Wood Ducks",
      scientificName: "Aix sponsa",
      defaultFact: "Wood ducks are one of the few duck species equipped with strong claws that help them perch in trees.",
      imageUri: "https://www.allaboutbirds.org/guide/assets/photo/65533521-480px.jpg",
      seasonalFacts: {
        winter: "Wood Ducks, seasonal residents of Choate Pond, are migrating to wintering grounds, moving to open waters or coastal habitats to escape freezing temperatures and find suitable feeding areas."
      }
    },
    {
      animalName: "Great Blue Heron",
      scientificName: "Ardea herodias",
      defaultFact: "Great blue herons swallow prey whole, rather than breaking it into smaller pieces.",
      imageUri: "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/60314281/1800",
      seasonalFacts: {
        winter: "Great Blue Herons are continuing to forage for fish in open waters or move to areas with less ice cover to hunt for food."
      }
    },
    {
      animalName: "CrayFish",
      scientificName: "Orconectes rusticus",
      defaultFact: "Crayfish are omnivores and feed on small fish, tadpoles, and aquatic vegetation.",
      imageUri: "https://fullserviceaquatics.com/wp-content/uploads/2012/04/pond_crayfish_main.jpg",
      seasonalFacts: {
        winter: "Crayfish may experience reduced activity, seeking refuge in burrows or deeper water to survive the colder temperatures, at this time of year."
      }
    },
    {
      animalName: "Northern Water Snake",
      scientificName: "Nerodia sipedon",
      defaultFact: "Northern water snakes are non-venomous and primarily feed on fish and amphibians.",
      imageUri: "https://www.mass.gov/files/styles/embedded_full_width/public/images/2022-08/northernwatersnakstockcrop_0.jpg?itok=aSzaOBR7",
      seasonalFacts: {
        winter: "Northern Water Snakes of Choate Pond are going into hibernation or brumation, seeking shelter in dens or burrows to survive the cold weather."
      }
    },
    {
      animalName: "Green Frog",
      scientificName: "Rana clamitans",
      defaultFact: "Male green frogs have a loud and distinctive call that resembles the plucking of a loose banjo string.",
      imageUri: "https://www.thesprucepets.com/thmb/lyR-o9nIgJRke0rZOEPu5j2gIxY=/2122x0/filters:no_upscale():strip_icc()/95724120-56a2bcee5f9b58b7d0cdf874.jpg",
      seasonalFacts: {
        winter: "Green Frogs are currently exhibiting reduced activity levels, possibly hibernating or seeking shelter in mud at the bottom of Choate Pond to survive the cold weather."
      }
    },
    {
      animalName: "Bullfrog",
      scientificName: "Lithobates catesbeianus",
      defaultFact: "Bullfrogs are known for their deep croaking calls that sound like a cow's moo.",
      imageUri: "https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/1-bullfrog-smithtown-new-york-bob-savage.jpg",
      seasonalFacts: {
        winter: "Bullfrogs are entering a state of dormancy or hibernation by seeking refuge in the mud at the bottom of Choate Pond of water to endure the cold temperatures."
      }
    },
  ];

  const hudsonWildlifeBase = [
    {
      animalName: "Atlantic Sturgeon",
      scientificName: "Acipenser oxyrinchus oxyrinchus",
      defaultFact: "Atlantic sturgeon can live up to 60 years and migrate over 1400 miles.",
      imageUri: "https://th.bing.com/th/id/OIP.Pk0oZ6sKQmvri258EwgbEAHaFj?pid=ImgDet&rs=1",
      seasonalFacts: {
        summer: "Female Atlantic Sturgeon, aged 2 to 5 years, are currently laying eggs in the Hudson River",
        winter: "Female Atlantic Sturgeon in Northeast America are currently spawning and laying eggs in rivers like the Hudson River."
      }
    },
    {
      animalName: "Diamondback Terrapin",
      scientificName: "Malaclemys terrapin",
      defaultFact: "Diamondback terrapins are the only turtle species in North America that inhabit estuarine habitats exclusively.",
      imageUri: "https://th.bing.com/th/id/R.ea7fece4729197bf548c724e2ee896ed?rik=a48QKyM8pfxhXg&riu=http%3a%2f%2ffarm6.staticflickr.com%2f5231%2f7165621250_c7629dc1a5_o_d.jpg&ehk=j4ooaqMGC%2fNdBOgCs%2fd%2fYaBe2Kx4BuPSn5EdZCmcnp8%3d&risl=&pid=ImgRaw&r=0",
      seasonalFacts: {
        winter: "Many Diamondback Terrapin are in a state of brumation, a reptilian hibernation, during Winter."
      }
    },
    {
      animalName: "Lined Seahorse",
      scientificName: "Hippocampus erectus",
      defaultFact: "Seahorses use their long snouts to suck up tiny shrimp and plankton.",
      imageUri: "https://live.staticflickr.com/6217/6316824300_49c319eb2b_b.jpg",
      seasonalFacts: {
        summer: "Lined seahorses are currently engaging in breeding rituals, including courtship dances, reproduction, and seeking sheltered habitats to ensure their survival and reproductive success.",
        winter: "Lined Seahorses are currently reducing their activity levels, seeking sheltered and warmer areas to escape colder temperatures, potentially decreasing their reproductive and feeding activities during this December."
      }
    },
    {
      animalName: "Blue Crab",
      scientificName: "Callinectes sapidus",
      defaultFact: "Blue crabs are named for their blue claws and are one of the most recognizable crab species.",
      imageUri: "https://th.bing.com/th/id/OIP.iTsbymGPQ2wXr-Q9dnS-jgHaE8?pid=ImgDet&rs=1",
      seasonalFacts: {
        winter: "Blue Crabs are currently migrating to deeper, warmer waters, or become less active and enter a state of torpor due to the cooler temperatures."
      }
    },
    {
      animalName: "Humpback Whale",
      scientificName: "Megaptera novaeangliae",
      defaultFact: "Humpback whales are known for their magical songs, which can last for hours.",
      imageUri: "https://th.bing.com/th/id/R.0597795217c0fd35b1a5276cf8dc4dc4?rik=kXyr6duUrZt8nA&riu=http%3a%2f%2f2.bp.blogspot.com%2f-hRXrWYgdhvA%2fTtG0Oshp85I%2fAAAAAAAAFFQ%2fWSJVQhs6C8M%2fs1600%2fHumpback%2bWhale%2bunderwater.jpg&ehk=OmLVx%2bKtw3KuTusunRZvP76po56jLuoQs%2fSuTlo2pv8%3d&risl=&pid=ImgRaw&r=0",
      seasonalFacts: {
        winter: "Humpback Whales are currently migrating southward towards warmer waters for breeding and calving after feeding in the northern regions during the summer and fall."
      }
    },
    {
      animalName: "Great Blue Heron",
      scientificName: "Ardea herodias",
      defaultFact: "Great blue herons swallow prey whole, rather than breaking it into smaller pieces.",
      imageUri: "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/60314281/1800",
      seasonalFacts: {
        winter: "Great Blue Herons are continuing to forage for fish in open waters or move to areas with less ice cover to hunt for food."
      }
    },
    {
      animalName: "American Shad",
      scientificName: "Alosa sapidissima",
      defaultFact: "American shad are anadromous fish that spend most of their lives in the ocean but return to freshwater rivers to spawn.",
      imageUri: "https://www.fws.gov/sites/default/files/styles/facebook_1200x630/public/banner_images/2021-06/American%20shad.jpg?h=a4c76022&itok=vYCojAe0",
      seasonalFacts: {
        winter: "During Winter, American Shad are spawning in the Hudson River after migrating from the ocean."
      }
    },
    {
      animalName: "Mink",
      scientificName: "Neovison vison",
      defaultFact: "Minks are excellent swimmers and are known to prey on fish, birds, and small mammals.",
      imageUri: "https://calphotos.berkeley.edu/imgs/512x768/8235_3181/2555/0081.jpeg",
      seasonalFacts: {
        winter: "Minks are currently focusing on foraging for food, grooming their winter fur, and seeking shelter to endure the colder weather conditions."
      }
    },
    {
      animalName: "American Eel",
      scientificName: "Anguilla rostrata",
      defaultFact: "American eels can travel thousands of miles during their migration from freshwater to saltwater.",
      imageUri: "https://th.bing.com/th/id/OIP.t0RrvsP9s7EKMFvlNG-PEAHaE7?pid=ImgDet&rs=1",
      seasonalFacts: {
        winter: "American Eels are currently migrating downstream to brackish waters or estuaries in preparation for their spawning phase, triggered by cooler temperatures."
      }
    },
    {
      animalName: "Eastern Red-backed Salamander",
      scientificName: "Plethodon cinereus",
      defaultFact: "Eastern red-backed salamanders are lungless amphibians that breathe through their skin.",
      imageUri: "https://live.staticflickr.com/2548/5739708251_48ed49dc85_b.jpg",
      seasonalFacts: {
        winter: "Eastern Red Backed Salamanders are currently undergoing a period of hibernation, seeking refuge in underground shelters to survive the colder temperatures."
      }
    },
  ];

  // Process wildlife data to include seasonal facts
  const processWildlifeData = (baseData) => {
    return baseData.map(animal => {
      const funFact = animal.seasonalFacts && animal.seasonalFacts[currentSeason] 
        ? animal.seasonalFacts[currentSeason] 
        : animal.defaultFact;
      
      return {
        ...animal,
        funFact
      };
    });
  };

  const choateWildlifeData = processWildlifeData(choateWildlifeBase);
  const hudsonWildlifeData = processWildlifeData(hudsonWildlifeBase);

  // Styles for the component
  const styles = {
    container: {
      flex: 1,
      backgroundColor: '#f7f7f7',
      paddingBottom: 40
    },
    header: {
      backgroundColor: '#2c2d35',
      padding: 15
    },
    headerText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 10
    },
    sectionHeader: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#333',
      backgroundColor: '#e0e0e0',
      padding: 12,
      marginTop: 16,
      marginBottom: 12
    },
    dateText: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 15,
      color: '#333'
    },
    cardContainer: {
      width: windowWidth * 0.85,
      marginHorizontal: windowWidth * 0.075,
      marginVertical: 12,
      borderRadius: 12,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
      overflow: 'hidden'
    },
    imageContainer: {
      width: '100%',
      height: 200, // Fixed height for images
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      overflow: 'hidden'
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover'
    },
    cardContent: {
      padding: 15
    },
    animalName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5
    },
    scientificName: {
      fontSize: 16,
      fontStyle: 'italic',
      color: '#666',
      marginBottom: 12
    },
    factText: {
      fontSize: 16,
      color: '#333',
      lineHeight: 22
    },
    paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 15
    },
    paginationDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginHorizontal: 5
    },
    activeDot: {
      backgroundColor: '#007AFF'
    },
    inactiveDot: {
      backgroundColor: '#ccc'
    }
  };

  // Custom carousel implementation
  const renderCarousel = (data, activeIndex, setActiveIndex) => {
    return (
      <View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={windowWidth * 0.85 + windowWidth * 0.15} // Width of card + margins
          decelerationRate="fast"
          onMomentumScrollEnd={(event) => {
            const position = event.nativeEvent.contentOffset.x;
            const index = Math.round(position / (windowWidth * 0.85 + windowWidth * 0.075));
            setActiveIndex(index);
          }}
          contentContainerStyle={{ paddingHorizontal: windowWidth * 0.075/2 }}
        >
          {data.map((item, index) => (
            <View key={index} style={styles.cardContainer}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.imageUri }}
                  style={styles.image}
                />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.animalName}>{item.animalName}</Text>
                <Text style={styles.scientificName}>{item.scientificName}</Text>
                <Text style={styles.factText}>{item.funFact}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        
        {/* Pagination dots */}
        <View style={styles.paginationContainer}>
          {data.map((_, index) => (
            <TouchableOpacity 
              key={index}
              onPress={() => setActiveIndex(index)}
            >
              <View
                style={[
                  styles.paginationDot,
                  index === activeIndex ? styles.activeDot : styles.inactiveDot
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerText}>Wildlife</Text>
        </View>
        
        <Text style={styles.dateText}>
          Wildlife Activity on {currentDate}
        </Text>

        {/* Choate Pond wildlife carousel */}
        <Text style={styles.sectionHeader}>
          Wildlife in Choate Pond:
        </Text>
        {renderCarousel(choateWildlifeData, choateActiveIndex, setChoateActiveIndex)}

        {/* Hudson River wildlife carousel */}
        <Text style={styles.sectionHeader}>
          Wildlife in The Hudson River:
        </Text>
        {renderCarousel(hudsonWildlifeData, hudsonActiveIndex, setHudsonActiveIndex)}
      </ScrollView>
    </SafeAreaView>
  );
};

export default WildlifeScreen;

//current that needs updating

// import React from 'react';
// import { View, Text, FlatList, Image } from 'react-native';
// import styles from '../../styles'; 

// const WildlifeScreen = () => {
//     const choateWildlifeData = [
//         {
//             animalName: 'Largemouth Bass',
//             scientificName: 'Micropterus Salmoides',
//             funFact: 'The largemouth bass is an ambush predator and often consumes prey in a single strike.',
//             imageUri: 'https://images.unsplash.com/photo-1601248981942-89b99a5b7427?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//         },
//         {
//             animalName: 'Snapping Turtle',
//             scientificName: 'Chelydra Serpentina',
//             funFact: 'Snapping turtles are capable of living over 100 years.',
//             imageUri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Common_Snapping_Turtle_Close_Up.jpg/1280px-Common_Snapping_Turtle_Close_Up.jpg',
//         },
//         // Add more wildlife data as needed...

//     ];

//     return (
//         <View style={styles.wildLifeContainer}>
//             <Text style={styles.paragraphTextWildlife}>Wildlife in Choate Pond</Text>
      
//             <FlatList
//                 data={choateWildlifeData}
//                 horizontal
//                 pagingEnabled
//                 showsHorizontalScrollIndicator={false}
//                 keyExtractor={(item, index) => index.toString()}
//                 renderItem={({ item }) => (
//                     <View style={styles.card}>
//                         <Image 
//                             source={{ uri: item.imageUri }} 
//                             style={styles.smallImage} 
//                         />
//                         <Text style={styles.animalName}>{item.animalName}</Text>
//                         <Text style={styles.scientificName}>{item.scientificName}</Text>
//                         <Text style={styles.funFact}>{item.funFact}</Text>
//                     </View>
//                 )}
//             />
//         </View>
//     );
// };

// export default WildlifeScreen;


//without seasons not working correctly tho
// import React from 'react';
// import { View, Text, FlatList, Image } from 'react-native';
// import styles from '../../styles';

// const choateWildlifeData = [
//   {
//     animalName: 'Largemouth Bass',
//     scientificName: 'Micropterus salmoides',
//     funFact: 'The largemouth bass is an ambush predator and often consumes prey in a single strike.',
//     imageUri: 'https://th.bing.com/th/id/R.6dc550e4629145cbd44548c0b36a6145?rik=gHN9%2bthmmTih9A&riu=http%3a%2f%2fupload.wikimedia.org%2fwikipedia%2fcommons%2fe%2fed%2fLargemouth_bass_fish_underwater_animal_in_natural_habitat_micropterus_salmoides.jpg',
//   },
//   {
//     animalName: 'Snapping Turtle',
//     scientificName: 'Chelydra serpentina',
//     funFact: 'Snapping turtles are capable of living over 100 years.',
//     imageUri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Common_Snapping_Turtle_Close_Up.jpg/1280px-Common_Snapping_Turtle_Close_Up.jpg',
//   },
//   {
//     animalName: 'Red-Eared Sliders',
//     scientificName: 'Trachemys scripta elegans',
//     funFact: 'Red-eared sliders are popular as pets but can live up to 30 years or more.',
//     imageUri: 'https://www.thesprucepets.com/thmb/v96sCG04MaXcJJMoiB_sjH-846U=/5500x0/filters:no_upscale():strip_icc()/red-eared-slider-swimming-520669620-57fff0185f9b5805c2b11b7b.jpg',
//   },
//   {
//     animalName: 'Goldfish',
//     scientificName: 'Carassius auratus',
//     funFact: 'Goldfish have a memory span of at least three months.',
//     imageUri: 'https://image.mlive.com/home/mlive-media/pgfull/img/grandrapidspress/photo/2016/04/26/-22847150d92e4f23.JPG',
//   },
//   {
//     animalName: 'Wood Ducks',
//     scientificName: 'Aix sponsa',
//     funFact: 'Wood ducks are one of the few duck species equipped with strong claws that help them perch in trees.',
//     imageUri: 'https://www.allaboutbirds.org/guide/assets/photo/65533521-480px.jpg',
//   },
//   {
//     animalName: 'Great Blue Heron',
//     scientificName: 'Ardea herodias',
//     funFact: 'Great blue herons swallow prey whole, rather than breaking it into smaller pieces.',
//     imageUri: 'https://cdn.download.ams.birds.cornell.edu/api/v1/asset/60314281/1800',
//   },
//   {
//     animalName: 'CrayFish',
//     scientificName: 'Orconectes rusticus',
//     funFact: 'Crayfish are omnivores and feed on small fish, tadpoles, and aquatic vegetation.',
//     imageUri: 'https://fullserviceaquatics.com/wp-content/uploads/2012/04/pond_crayfish_main.jpg',
//   },
//   {
//     animalName: 'Northern Water Snake',
//     scientificName: 'Nerodia sipedon',
//     funFact: 'Northern water snakes are non-venomous and primarily feed on fish and amphibians.',
//     imageUri: 'https://www.mass.gov/files/styles/embedded_full_width/public/images/2022-08/northernwatersnakstockcrop_0.jpg?itok=aSzaOBR7',
//   },
//   {
//     animalName: 'Green Frog',
//     scientificName: 'Rana clamitans',
//     funFact: 'Male green frogs have a loud and distinctive call that resembles the plucking of a loose banjo string.',
//     imageUri: 'https://www.thesprucepets.com/thmb/lyR-o9nIgJRke0rZOEPu5j2gIxY=/2122x0/filters:no_upscale():strip_icc()/95724120-56a2bcee5f9b58b7d0cdf874.jpg',
//   },
//   {
//     animalName: 'Bullfrog',
//     scientificName: 'Lithobates catesbeianus',
//     funFact: 'Bullfrogs are known for their deep croaking calls that sound like a cow\'s moo.',
//     imageUri: 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/1-bullfrog-smithtown-new-york-bob-savage.jpg',
//   },
// ];

// const WildlifeScreen = () => {
//   return (
//     <View style={styles.wildLifeContainer}>
//       <Text style={styles.paragraphTextWildlife}>Wildlife in Choate Pond</Text>
//       <FlatList
//         data={choateWildlifeData}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <Image source={{ uri: item.imageUri }} style={styles.smallImage} />
//             <Text style={styles.animalName}>{item.animalName}</Text>
//             <Text style={styles.scientificName}>{item.scientificName}</Text>
//             <Text style={styles.funFact}>{item.funFact}</Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// export default WildlifeScreen;

//added seasons

// import React from 'react';
// import { View, Text, FlatList, Image } from 'react-native';
// import { DateTime } from 'luxon';
// import styles from '../../styles';

// const currentMonth = DateTime.local().month;
// const isWinter = [12, 1, 2].includes(currentMonth);

// previous version had may and june as summer but i updated it to summer season...
// const isSummer = [6, 7, 8].includes(currentMonth);

// // Shared seasonal logic
// const applySeasonalFacts = (animal) => {
//   const seasonalFacts = animal.seasonalFacts || {};
//   if (isWinter && seasonalFacts.winter) return { ...animal, funFact: seasonalFacts.winter };
//   if (isSummer && seasonalFacts.summer) return { ...animal, funFact: seasonalFacts.summer };
//   return animal;
// };

// // Wildlife Data
// const choateWildlife = [
//   {
//     animalName: 'Largemouth Bass',
//     scientificName: 'Micropterus salmoides',
//     funFact: 'The largemouth bass is an ambush predator and often consumes prey in a single strike.',
//     imageUri: 'https://th.bing.com/th/id/R.6dc550e4629145cbd44548c0b36a6145?rik=gHN9%2bthmmTih9A&riu=http%3a%2f%2fupload.wikimedia.org%2fwikipedia%2fcommons%2fe%2fed%2fLargemouth_bass_fish_underwater_animal_in_natural_habitat_micropterus_salmoides.jpg&ehk=BjhvQX7mchDiAAH0iVqhZ7QGdUjUlcL9SFFuNcRo6PM%3d&risl=&pid=ImgRaw&r=0',
//     seasonalFacts: {
//       winter: 'Largemouth Bass are currently slowing down their activity levels due to colder temperatures.',
//     },
//   },
//   {
//     animalName: 'Snapping Turtle',
//     scientificName: 'Chelydra serpentina',
//     funFact: 'Snapping turtles can live over 100 years.',
//     imageUri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Common_Snapping_Turtle_Close_Up.jpg/1280px-Common_Snapping_Turtle_Close_Up.jpg',
//     seasonalFacts: {
//       winter: 'Snapping Turtles are entering a period of reduced activity and hibernation during winter.',
//     },
//   },
//   {
//     animalName: 'Red-Eared Sliders',
//     scientificName: 'Trachemys scripta elegans',
//     funFact: 'Red-eared sliders are popular as pets and can live 30+ years.',
//     imageUri: 'https://www.thesprucepets.com/thmb/v96sCG04MaXcJJMoiB_sjH-846U=/5500x0/filters:no_upscale():strip_icc()/red-eared-slider-swimming-520669620-57fff0185f9b5805c2b11b7b.jpg',
//     seasonalFacts: {
//       winter: 'Red-Eared Sliders are less active and may hibernate in aquatic mud.',
//     },
//   },
//   // Add other Choate animals here using same pattern...
// ];

// const hudsonWildlife = [
//   {
//     animalName: 'Atlantic Sturgeon',
//     scientificName: 'Acipenser oxyrinchus oxyrinchus',
//     funFact: 'Atlantic sturgeon can live up to 60 years.',
//     imageUri: 'https://th.bing.com/th/id/OIP.Pk0oZ6sKQmvri258EwgbEAHaFj?pid=ImgDet&rs=1',
//     seasonalFacts: {
//       winter: 'Female Atlantic Sturgeon are currently spawning in the Hudson River.',
//       summer: 'Female Atlantic Sturgeon are laying eggs in the Hudson River.',
//     },
//   },
//   {
//     animalName: 'Lined Seahorse',
//     scientificName: 'Hippocampus erectus',
//     funFact: 'Seahorses use their long snouts to suck up shrimp and plankton.',
//     imageUri: 'https://live.staticflickr.com/6217/6316824300_49c319eb2b_b.jpg',
//     seasonalFacts: {
//       winter: 'Lined Seahorses seek warmer waters, reducing activity.',
//       summer: 'Lined Seahorses engage in breeding rituals in summer.',
//     },
//   },
//   // Add other Hudson animals here...
// ];

// const WildlifeSection = ({ title, data }) => (
//   <View style={{ marginBottom: 20 }}>
//     <Text style={styles.paragraphTextWildlife}>{title}</Text>
//     <FlatList
//       data={data.map(applySeasonalFacts)}
//       horizontal
//       pagingEnabled
//       keyExtractor={(item, index) => `${title}-${index}`}
//       showsHorizontalScrollIndicator={false}
//       renderItem={({ item }) => (
//         <View style={styles.card}>
//           <Image source={{ uri: item.imageUri }} style={styles.smallImage} />
//           <Text style={styles.animalName}>{item.animalName}</Text>
//           <Text style={styles.scientificName}>{item.scientificName}</Text>
//           <Text style={styles.funFact}>{item.funFact}</Text>
//         </View>
//       )}
//     />
//   </View>
// );

// const WildlifeScreen = () => (
//   <View style={styles.wildLifeContainer}>
//     <Text style={styles.dateText}>Wildlife Activity - {DateTime.local().toLocaleString(DateTime.DATE_FULL)}</Text>
//     <WildlifeSection title="Wildlife in Choate Pond" data={choateWildlife} />
//     <WildlifeSection title="Wildlife in The Hudson River" data={hudsonWildlife} />
//   </View>
// );

// export default WildlifeScreen;
