import React from 'react';
import { FlatList, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Icon } from 'expo';
import firebase from 'firebase';
import FavoritePets from '../components/FavoritePets';

const auth = firebase.auth();

export default class FavoritesScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      favoritePets: [],
      user: null
    };
  }
  componentDidMount() {

    auth.onAuthStateChanged(user => {
      if (user != null) {
        firebase.database().ref('/users/' + user['uid'] + `/pets`).on("value", (snapshot) => {
          this.setState({ user: user });
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

  render() {
    const { favoritePets } = this.state;
    if (favoritePets.length > 0) {
      return           <FlatList
      data={this.state.favoritePets}
      renderItem={({item}) => (
        <FavoritePets
        name={item.name}
        score={item.score}
        url={item.url}
        petID={item.petID}/>
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
