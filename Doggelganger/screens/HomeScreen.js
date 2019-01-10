import React from 'react';
import {  StyleSheet, Text, View, TouchableHighlight, Button} from 'react-native';
import { Facebook } from 'expo';
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
      errorMessage: 'none',
      user: null
    };
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user != null) {
        this.writeUserData(user[`uid`], user[`displayName`], user[`email`], user[`photoURL`])
        this.setState({ logInStatus: 'We are authenticated now!', user: user });
      } else {
        this.setState({ logInStatus: 'You are currently logged out.' });
      }
    });
  }

  async handleFacebookButton() {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID, {
      permissions: ['public_profile', 'email']
    });
    if (type === 'success') {
      //Firebase credential is created with the Facebook access token.
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
    const { user } = this.state;
    
    if (user) {
      return (
        <View style={styles.container}>
        <View style={styles.getStartedContainer}>
        {this._maybeRenderDevelopmentModeWarning()}
        <Text style={styles.getStartedText}>Welcome to Doggelganger2.0!!!</Text>
        <Text>Logged In Status: {this.state.logInStatus}</Text>
        <Button onPress={() => this.logout()} title='Logout' />
        </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
        <View style={styles.getStartedContainer}>
        {this._maybeRenderDevelopmentModeWarning()}
        <Text style={styles.getStartedText}>Welcome to Doggelganger2.0!!!</Text>

        <TouchableHighlight
        style={styles.facebookButton}
        name="Facebook"
        underlayColor={styles.facebookButton.backgroundColor}
        onPress={() => this.handleFacebookButton()}
        >
        <Text style={styles.facebookButtonText}>Log in with Facebook</Text>
        </TouchableHighlight>
        <View style={styles.space} />
        <Text>Logged In Status: {this.state.logInStatus}</Text>
        <View style={styles.space} />
        <Text> Log In Error Messages: {this.state.errorMessage}</Text>
        </View>
        </View>
      );
    }

  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      return (
        <Text style={styles.developmentModeText}>
        Development mode is enabled, your app will be slower but you can use useful development
        tools.
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
        You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  getStartedText: {
    fontSize: 25,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  facebookButton: {
    width: 375 * 0.75,
    height: 48,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3B5998'
  },
  facebookButtonText: {
    color: '#fff'
  },
  space: {
    height: 17
  }
});
