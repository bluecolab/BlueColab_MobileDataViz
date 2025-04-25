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

import React from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import styles from '../../styles';

const choateWildlifeData = [
  {
    animalName: 'Largemouth Bass',
    scientificName: 'Micropterus salmoides',
    funFact: 'The largemouth bass is an ambush predator and often consumes prey in a single strike.',
    imageUri: 'https://th.bing.com/th/id/R.6dc550e4629145cbd44548c0b36a6145?rik=gHN9%2bthmmTih9A&riu=http%3a%2f%2fupload.wikimedia.org%2fwikipedia%2fcommons%2fe%2fed%2fLargemouth_bass_fish_underwater_animal_in_natural_habitat_micropterus_salmoides.jpg',
  },
  {
    animalName: 'Snapping Turtle',
    scientificName: 'Chelydra serpentina',
    funFact: 'Snapping turtles are capable of living over 100 years.',
    imageUri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Common_Snapping_Turtle_Close_Up.jpg/1280px-Common_Snapping_Turtle_Close_Up.jpg',
  },
  {
    animalName: 'Red-Eared Sliders',
    scientificName: 'Trachemys scripta elegans',
    funFact: 'Red-eared sliders are popular as pets but can live up to 30 years or more.',
    imageUri: 'https://www.thesprucepets.com/thmb/v96sCG04MaXcJJMoiB_sjH-846U=/5500x0/filters:no_upscale():strip_icc()/red-eared-slider-swimming-520669620-57fff0185f9b5805c2b11b7b.jpg',
  },
  {
    animalName: 'Goldfish',
    scientificName: 'Carassius auratus',
    funFact: 'Goldfish have a memory span of at least three months.',
    imageUri: 'https://image.mlive.com/home/mlive-media/pgfull/img/grandrapidspress/photo/2016/04/26/-22847150d92e4f23.JPG',
  },
  {
    animalName: 'Wood Ducks',
    scientificName: 'Aix sponsa',
    funFact: 'Wood ducks are one of the few duck species equipped with strong claws that help them perch in trees.',
    imageUri: 'https://www.allaboutbirds.org/guide/assets/photo/65533521-480px.jpg',
  },
  {
    animalName: 'Great Blue Heron',
    scientificName: 'Ardea herodias',
    funFact: 'Great blue herons swallow prey whole, rather than breaking it into smaller pieces.',
    imageUri: 'https://cdn.download.ams.birds.cornell.edu/api/v1/asset/60314281/1800',
  },
  {
    animalName: 'CrayFish',
    scientificName: 'Orconectes rusticus',
    funFact: 'Crayfish are omnivores and feed on small fish, tadpoles, and aquatic vegetation.',
    imageUri: 'https://fullserviceaquatics.com/wp-content/uploads/2012/04/pond_crayfish_main.jpg',
  },
  {
    animalName: 'Northern Water Snake',
    scientificName: 'Nerodia sipedon',
    funFact: 'Northern water snakes are non-venomous and primarily feed on fish and amphibians.',
    imageUri: 'https://www.mass.gov/files/styles/embedded_full_width/public/images/2022-08/northernwatersnakstockcrop_0.jpg?itok=aSzaOBR7',
  },
  {
    animalName: 'Green Frog',
    scientificName: 'Rana clamitans',
    funFact: 'Male green frogs have a loud and distinctive call that resembles the plucking of a loose banjo string.',
    imageUri: 'https://www.thesprucepets.com/thmb/lyR-o9nIgJRke0rZOEPu5j2gIxY=/2122x0/filters:no_upscale():strip_icc()/95724120-56a2bcee5f9b58b7d0cdf874.jpg',
  },
  {
    animalName: 'Bullfrog',
    scientificName: 'Lithobates catesbeianus',
    funFact: 'Bullfrogs are known for their deep croaking calls that sound like a cow\'s moo.',
    imageUri: 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/1-bullfrog-smithtown-new-york-bob-savage.jpg',
  },
];

const WildlifeScreen = () => {
  return (
    <View style={styles.wildLifeContainer}>
      <Text style={styles.paragraphTextWildlife}>Wildlife in Choate Pond</Text>
      <FlatList
        data={choateWildlifeData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUri }} style={styles.smallImage} />
            <Text style={styles.animalName}>{item.animalName}</Text>
            <Text style={styles.scientificName}>{item.scientificName}</Text>
            <Text style={styles.funFact}>{item.funFact}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default WildlifeScreen;

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
