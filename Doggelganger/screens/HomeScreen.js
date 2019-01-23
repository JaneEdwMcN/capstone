import React from 'react';
import {  StyleSheet, Text, View, Linking} from 'react-native';
import { Thumbnail, Card, CardItem, Left, Body, Right, Button } from "native-base";
import { Facebook, Font, AppLoading } from 'expo';
import firebase from 'firebase';
import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_DATABASE_URL } from 'react-native-dotenv'
import {  FIREBASE_PROJECT_ID, FIREBASE_MESSAGING_SENDER_ID, FACEBOOK_APP_ID } from 'react-native-dotenv'

const config = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIREBASE_PROJECT_ID,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID
};

firebase.initializeApp(config);

const auth = firebase.auth();

export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      logInStatus: 'signed out',
      errorMessage: null,
      user: null,
      loading: true
    };
  }

  static navigationOptions = {
    header: null
  };

  async  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user != null) {
        this.writeUserData(user[`uid`], user[`displayName`], user[`email`], user[`photoURL`])
        this.setState({ logInStatus: 'We are authenticated now!', user: user });
      } else {
        this.setState({ logInStatus: 'You are currently logged out.' });
      }
    });

    await Font.loadAsync({
      'Chicle': require('../node_modules/native-base/Fonts/Chicle-Regular.ttf'),
    });
    this.setState({ loading: false });
  }

  async handleFacebookButton() {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID, {
      permissions: ['public_profile', 'email']
    });
    if (type === 'success') {
      const credential = firebase.auth.FacebookAuthProvider.credential(token);

      auth.signInAndRetrieveDataWithCredential(credential).catch(error => {
        this.setState({ errorMessage: error.message });
      });
    }
  }

  async logout() {
    this.setState({ user: null });
    return firebase.auth().signOut();
  }


  writeUserData(userId, name, email, imageUrl) {
    firebase.database().ref('users/' + userId).update({
      uid: userId,
      username: name,
      email: email,
      profilePicture : imageUrl
    });
  }

  render() {
    const { user, loading, errorMessage } = this.state;
    if (loading) {
      return   <AppLoading />
    } else {
      if (user) {
        return (
          <View style={styles.container}>
          <Card style={styles.appTitleCard}>
          <Text style={styles.appNameTitle}>Doggelganger<Text style={styles.tm}>®</Text></Text>
          </Card>

          <Card>
          <CardItem bordered>
          <Left>
          <Thumbnail square source={{uri: user["photoURL"]}} />
          <Body>
          <Text style={styles.welcomeText}>Hello, {user["displayName"]}!</Text>
          </Body>
          </Left>
          </CardItem>

          <CardItem>
          <Body>
          <Text style={styles.appDescription}>
          Welcome to <Text style={styles.doggelganger}>Doggelganger</Text>
          ! Submit your photo to get matched with an available pet from{' '}
          <Text
          style={styles.petfinderLink}
          onPress={()=>Linking.openURL('https://www.petfinder.com/')}>Petfinder.com</Text>
          ! Our algorithm uses an API to detect which dog, cat, or barnyard critter
          image is the most similar to your submitted image and returns your highest
          scoring matches from Petfinder.
          </Text>
          <Text style={styles.appDescriptionLastParagraph}>
          Now that you{"'"}re logged in, you can save your favorite pet
          matches for later!
          </Text>
          <Text style={styles.flaticonCredit}>
          Launch Icon made by{' '}
          <Text
          style={styles.flaticonCreditLink}
          onPress={()=>Linking.openURL("https://www.freepik.com/")}>
          Freepik
          </Text>
          {' '}from{' '}
          <Text
          style={styles.flaticonCreditLink}
          onPress={()=>Linking.openURL("www.flaticon.com")}>
          www.flaticon.com{' '}
          </Text>
          is licensed by{' '}
          <Text
          style={styles.flaticonCreditLink}
          onPress={()=>Linking.openURL("http://creativecommons.org/licenses/by/3.0/")}
          >
          CC 3.0 BY
          </Text>
          </Text>
          </Body>
          </CardItem>
          <CardItem style={{ paddingVertical: 0 }}>
          <Right>
          <Button  style={styles.logoutButton} onPress={() => this.logout()}>
          <Text style={styles.logoutText}>Log Out from Facebook</Text>
          </Button>
          </Right>
          </CardItem>
          </Card>

          </View>
        );
      } else {
        return (
          <View style={styles.container}>
          <Card style={styles.appTitleCard}>
          <Text style={styles.appNameTitle}>Doggelganger<Text style={styles.tm}>®</Text></Text>
          </Card>

          <Card>
          <CardItem bordered>
          <Body>
          <Button  style={styles.logoutButton}
          onPress={() => this.handleFacebookButton()}
          >
          <Text style={styles.logoutText}>Log in with Facebook</Text>
          </Button>
          {  errorMessage && <Text> Log In Error Messages: </Text> }
          </Body>
          </CardItem>

          <CardItem>
          <Body>
          <Text style={styles.appDescription}>
          Welcome to <Text style={styles.doggelganger}>Doggelganger</Text>
          ! Submit your photo to get matched with an available pet from{' '}
          <Text
          style={styles.petfinderLink}
          onPress={()=>Linking.openURL('https://www.petfinder.com/')}>Petfinder.com</Text>
          ! Our algorithm uses an API to detect which dog, cat, or barnyard critter
          image is the most similar to your submitted image and returns your highest
          scoring matches from Petfinder.
          </Text>
          <Text style={styles.appDescriptionLastParagraph}>
          Once you{"'"}re logged in, you can save your favorite pet matches for later!
          </Text>

          <Text style={styles.flaticonCredit}>
          Launch Icon made by{' '}
          <Text
          style={styles.flaticonCreditLink}
          onPress={()=>Linking.openURL("https://www.freepik.com/")}>
          Freepik
          </Text>
          {' '}from{' '}
          <Text
          style={styles.flaticonCreditLink}
          onPress={()=>Linking.openURL("www.flaticon.com")}>
          www.flaticon.com{' '}
          </Text>
          is licensed by{' '}
          <Text
          style={styles.flaticonCreditLink}
          onPress={()=>Linking.openURL("http://creativecommons.org/licenses/by/3.0/")}
          >
          CC 3.0 BY
          </Text>
          </Text>
          </Body>
          </CardItem>
          </Card>

          </View>

        );
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: "#4C55FF"
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center'
  },
  welcomeText: {
    fontWeight: 'bold',
    color: "#4C55FF",
    fontSize: 18
  },
  logoutText: {
    color: "white",
    padding: 5,
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 15
  },
  logoutButton: {
    backgroundColor: "#4C55FF"
  },
  appNameTitle: {
    textAlign: "center",
    color: "#4C55FF",
    fontFamily: 'Chicle',
    fontSize: 50,
    padding: 10
  },
  doggelganger: {
    fontFamily: 'Chicle',
    fontSize: 16
  },
  appTitleCard: {
    marginBottom: 25
  },
  appDescription: {
    color: "#B29623"
  },
  petfinderLink: {
    textDecorationLine: 'underline',
    color: "#111AB2"
  },
  tm: {
    fontSize: 20
  },
  appDescriptionLastParagraph: {
    paddingTop: 10,
    color: "#4C55FF",
    fontSize: 16
  },
  flaticonCredit: {
    paddingTop: 10,
    fontSize: 8,
    color: "#4C55FF"
  },
  flaticonCreditLink: {
    color: "#B29623",
    textDecorationLine: 'underline'
  }
});
