import React from 'react';
import { Image, Text, View, StyleSheet, Linking, TouchableOpacity } from 'react-native';

import PropTypes from 'prop-types';
import { Icon } from 'expo';
import firebase from 'firebase';

const auth = firebase.auth();

export default class PetMatches extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      favorite: "ios-star-outline",
      user: null
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
  }

  saveFavorite = () => {
    const uid = this.state.user['uid']
    const petID = this.props.pet["petID"]

    if (this.state.favorite === 'ios-star-outline'){
      this.storeFavPet(uid, petID);
      this.setState({ favorite: `ios-star` });
    } else {
      this.removeFavPet(uid, petID);
      this.setState({ favorite: `ios-star-outline` });
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

  render() {
    const { user } = this.state;
    if (user) {
      return        <View>
      <Text style={styles.titleText}> {this.props.pet["name"]} </Text>
      <Text> {this.props.pet["score"]}% </Text>
      <Text> {this.props.pet["breed"]} </Text>
      <Image
      style={{width: 300, height: 300}}
      source={{uri: this.props.photo}} />
      <Text
      style={{ fontSize: 20, color: 'purple', padding: 15 }}
      onPress={()=>Linking.openURL(this.props.pet['url'])}>
      Visit {this.props.pet['name']} at Pefinder.com!
      </Text>
      <TouchableOpacity
      onPress={this.saveFavorite}
      >
      <Icon.Ionicons
      name={this.state.favorite}
      size={26}
      style={{ marginBottom: -3 }}
      color={"purple"}
      />
      </TouchableOpacity>
      </View>
    } else {
      return        <View>
      <Text style={styles.titleText}> {this.props.pet['name']} </Text>
      <Text> {this.props.pet['score']}% </Text>
      <Image
      style={{width: 300, height: 300}}
      source={{uri: this.props.photo}} />
      <Text
      style={{ fontSize: 20, color: 'purple', padding: 15 }}
      onPress={()=>Linking.openURL(this.props.pet['url'])}>
      Visit {this.props.pet['name']} at Pefinder.com!
      </Text>
      </View>
    }

  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});

PetMatches.propTypes = {
  user: PropTypes.object,
  pet: PropTypes.object,
  photo: PropTypes.string
};
