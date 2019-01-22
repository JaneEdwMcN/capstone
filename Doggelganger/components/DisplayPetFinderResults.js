import React from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import axios from 'axios';
import PetMatches from './PetMatches';

import { PETFINDER_API_KEY } from 'react-native-dotenv'

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
      const id =  this.props.predictions[i]["input"]["id"]
      const URL = `http://api.petfinder.com/pet.get?key=${PETFINDER_API_KEY}&id=${id}&format=json`

      axios.get(URL)
      .then((response) => {
        if (response.data["petfinder"]["header"]["status"]["code"]["$t"] === "100") {
          console.log(response.data["petfinder"]["pet"]);
          const breedFromData = response.data["petfinder"]["pet"]["breeds"]["breed"]
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
            name: response.data["petfinder"]["pet"]["name"]["$t"],
            breed: breed,
            photo: response.data["petfinder"]["pet"]["media"]["photos"]["photo"][0]["$t"],
            url: `https://www.petfinder.com/petdetail/${response.data['petfinder']['pet']['id']['$t']}`,
            score: score,
            petID: response.data['petfinder']['pet']['id']['$t']
          }

          const { pets } = this.state
          pets.push(petInfo)
          this.setState({pets: pets})}
        })
        .catch((error) => {
          console.log(error);
        });
        i++;
      }
    }

    render() {
      const petResults = this.state.pets.map((pet, index) => {
        return(<PetMatches
          key={index}
          user={this.props.user}
          pet={pet}
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
