import React from 'react';
import { Text, StyleSheet } from 'react-native';

import { Content, List, ListItem, H2, Button, Body, StyleProvider } from "native-base";
import { Font, AppLoading } from 'expo';

import PropTypes from 'prop-types';
import firebase from 'firebase';
import FavoritePets from '../components/FavoritePets';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';

const auth = firebase.auth();

export default class FavoritesScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      favoritePets: [],
      user: null,
      loading: true
    };
  }

  async componentDidMount() {
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

    await Font.loadAsync({
      'Chicle': require('../node_modules/native-base/Fonts/Chicle-Regular.ttf'),
      'Roboto': require('../node_modules/native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('../node_modules/native-base/Fonts/Roboto_medium.ttf')
    });
    this.setState({ loading: false });
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
    const { favoritePets, user, loading } = this.state;
    if (loading) {
      return <AppLoading />
    } else {
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
            petID={pet.petID}
            user={user}/>
          ))}
          </List>
          </Content>

        } else {
          return         <StyleProvider style={getTheme(material)}>
          <Body style={styles.flexCenterCenter}>
          <Text style={styles.noFavorites}>
          You have no favorite pets!
          </Text>
          <Button
          style={styles.goToCameraButton}
          title="Go to Camera Page"
          onPress={() => this.props.navigation.navigate('Camera')}
          >
          <Text style={styles.goToCameraText}>Start matching to find some favorites!</Text>
          </Button>
          </Body>
          </StyleProvider>
        }
      } else {
        return         <Body style={styles.flexCenterCenter}>
        <Button
        style={styles.goToLoginButton}
        info
        title="Go to Login Page"
        onPress={() => this.props.navigation.navigate('Home')}
        >
        <Text style={styles.goToLogin}>Please login to see your favorite pets!</Text>
        </Button>
        </Body>
      }
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
    color: "#4C55FF",
    fontFamily: 'Chicle',
  },
  flexCenterCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center"
  },
  goToLogin: {
    color: "white",
    padding: 5,
    fontWeight: "bold",
    fontSize: 15
  },
  goToLoginButton: {
    backgroundColor: "#4C55FF"
  },
  noFavorites: {
    color: "#4C55FF",
    fontSize: 30,
    paddingBottom: 20
  },
  goToCameraText: {
    color: 'white',
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10
  },
  goToCameraButton: {
    alignSelf: 'center',
    backgroundColor: "#4C55FF"
  }
});
