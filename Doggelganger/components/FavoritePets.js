import React from 'react';
import { FlatList, Text, View, TouchableOpacity } from 'react-native';

import PropTypes from 'prop-types';
import { Icon } from 'expo';
import firebase from 'firebase';

const auth = firebase.auth();

export default class FavoritePets extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user != null) {
        this.setState({ user: user });
      } else {
        this.setState({ user: null });
      }
    });

  }

  removeFavorite = () => {
    const uid = this.state.user["uid"]
    firebase.database().ref('users/' + uid  + `/pets/` +  this.props.petID).remove();
  }

  render() {
      return (
        <View>
        <Text>{this.props.name}</Text>
        <Text>{this.props.score}</Text>
        <Text>{this.props.url}</Text>
        <TouchableOpacity
        onPress={this.removeFavorite}
        >
        <Icon.Ionicons
        name={"ios-star"}
        size={26}
        style={{ marginBottom: -3 }}
        color={"purple"}
        />
        </TouchableOpacity>
        </View>
      )
  }
}

FavoritePets.propTypes = {
  name: PropTypes.string,
  score: PropTypes.string,
  url: PropTypes.string,
  petID: PropTypes.string
};
