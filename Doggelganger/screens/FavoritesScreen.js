import React from 'react';
import { StyleSheet, Text, View, List, FlatList, ListItem} from 'react-native';
import axios from 'axios';
import FavoritePets from '../components/FavoritePets';

import { PETFINDER_API_KEY } from 'react-native-dotenv'

import firebase from 'firebase';

const auth = firebase.auth();

export default class FavoritesScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      user: null,
      favoritePets: null
    };
  }

  static navigationOptions = {
    header: null
  };



  componentDidMount() {

    auth.onAuthStateChanged(user => {
      if (user != null) {
        firebase.database().ref('/users/' + user['uid'] + `/pets`).on("value", (snapshot) => {
          this.setState({  user: user, favoritePets: snapshot.val() });
        });

      } else {
        this.setState({ user: null });
      }
    });
  }

  getFavoritePets = (petIDs) => {
    for (const id in petIDs) {
      const url = `http://api.petfinder.com/pet.get?key=${PETFINDER_API_KEY}&id=${id}`
      axios.get(url)
      .then((response) => {
        const petInfo = {
          name: response.data["petfinder"]["pet"]["name"]["$t"],
          breed: response.data["petfinder"]["pet"]["breeds"]["breed"],
          photo: response.data["petfinder"]["pet"]["media"]["photos"]["photo"][0]["$t"],
          url: `https://www.petfinder.com/petdetail/${response.data['petfinder']['pet']['id']['$t']}`,
          score: petIDs["id"]["score"],
          petID: response.data['petfinder']['pets']['pet']['id']['$t']
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


  render() {
    const { user, favoritePets } = this.state;

    if (favoritePets && user) {
      return (
        <FavoritePets favoritePets={favoritePets} user={user} />
      );
    } else {
      return (
        <View>
        <Text style={styles.developmentModeText}>Theres NO user</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  developmentModeText: {
    marginBottom: 20,
    color: 'purple',
    fontSize: 30,
    lineHeight: 19,
    textAlign: 'center',
  }
});
