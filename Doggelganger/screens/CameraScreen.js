import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions, ImageManipulator } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import DisplayPetFinderResults from '../components/DisplayPetFinderResults';
import { CLARIFAI_API_KEY } from 'react-native-dotenv'

const Clarifai = require('clarifai');

const clarifai = new Clarifai.App({
  apiKey: CLARIFAI_API_KEY
});

export default class App extends React.Component {
  state = {
    type: 'back',
    hasCameraPermission: null,
    imageResults: [],
    loading: false
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  capturePhoto = async () => {
    if (this.camera) {
      console.log("photo taken");
      let photo = await this.camera.takePictureAsync();
      this.setState({ loading: true });
      return photo.uri;
    }
  };

  resize = async photo => {
    console.log("resizing");
    let manipulatedImage = await ImageManipulator.manipulateAsync(
      photo,
      [{ resize: { height: 300, width: 300 } }],
      { base64: true }
    );
    return manipulatedImage.base64;
  };

  findSimilarImages = async image => {
    console.log("finding similar images");
    let imageResults = await clarifai.inputs.search({ input: {base64: image} });
    return imageResults["hits"];
  };

  findPetMatch = async () => {
    console.log("finding pet match");

    let photo = await this.capturePhoto();
    let resized = await this.resize(photo);
    let imageResults = await this.findSimilarImages(resized);
    this.setState({ imageResults: imageResults, loading: false });
  }

  toggleFacing = () => this.setState({ type: this.state.type === 'back' ? 'front' : 'back' });

  resetImageResults = () => this.setState({ imageResults:  [] });

  render() {
    const { hasCameraPermission, imageResults, loading } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }  else if (imageResults.length > 0) {
      return (
        <View>
        <TouchableOpacity
        onPress={this.resetImageResults}
        >
        <Text style={{ fontSize: 30, color: 'purple', }}>X</Text>
        </TouchableOpacity>
        <DisplayPetFinderResults predictions={imageResults}/>
        </View>
      )
    } else if (loading) {
      return <Text style={{ fontSize: 35, color: 'purple', padding: 15 }}>Loading...</Text>;
    } else if (loading === false && imageResults.length === 0) {
      return (
        <View style={{ flex: 1 }}>
        <Camera
        ref={ref => {
          this.camera = ref;
        }}
        style={{ flex: 1 }}
        type={this.state.type}
        >
        <View
        style={{
          flex: 1,
          backgroundColor: 'transparent',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}
        >
        <View
        style={{
          flex: 1,
          alignSelf: 'flex-start',
          alignItems: 'center',
        }}
        >
        </View>

        <TouchableOpacity
        onPress={this.toggleFacing}>
        <Ionicons name="ios-reverse-camera" size={50} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
        style={{
          flex: 0.1,
          alignItems: 'center',
          backgroundColor: 'purple',
          height: '20%',
        }}
        onPress={this.findPetMatch}
        >
        <Text style={{ fontSize: 30, color: 'white', padding: 15 }}>
        {' '}
        Find Pets{' '}
        </Text>
        </TouchableOpacity>
        </View>
        </Camera>
        </View>
      );
    }
  }
}
