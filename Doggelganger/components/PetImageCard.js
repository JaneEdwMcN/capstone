import React from 'react';
import { Image, Text, View, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Icon } from 'expo';
import firebase from 'firebase';

const auth = firebase.auth();

export default class PetImageCard extends React.Component {

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
        this.setState({ loading: true, user: user });

      } else {
        console.log(null);
        this.setState({ loading: true });

      }
    });
  }

  saveFavorite = () => {
    const uid = this.state.user['uid']
    const petID = this.props.info[5]

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
      petID:  true
    });
  }

  removeFavPet = (uid, petID) => {
    firebase.database().ref('users/' + uid  + `/pets/` +  petID).remove();
  }

  render() {
    const { user } = this.state;

    if (user) {
      return        <View key={this.props.index}>
      <Text style={styles.titleText}> {this.props.info[0]} </Text>
      <Text> {this.props.info[4]}% </Text>
      <Image
      style={{width: 300, height: 300}}
      key={this.props.index}
      source={{uri: this.props.newImg}} />
      <Text
      style={{ fontSize: 20, color: 'purple', padding: 15 }}
      onPress={()=>Linking.openURL(this.props.info[3])}>
      Visit {this.props.info[0]} at Pefinder.com!
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
      return        <View key={this.props.index}>
      <Text style={styles.titleText}> {this.props.info[0]} </Text>
      <Text> {this.props.info[4]}% </Text>
      <Image
      style={{width: 300, height: 300}}
      key={this.props.index}
      source={{uri: this.props.newImg}} />
      <Text
      style={{ fontSize: 20, color: 'purple', padding: 15 }}
      onPress={()=>Linking.openURL(this.props.info[3])}>
      Visit {this.props.info[0]} at Pefinder.com!
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

PetImageCard.propTypes = {
  index: PropTypes.number.isRequired,
  user: PropTypes.object,
  info: PropTypes.array,
  newImg: PropTypes.string
};
