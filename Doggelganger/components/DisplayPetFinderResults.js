import React from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import axios from 'axios';
import PetMatches from './PetMatches';

import { PETFINDER_API_KEY } from 'react-native-dotenv'

const  capitalLetter = (str) => {
  str = str.split(" ");
  for (let i = 0, x = str.length; i < x; i++) {
    str[i] = str[i][0].toUpperCase() + str[i].substr(1);
  }
  return str.join(" ");
}

const  getScore = (scoreFloat) => {
  let score = ""
  if (scoreFloat[0] === "1") {
    score = "100"
  } else {
    const scoreNum = parseFloat(scoreFloat);
    const scoreFloor = Math.floor(scoreNum* 100) / 100
    let scoreStr = scoreFloor.toString()
    scoreStr.length === 3 ? scoreStr += "0" : scoreStr
    score = scoreStr.replace("0.", "")
  }
  return score

}

export default class DisplayPetFinderResults extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pets: [],
      favorite: "ios-star-outline"
    };
  }

  componentDidMount() {
    let i = 0;
    while (i < 10) {
      const score = getScore(this.props.predictions[i]['score']);

      const breedImgURL = this.props.predictions[i]["input"]["data"]["image"]["url"]
      const urlRemoved = breedImgURL.split('https://d17fnq9dkz9hgj.cloudfront.net/breed-uploads/2018/08/');
      const detailJpgRemoved =  urlRemoved[1].split('-detail.jpg');
      const regex = /-/gi;
      const breedLowcase =  detailJpgRemoved[0].replace(regex, " ")
      const breedUpperCase = capitalLetter(breedLowcase);

      const firstHalfURL = `http://api.petfinder.com/pet.find?key=${PETFINDER_API_KEY}`
      const secondHalfURL = `&count=1&location=98122&breed=${breedUpperCase}&animal=${this.props.animal}&format=json`

      axios.get(firstHalfURL + secondHalfURL)
      .then((response) => {
        const breedFromData = response.data["petfinder"]["pets"]["pet"]["breeds"]["breed"]
        let breed = ""

        if (breedFromData["$t"]) {
          breed = breedFromData["$t"]
        } else {
          breedFromData.forEach(function(thisBreed, index){
            const last = breedFromData.length - 1
            if (index === last) {
              breed += thisBreed["$t"]
            } else {
              breed += thisBreed["$t"] + "/"
            }
          });
        }

        const petInfo = {
          name: response.data["petfinder"]["pets"]["pet"]["name"]["$t"],
          breed: breed,
          photo: response.data["petfinder"]["pets"]["pet"]["media"]["photos"]["photo"][0]["$t"],
          url: `https://www.petfinder.com/petdetail/${response.data['petfinder']['pets']['pet']['id']['$t']}`,
          score: score,
          petID: response.data['petfinder']['pets']['pet']['id']['$t']
        }

        const { pets } = this.state
        pets.push(petInfo)
        this.setState({pets: pets})
      })
      .catch((error) => {
        console.log(error);
      });
      i++;
    }
  }

  render() {
    const petResults = this.state.pets.map((pet, index) => {
      const photoWithWidth = pet["photo"]
      const photo = photoWithWidth.replace("&width=60&-pnt.jpg", ".jpg")
      return(<PetMatches
        key={index}
        user={this.props.user}
        pet={pet}
        photo={photo}
        navigation={this.props.navigation}/>)
      })

      return (<ScrollView horizontal>
        { petResults }
        </ScrollView>)
      }
    }


    DisplayPetFinderResults.propTypes = {
      predictions: PropTypes.array.isRequired,
      user: PropTypes.object,
      navigation: PropTypes.object,
      animal: PropTypes.string.isRequired
    };
