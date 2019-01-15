import React from 'react';
import { Font, AppLoading, Icon } from 'expo';

import { Image, View, Linking, Dimensions, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import { Button, Text, StyleProvider, Card, CardItem, Left, Body, H1 } from "native-base";
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';

import firebase from 'firebase';

const auth = firebase.auth();
const deviceWidth = Dimensions.get("window").width;

export default class PetMatches extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      favorite: `star-circle`,
      favoriteText: 'Save to Favorites',
      user: null,
      loading: true
    };
  }

  async componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user != null) {
        this.setState({ user: user });
      } else {
        this.setState({ user: null });
      }
    });

    await Font.loadAsync({
      'Roboto': require('../node_modules/native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('../node_modules/native-base/Fonts/Roboto_medium.ttf'),
    });
    this.setState({ loading: false });
  }

  saveFavorite = () => {
    const uid = this.state.user['uid']
    const petID = this.props.pet["petID"]

    if (this.state.favorite === 'star-circle'){
      this.storeFavPet(uid, petID);
      this.setState({ favorite: `star-circle-outline`, favoriteText: "Saved!" });
    } else {
      this.removeFavPet(uid, petID);
      this.setState({ favorite: `star-circle`, favoriteText: "Save to Favorites" });
    }
  }

  storeFavPet = (uid, petID) => {
    firebase.database().ref('users/' + uid  + `/pets/` +  petID).update({
      score:  this.props.pet["score"],
      name: this.props.pet["name"],
      breed: this.props.pet["breed"],
      photo: this.props.photo,
      url: this.props.pet["url"],
      petID: this.props.pet["petID"]
    });
  }

  removeFavPet = (uid, petID) => {
    firebase.database().ref('users/' + uid  + `/pets/` +  petID).remove();
  }

  loginOrFavoriteButton = ( user, favorite, favoriteText ) => {
    if (user) {
      return         <Button
      info
      iconLeft
      onPress={this.saveFavorite}>
      <Icon.MaterialCommunityIcons
      name={favorite}
      size={26}
      color={ "white"}
      style={{ marginLeft: 3 }}
      />
      <Text>{ favoriteText }</Text>
      </Button>
    } else {
      return   <Button
      info
      title="Go to Details"
      onPress={() => this.props.navigation.navigate('Home')}
      >
      <Text> Login to save your favorites!</Text>
      </Button>
    }
  }

  render() {
    const { user, favorite, favoriteText, loading } = this.state;
    if (loading) {
      return   <AppLoading />
    } else {
      return       <StyleProvider style={getTheme(material)}>
      <View>
      <Card>
      <CardItem bordered>
      <Left>
      <Body>
      <H1>{this.props.pet["name"]}</H1>
      <Text note>{this.props.pet["score"]}% match!</Text>
      <Text note>{this.props.pet["breed"]} </Text>
      </Body>
      </Left>
      </CardItem>

      <CardItem>
      <Body>
      <Image
      style={{
        alignSelf: "center",
        height: 300,
        resizeMode: "cover",
        width: deviceWidth / 1.18,
        marginVertical: 5
      }}
      source={{uri: this.props.photo}}
      />
      <Button>
      <Text
      style={styles.petfinderProfileButton}
      onPress={()=>Linking.openURL(this.props.pet['url'])}>
      Visit Pefinder Profile
      </Text>
      </Button>

      </Body>
      </CardItem>
      <CardItem style={{ paddingVertical: 0 }}>
      <Left>
      { this.loginOrFavoriteButton(user, favorite, favoriteText) }
      </Left>
      </CardItem>
      </Card>
      </View>
      </StyleProvider>
    }
  }
}

PetMatches.propTypes = {
  user: PropTypes.object,
  pet: PropTypes.object,
  photo: PropTypes.string
};

const styles = StyleSheet.create({
  petfinderProfileButton: {
    color: '#4C55FF'
  }
});
