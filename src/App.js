import React, { Component } from 'react';
import axios from 'axios';
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      zipCode: [],
      catInfo: [],
      catInfoTwo: []
    }

    this.handleChange = this.handleChange.bind(this)
    this.displayCat = this.displayCat.bind(this)
    this.handleFetchCats = this.handleFetchCats.bind(this)
  }

  //handle change is handling the changing of the input field where I enter the zip code.
  handleChange(event) {
    this.setState({
      zipCode: event.target.value

    })


  }
  //handle submit is taking care of submitting the request to my api and bringing back the data to display it.
  handleSubmit() {

    //axios.get is grabbing my api key and web address with the zip code variable added in from the input field this way it will update when I want it to. I left animal as cat as I am only searching for that animal.
    var cats = null;
    axios.get(`http://api.petfinder.com/pet.find?format=json&key=6c6be263b5a04b58281c6870ea097911&location=${this.state.zipCode}&animal=cat`)
      .then(res => {

        cats = res.data.petfinder.pets.pet
        //console.log(cats)
        this.setState({
          catInfo: cats

        })
        // The path in the console log is drilling down and grabbing the info from cats. the [] is stating to grab just the first part of the json array for one cat. .age is drilling down further and the $t is getting just the age word.

        //some zip codes returning undefined with the photo if there is not one and also the breed.
        //console.log(cats[1].name.$t, cats[1].age.$t, cats[1].contact.city.$t, cats[1].description.$t, cats[1].media.photos.photo[3].$t, cats[1].sex.$t);
        console.log(cats);
        //console.log(cats.media.photo.$t);

      })


  }

  //handle submit to take care of rescueGroup.org api. Below is the array of data I am calling along with my api key.
  handleSubmitTwo() {
    let catData = {
      "apikey": "h4oPliRc",
      "objectType": "animals",
      "objectAction": "publicSearch",
      "search":
        {
          "resultStart": "0",
          "resultLimit": "10",
          "resultSort": "animalID",
          "resultOrder": "asc",
          "filters":
            [
              {
                "fieldName": "animalSpecies",
                "operation": "equals",
                "criteria": "cat"
              },
              {
                "fieldName": "animalLocationDistance",
                "operation": "radius",
                "criteria": "25"
              },
              {
                "fieldName": "animalLocation",
                "operation": "equals",
                "criteria": `${this.state.zipCode}`
              }
            ],
          "filterProcessing": "1",
          "fields":
            [
              "animalID", "animalBreed", "animalDescriptionPlain", "animalGeneralAge", "animalLocation", "animalLocationCitystate", "animalName", "animalSearchString", "animalSex", "animalSpecies", "animalStatus", "animalThumbnailUrl", "animalPictures"
            ]

        }

    };
    //catdata is from my above array I am calling to the below api link. CataData is being passed with the link to display.
    var catsTwo = null;
    axios.post(`https://api.rescuegroups.org/http/v2.json`, catData)
      .then(res => {

        catsTwo = res.data

        this.setState({
          catInfoTwo: catsTwo
        })
        console.log(catsTwo);
      })


  }

  //function to combine the top two handles

  handleFetchCats(e) {
    e.preventDefault()
    this.handleSubmit()
    this.handleSubmitTwo()
  }

  //this function is setup with my specifics about what data I want to pull from the array. I am then using a for loop to loop through the data and return more than one on the page per search. DisplayCat is also pushed into a div on where the dada needs to show up.


  //var outPut has the cat info I want and it searches with a for loop and then puts the data into var moreThanOneCat to then display all results vs just the last when the function is called.
  displayCat() {
    var moreThanOneCat = []
    var outPut = ''
    if (this.state.catInfo.length) {
      for (let i = 0; i < this.state.catInfo.length; i++) {

        outPut =
          (<div key={this.state.catInfo[i].id.$t}><p></p>

            <h4>{this.state.catInfo[i].name.$t}</h4>
            <h4>{this.state.catInfo[i].age.$t}</h4>
            <h4>{this.state.catInfo[i].sex.$t}</h4>
            <h4>{this.state.catInfo[i].description.$t}</h4>
            <h4>{this.state.catInfo[i].contact.city.$t}</h4>
            {this.state.catInfo[i].media.photos && <a href={this.state.catInfo[i].media.photos.photo[3].$t}><strong>Cat Pic</strong></a>}
          </div>
          )
        //this appends the array and adds a new element which returns the max per page.
        moreThanOneCat.push(outPut)


      }
      //console.log(this.state.catInfo[0].name.$t)

    }
    return moreThanOneCat
  }

  //rescue group api display code with for loop
  displayCatTwo() {
    var moreThanOneCatTwo = []
    var outPutTwo
    if (this.state.catInfoTwo.data) {
      for (let key in this.state.catInfoTwo.data) {
        if (!this.state.catInfoTwo.data[key]) { return }
        outPutTwo =
          (<div key={this.state.catInfoTwo.data[key]}><p></p>

            <h4>{this.state.catInfoTwo.data[key].animalName}</h4>
            <h4>{this.state.catInfoTwo.data[key].animalBreed}</h4>
            <h4>{this.state.catInfoTwo.data[key].animalGeneralAge}</h4>
            <h4>{this.state.catInfoTwo.data[key].animalDescriptionPlain}</h4>
            <h4>{this.state.catInfoTwo.data[key].animalSex}</h4>
            <h4>{this.state.catInfoTwo.data[key].animalLocation}</h4>
            <h4>{this.state.catInfoTwo.data[key].animalLocationCitystate}</h4>

            {/* {this.state.catInfoTwo.data[key].animalPictures[0].large && <a href={this.state.catInfoTwo[key].animalPictures[0].large.url
            }><strong>Cat Pic</strong></a>} */}
          </div>
          )
        //this appends the array and adds a new element which returns the max per page.
        moreThanOneCatTwo.push(outPutTwo)


      }


    }
    return moreThanOneCatTwo
  }

  //the below value is stating that the input field is receiving the current state and zip code input which defaults to nothing until something is entered and creates a change event.
  render() {
    return (
      <div className="container">
        <div className="mx-auto">
          <h1 className="row justify-content-md-center"><strong>Cat Finder</strong></h1>
          <p className="row justify-content-md-center">Find Cats for adoption</p>
          <form className="row justify-content-md-center" onSubmit={this.handleFetchCats}>
            <input id="zipCode" className="row justify-content-md-center" type="text" name="Zip code" placeholder="Zip Code" value={this.state.zipCode} onChange={this.handleChange} />

            <button type='submit' className="btn btn-primary"> Get Cats</button>
          </form>
<p></p>
<div className='row'>
<div id="outPut" className='card col-md-6'>PetFinder.com</div>

<div id="outPutTwo" className='card col-md-6'>RescueGroups.org </div>
</div>
          <div className='row'>
          
            <div id="outPut" className='card col-md-6'>{this.displayCat()}</div>
            
            
            <div id="outPutTwo" className='card col-md-6'>{this.displayCatTwo()}</div>
            
          </div>
        </div>
      </div>
    );
  }


}
export default App;