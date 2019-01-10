import React from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import axios from 'axios';
import PetImageCard from './PetImageCard';

import { PETFINDER_API_KEY } from 'react-native-dotenv'

const  capitalLetter = (str) => {
  str = str.split(" ");
  for (let i = 0, x = str.length; i < x; i++) {
    str[i] = str[i][0].toUpperCase() + str[i].substr(1);
  }
  return str.join(" ");
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
      const scoreNum = parseFloat(this.props.predictions[i]['score']);
      const scoreFloor = Math.floor(scoreNum* 100) / 100
      let score = scoreFloor.toString()
      score.length === 3 ? score += "0" : score

      const breedImgURL = this.props.predictions[i]["input"]["data"]["image"]["url"]
      const urlRemoved = breedImgURL.split('https://d17fnq9dkz9hgj.cloudfront.net/breed-uploads/2018/08/');
      const detailJpgRemoved =  urlRemoved[1].split('-detail.jpg');
      const regex = /-/gi;
      const breedLowcase =  detailJpgRemoved[0].replace(regex, " ")
      const breed = capitalLetter(breedLowcase);
      const key = PETFINDER_API_KEY
      const url = `http://api.petfinder.com/pet.find?key=${key}&count=1&location=98122&breed=${breed}&format=json`
      axios.get(url)
      .then((response) => {
        const petInfo = [
          response.data["petfinder"]["pets"]["pet"]["name"]["$t"],
          response.data["petfinder"]["pets"]["pet"]["breeds"]["breed"],
          response.data["petfinder"]["pets"]["pet"]["media"]["photos"]["photo"][0]["$t"],
          `https://www.petfinder.com/petdetail/${response.data['petfinder']['pets']['pet']['id']['$t']}`,
          score,
          response.data['petfinder']['pets']['pet']['id']['$t']
        ]

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
    const petImages = this.state.pets.map((info, index) => {
      const img = info[2]
      const newImg = img.replace("&width=60&-pnt.jpg", ".jpg")
      return(<PetImageCard
        key={index}
        user={this.props.user}
        index={index}
        info={info}
        newImg={newImg}/>)
      })

      return (<ScrollView horizontal>
        { petImages }
        </ScrollView>)
      }
    }


    DisplayPetFinderResults.propTypes = {
      predictions: PropTypes.array.isRequired,
      user: PropTypes.object
    };
