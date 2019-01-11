import React from 'react';
import { StyleSheet, Text, View, List, FlatList, ListItem} from 'react-native';
import FavoritePets from '../components/FavoritePets';


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
        this.setState({  user: user });
      } else {
        this.setState({ user: null });
      }
    });
  }


  render() {
    const { user } = this.state;

    if (user) {
      return (
        <FavoritePets/>
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
