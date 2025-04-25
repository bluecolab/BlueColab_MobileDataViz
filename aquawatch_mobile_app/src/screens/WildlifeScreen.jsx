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

