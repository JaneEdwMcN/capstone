import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { Content, List, ListItem, H2, Button, Body } from "native-base";

import PropTypes from 'prop-types';
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
    const { favoritePets, user } = this.state;
    if (user) {
      if (favoritePets.length > 0) {
        return         <Content style={styles.contentPadding}>
        <List>
        <ListItem itemHeader first>
        <H2 style={styles.headerText}>Favorites</H2>
        </ListItem>
        {this.state.favoritePets.map((pet, index) => (
          <FavoritePets
          key={index}
          name={pet.name}
          score={pet.score}
          photo={pet.photo}
          url={pet.url}
          petID={pet.petID}/>
        ))}
        </List>
        </Content>

      } else {
        return         <View>
        <Text
        style={{ fontSize: 20, color: 'purple', padding: 15 }}>
        You have no favorite pets!
        </Text>
        </View>
      }
    } else {
      return         <View>
      <Body>
      <Button
      info
      title="Go to Login Page"
      onPress={() => this.props.navigation.navigate('Home')}
      >
      <Text>Please login to see your favorite pets.</Text>
      </Button>
      </Body>
      </View>
    }
  }
}

FavoritesScreen.propTypes = {
  navigation: PropTypes.object
};

const styles = StyleSheet.create({
  contentPadding: {
    padding: 2,
    marginTop: 15
  },
  headerText: {
    color: "#4C55FF"
  }
});
