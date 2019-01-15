import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, StyleProvider, H1, Spinner } from "native-base";
import {  Font, AppLoading, Camera, Permissions, ImageManipulator } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import DisplayPetFinderResults from '../components/DisplayPetFinderResults';
import { CLARIFAI_API_KEY } from 'react-native-dotenv'
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import PropTypes from 'prop-types';

const Clarifai = require('clarifai');

const clarifai = new Clarifai.App({
  apiKey: CLARIFAI_API_KEY
});

export default class CameraScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      type: 'back',
      hasCameraPermission: null,
      imageResults: [],
      loadingResults: false,
      loading: true
    };
  }


  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });

    await Font.loadAsync({
      'Roboto': require('../node_modules/native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('../node_modules/native-base/Fonts/Roboto_medium.ttf'),
    });
    this.setState({ loading: false });
  }

  capturePhoto = async () => {
    if (this.camera) {
      console.log("photo taken");
      let photo = await this.camera.takePictureAsync();
      this.setState({ loadingResults: true });
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
    this.setState({ imageResults: imageResults, loadingResults: false });
  }

  toggleFacing = () => this.setState({ type: this.state.type === 'back' ? 'front' : 'back' });

  resetImageResults = () => this.setState({ imageResults:  [] });

  render() {
    const { hasCameraPermission, imageResults, loadingResults, loading } = this.state;
    if (loading) {
      return   <AppLoading />
    } else {
      if (hasCameraPermission === null) {
        return <View />;
      } else if (hasCameraPermission === false) {
        return <Text>No access to camera</Text>;
      }  else if (imageResults.length > 0) {
        return  <StyleProvider style={getTheme(material)}>
        <View   style={{
          flex: 1,
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 10,
          marginTop: 35
        }}>
        <Button small info style={ {marginBottom: 5, alignSelf: 'center'} } onPress={this.resetImageResults}>
        <Text style={styles.resetMatchesButton}>Reset Matches</Text>
        </Button>

        <DisplayPetFinderResults
        predictions={imageResults}
        navigation={this.props.navigation} />
        </View>
        </StyleProvider>
      } else if (loadingResults) {
        return <StyleProvider style={getTheme(material)}>
        <View style={styles.flexCenterCenter}>
        <H1 style={styles.loadingColor}>Loading...</H1>
        <Spinner color="#4C55FF" />
        </View>
        </StyleProvider>
      } else if (loadingResults === false && imageResults.length === 0) {
        return <StyleProvider style={getTheme(material)}>

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
        onPress={this.toggleFacing}
      style={styles.flexCenterCenter}>
        <Ionicons name="ios-reverse-camera" size={75} color="#4C55FF" />
        </TouchableOpacity>

        <Button full  large info onPress={this.findPetMatch}>
        <Text style={styles.findPetsButton}>Find Pets</Text>
        </Button>
        </View>
        </Camera>
        </View>
        </StyleProvider>
      }
    }
  }
}

CameraScreen.propTypes = {
  navigation: PropTypes.object
};

const styles = StyleSheet.create({
  findPetsButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  resetMatchesButton: {
    color: 'white',
    paddingLeft: 5,
    paddingRight: 5
  },
  flexCenterCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center"
  },
  loadingColor: {
    color: '#4C55FF',
    fontWeight: 'bold'
  }
});
