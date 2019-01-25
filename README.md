# Doggelganger - An image matching app

Doggelganger finds pets that look like you on [Petfinder.com](https://www.petfinder.com). Doggelganger takes an image of you and uses [Clarifai](https://clarifai.com/) to score which pets from Petfinder are visually similar to you. You can optionally log in with Facebook to save your favorite matches for later.

## Built With

* [Expo](https://docs.expo.io/) - Expo is a set of tools, libraries and services which let you build native iOS and Android apps by writing JavaScript.
* [React Native](https://facebook.github.io/react-native/) - React Native lets you build mobile apps using only JavaScript. It uses the same design as React, letting you compose a rich mobile UI using declarative components.
* [Native Base](https://nativebase.io/) - Essential cross-platform UI components for React Native & Vue Native.
100% open source.
* [Firebase](https://firebase.google.com/) - Firebase is Google's mobile platform that helps you quickly develop high-quality apps and grow your business.
* [Clarifai](https://clarifai.com/) - Clarifai is an artificial intelligence company that excels in visual recognition, solving real-world problems for businesses.
* [Petfinder API](https://www.petfinder.com/developers/api-docs) - The Petfinder API gives developers access to Petfinder's database of over 300,000 adoptable pets and 11,000 animal welfare organizations (AWO).
* [Facebook Developers](https://developers.facebook.com/) - Connect interfaces and develop across platforms.

## Setup and Installation

These instructions will get you a copy of the project up and running on your local machine. Begin by installing the following tools and creating API keys for your app. If a step has a "$" in front of it, you should run this command in your terminal.

Step 1: Clone the app

<big><pre>
	$ git clone https://github.com/JaneEdwMcN/capstone.git
</big></pre>
Step 2: Install react-native-dotenv

<big><pre>
	$ npm install react-native-dotenv --save-dev
	$ npm install babel-preset-react-native --save-dev
</big></pre>
Step 3: Create the .env file in the root directory

<big><pre>
	 $ touch .env
</big></pre>
Step 4: Go to the Petfinder API website and register to create a key

<big><pre>
[https://www.petfinder.com/developers/api-key](https://www.petfinder.com/developers/api-key)
</big></pre>
Step 5: Create an account at Clarifai (verify your email or you will be limited to 100 API requests)

<big><pre>
	[https://clarifai.com/developer/account/signup](https://clarifai.com/developer/account/signup)
</big></pre>
Step 6: Create three applications on Clarifai

<big><pre>
	[https://clarifai.com/developer/account/applications/create](https://clarifai.com/developer/account/applications/create)
</big></pre>
Step 7: Add images to your Clarifai applications  
*Note: 	This app was built to accomodate Petfinder pet images only. You will need to change some code to make it work with other inputs.*
<big><pre>
	You can upload images manually on the applications' "explorer" page
	or
	You can upload images automatically. See documentation: [https://clarifai.com/developer/guide/inputs#inputs](https://clarifai.com/developer/guide/inputs#inputs)
</big></pre>
Step 8: Add Clarifai to your app

<big><pre>
	$ npm install clarifai --save
</big></pre>
Step 9: Register on Firebase and go to your console

<big><pre>
	- [https://console.firebase.google.com](https://console.firebase.google.com)
	- Click create a project
	- On the overview page under "Get started by adding Firebase to your app" click the **</>** symbol
	- This will give you your apiKey, authDomain, databaseURL, projectId, storageBucket, and messagingSenderId
</big></pre>
Step 10: Create a Facebook App and add to Firebase

<big><pre>
	- Sign in to Facebook Developers and create an app ([https://developers.facebook.com](https://developers.facebook.com))
	- Once you create the app, the APP ID should be at the top of the page and your secret can be revealed under settings
	- Go to the Firebase console page for your project
	- Under Develop, click on Authentication
	- Click on "Set up sign-in method"
	- Click on Facebook
	- Add your Facebook App Id and Secret
</big></pre>
Step 11: After you've created your Clarifai apps, Firebase project, and create a app with Facebook, add your keys to your .env  
*Note: There should be no brackets in your actual keys. I've added these for visual clarity to reference where you can find the keys you need.*
<big><pre>
	CLARIFAI_PETFINDER_DOG_API_KEY={ find at: [https://clarifai.com/developer/account/keys](https://clarifai.com/developer/account/keys) }
	CLARIFAI_PETFINDER_CAT_API_KEY={ find at: [https://clarifai.com/developer/account/keys](https://clarifai.com/developer/account/keys) }
	CLARIFAI_PETFINDER_BARNYARD_API_KEY={ find at: [https://clarifai.com/developer/account/keys](https://clarifai.com/developer/account/keys) }
	PETFINDER_API_KEY={ find at: [https://www.petfinder.com/developers/api-key](https://www.petfinder.com/developers/api-key) }
	FIREBASE_API_KEY={ see Step 8 }
	FIREBASE_AUTH_DOMAIN={ see Step 8 }
	FIREBASE_DATABASE_URL={ see Step 8 }
	FIREBASE_PROJECT_ID={ see Step 8 }
	FIREBASE_MESSAGING_SENDER_ID={ see Step 8 }
	FACEBOOK_APP_ID= {see Step 9 }
</big></pre>
Step 12: Install Native Base

<big><pre>
	$ npm install native-base --save
	$ npm install @expo/vector-icons --save
</big></pre>
Step 13: Add Chicle Google Font

<big><pre>
	- Go to: [https://fonts.google.com/specimen/Chicle](https://fonts.google.com/specimen/Chicle)
	- Click "Select This Font"
	- At the bottom of the page, in right corner, click the download button (arrow pointing down symbol)
	- Once you have downloaded the font, open the zip folder
	- Move the "Chicle-Regular.ttf" file into your project to the path: node_modules/native-base/Fonts/
</big></pre>
Step 14: Run npm install to be sure everything is installed (probably not necessary, but something I like to do)

<big><pre>
	$ npm install
</big></pre>


## Deployment

You can easily deploy your app by publishing it to Expo! The Firebase and Clarifai backend are already online, 
so no need to deploy them.
[https://docs.expo.io/versions/latest/workflow/publishing/](https://docs.expo.io/versions/latest/workflow/publishing/)

## Credits
* Thank you to **everyone** at [Ada Developers Academy](https://www.adadevelopersacademy.org/)! Especially Chris for being such an amazing instructor and Devin for being a wonderful PM for me on this project (and an amazing instructor too)!!
* Daniel Simandl's Medium article on [Easy Object Detection With React Native](https://medium.com/@danielsimandl/easy-object-detection-with-react-native-7c2e3f1b56a6) was an incredible starting point for me.
* Gil Roman's [repo](https://github.com/gilroman/react-native-expo-facebook-and-firebase-login) was very useful to help me set up my Firebase/Facebook login.
* Stefan Knoch's article Medium article on [Facebook Login with Expo and Firebase](https://medium.com/datadriveninvestor/facebook-login-with-react-native-expo-firebase-and-typescript-56df4ed6099a) was also super helpful when setting up my Firebase/Facebook login.
* Akash Nimare's Medium article on [writing a readme](https://medium.com/@meakaakka/a-beginners-guide-to-writing-a-kickass-readme-7ac01da88ab3) was very handy to help me write this readme!
