import React from 'react';
import { Text, StyleSheet, Linking } from 'react-native';
import { ListItem, Left, Thumbnail, Body, Right, Button, StyleProvider } from "native-base";
import PropTypes from 'prop-types';
import { Icon, AppLoading, Font } from 'expo';
import firebase from 'firebase';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';


export default class FavoritePets extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  async  componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('../node_modules/native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('../node_modules/native-base/Fonts/Roboto_medium.ttf'),
    });
    this.setState({ loading: false });
  }

  removeFavorite = () => {
    const uid = this.props.user["uid"]
    firebase.database().ref('users/' + uid  + `/pets/` +  this.props.petID).remove();
  }

  render() {
    const { loading } = this.state;

    if (loading) {
      return   <AppLoading />
    } else {
      return   <StyleProvider style={getTheme(material)}>
      <ListItem thumbnail>
      <Left>
      <Thumbnail
      square
      large
      source={{uri: this.props.photo}}
      onPress={()=>Linking.openURL(this.props.url)} />
      </Left>
      <Body >
      <Text style={styles.name}>{this.props.name}</Text>
      <Text note style={styles.scoreText}>{this.props.score}% match!</Text>
      <Button bordered info small onPress={()=>Linking.openURL(this.props.url)}
      style={styles.petfinderVisitButton}>
      <Text style={styles.petfinderVisitButtonText}>Visit Petfinder Profile</Text>
      </Button>
      </Body>
      <Right style={styles.removeIcon}>
      <Icon.Ionicons
      name={"ios-remove-circle"}
      onPress={this.removeFavorite}
      size={35}
      color={"#FFDB4C"}
      />
      <Text style={styles.removeText}>Remove</Text>
      </Right>
      </ListItem>
      </StyleProvider>
    }
  }
}

FavoritePets.propTypes = {
  name: PropTypes.string,
  score: PropTypes.string,
  url: PropTypes.string,
  petID: PropTypes.string,
  photo: PropTypes.string,
  user: PropTypes.object
};

const styles = StyleSheet.create({
  removeIcon: {
    alignItems: "center"
  },
  petfinderVisitButtonText: {
    color: "#4C55FF",
    fontSize: 12,
    paddingLeft: 4,
    paddingRight: 4
  },
  petfinderVisitButton: {
    marginTop: 5
  },
  removeText: {
    color: "#4C55FF"
  },
  scoreText: {
    paddingBottom: 5,
    paddingTop: 2
  },
  name: {
    paddingBottom: 5,
    fontWeight: 'bold',
    fontSize: 15
  }
});
