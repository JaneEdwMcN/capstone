import React from 'react';
import { FlatList, Text, View, StyleSheet, ListItem, List, TouchableOpacity } from 'react-native';

import PropTypes from 'prop-types';
import { Icon } from 'expo';
import firebase from 'firebase';
import axios from 'axios';

import { PETFINDER_API_KEY } from 'react-native-dotenv'

export default class FavoritePets extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      favorite: "ios-star-outline",
      favoritePets: []
    };
  }

  componentDidMount() {
    if (this.props.favoritePets) {
      this.getFavoritePets(this.props.favoritePets)
    }
  }

  getFavoritePets = (petIDs) => {

    for (const id in petIDs) {
      const url = `http://api.petfinder.com/pet.get?key=${PETFINDER_API_KEY}&id=${id}&format=json`
      axios.get(url)
      .then((response) => {
        const petInfo = {
          name: response.data["petfinder"]["pet"]["name"]["$t"],
          breed: response.data["petfinder"]["pet"]["breeds"]["breed"],
          photo: response.data["petfinder"]["pet"]["media"]["photos"]["photo"][0]["$t"],
          url: `https://www.petfinder.com/petdetail/${response.data['petfinder']['pet']['id']['$t']}`,
          score: petIDs[id]["score"],
          petID: id,
          key: id
        }

        const { favoritePets } = this.state
        favoritePets.push(petInfo)
        this.setState({favoritePets: favoritePets})
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }


  saveFavorite = () => {
    const uid = this.props.user['uid']
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
      score:  this.props.info[4]
    });
  }

  removeFavPet = (uid, petID) => {
    firebase.database().ref('users/' + uid  + `/pets/` +  petID).remove();
  }

  render() {
    const { favoritePets } = this.state;
    if (favoritePets.length > 0) {
      return           <FlatList
      data={this.state.favoritePets}
      renderItem={({item}) => (
    <View>
      <Text>{item.name}</Text>
      <Text>{item.score}</Text>
    </View>
)}
      />
    } else {
      return         <View>
      <Text
      style={{ fontSize: 20, color: 'purple', padding: 15 }}>
      Hello there are NO fav pets!
      </Text>
      </View>
    }

  }
}

FavoritePets.propTypes = {
  user: PropTypes.object,
  info: PropTypes.array,
  newImg: PropTypes.string
};
