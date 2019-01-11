import React from 'react';
import { FlatList, Text, View, StyleSheet, ListItem, List, TouchableOpacity } from 'react-native';

import PropTypes from 'prop-types';
import { Icon } from 'expo';
import firebase from 'firebase';

const auth = firebase.auth();

export default class FavoritePets extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      favorite: "ios-star-outline",
      favoritePets: []
    };
  }
  componentDidMount() {

    auth.onAuthStateChanged(user => {
      if (user != null) {
        firebase.database().ref('/users/' + user['uid'] + `/pets`).on("value", (snapshot) => {
          this.getFavoritePets(snapshot.val())
        });

      } else {
        this.setState({ user: null });
      }
    });

  }

  getFavoritePets = (favPets) => {
    const favoritePetsData = []
    for (const data in favPets) {
      const petInfo = {
        name: favPets[data]["name"],
        breed: favPets[data]["breed"],
        photo: favPets[data]["photo"],
        url: favPets[data]["url"],
        score: favPets[data]["score"],
        petID: favPets[data]["petID"],
        key: favPets[data]["petID"]
      }
      
      favoritePetsData.push(petInfo)
    }
    this.setState({favoritePets: favoritePetsData})

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
      score:  this.props.info[4],
      name: this.props.info[0],
      breed: this.props.info[1],
      photo: this.props.newImg,
      url: this.props.info[3],
      petID: this.props.info[5]
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
        <Text>{item.url}</Text>
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
