import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, ImageBackground, Image } from 'react-native';
import axios from 'axios';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function AiScreen({ navigation }) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [previewVisible, setPreviewVisible] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [aiReplyVisible, setAIVisible] = useState(false);
  const [speciesData,setSpeciesData] = useState([]);


  // permission handling
  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicture = () => {
    if (this.camera) {
      this.camera.takePictureAsync({ onPictureSaved: onPictureSaved });
    }
  };

  const __retakePicture = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
  }

  const onPictureSaved = (photo) => {
    setPreviewVisible(true)
    setCapturedImage(photo)
  }


  const __savePhoto = async () => {
    const uri = capturedImage.uri;
    uploadImage(uri);
    setAIVisible(true);
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setPreviewVisible(true);

      // Check if the result contains the 'assets' array
      if (result.assets && result.assets.length > 0) {
        // Use the first item in the 'assets' array
        setCapturedImage(result.assets[0]);
      } else {
        // Fallback to using the 'uri' property if 'assets' is not available (for older versions)
        setCapturedImage(result);
      }
    }
  };

  const toggleCameraType = () => {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  const uploadImage = async (imageUri) => {
    try {
      const formData = createFormData({ uri: imageUri });
      const response = await axios.post('http://192.168.1.211:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle the server response
      console.log(response.data.result.data.bestMatch);
      console.log(response.data.result.data.results);

      console.log(response.data.result.data.remainingIdentificationRequests)
      setSpeciesData(response.data.result.data.results);
    } catch (error) {
      // Handle errors
      console.error('Error uploading image: ', error);
    }
  };

  const createFormData = (photo, body = {}) => {
    const data = new FormData();

    data.append('photo', {
      name: 'photo.jpg',
      type: 'image/jpeg',
      uri: Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
    });

    // Append additional data to the FormData if needed
    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });

    return data;
  };

  return (
    <View style={styles.container}>
      {previewVisible && capturedImage ? (aiReplyVisible ? (<AIResponse speciesData={speciesData}/>) : ( <CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} /> )
      ) : (<Camera style={styles.camera} type={type} ref={(ref) => { this.camera = ref }} >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture} >
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={pickImage} >
            <Text style={styles.text}>Photo from Phone</Text>
          </TouchableOpacity>
        </View>
      </Camera>)}
    </View>
  );
}

const CameraPreview = ({ photo, retakePicture, savePhoto }) => {
  // console.log('The photo', photo)
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%'
      }}
    >
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={{
          flex: 1
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 15,
            justifyContent: 'flex-end'
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
          >
            <TouchableOpacity
              onPress={retakePicture}
              style={{
                width: 130,
                height: 40,

                alignItems: 'center',
                borderRadius: 4
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20
                }}
              >
                Re-take
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={savePhoto}
              style={{
                width: 130,
                height: 40,

                alignItems: 'center',
                borderRadius: 4
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20
                }}
              >
                analyze photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

const AIResponse = ({speciesData}) => {
  const loadingImages = [
    "https://cdn.dribbble.com/users/2882885/screenshots/7861928/media/a4c4da396c3da907e7ed9dd0b55e5031.gif",
    "https://media.tenor.com/DHkIdy0a-UkAAAAC/loading-cat.gif",
    "https://64.media.tumblr.com/bdaea39db57dc0b48d763262514268db/tumblr_mgj44mNyST1s199fdo1_500.gif",
    "https://cdn.dribbble.com/users/160117/screenshots/3197970/main.gif",
  ];
  // console.log('The photo', photo)

  
  const displaySpecies = (species) => {
    if (species.length > 0) { // valid array received
      return (
        <View style={styles.container} >
          {speciesData.map((singleSpecies, index) => (
            <Text key={index}>{Math.round(singleSpecies.score*10000)/100}% chance it's the {singleSpecies.species.scientificNameWithoutAuthor} (aka the {
              singleSpecies.species.commonNames[0]
            }). Is it invasive? {singleSpecies.invasive ? "Yes" : "No"}</Text>
          ))}
        </View>
      );
    } else { // an error or we're still waiting for a response from a server
      return (
        <View>
          <Text>Loading...</Text>
          <Image
            source={{ uri: loadingImages[Math.floor(Math.random() * loadingImages.length)] }}
            style={{ height: 500, width: 400 }} // Adjust the dimensions as needed
          />
        </View>
      );      
    }
    

  }

  return (
    displaySpecies(speciesData)
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

