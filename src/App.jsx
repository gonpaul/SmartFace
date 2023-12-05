import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation.jsx';
import Logo from './components/Logo/Logo.jsx';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.jsx';
import Rank from './components/Rank/Rank.jsx';
import ParticlesComponent from './components/ParticlesComponent/ParticlesComponent.jsx';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.jsx';
import Signin from './components/ Signin/Signin.jsx';
import Register from './components/Register/Register.jsx';
import './App.css';


const returnClarifaiRequestOptions = (imageUrl) => {
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = '6da238062f79428fbe27620e62f739c5';
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = 'gonpaul';       
  const APP_ID = 'facerecognition';
  // Change these to whatever model and image URL you want to use
  const MODEL_ID = 'face-detection';
  const IMAGE_URL = imageUrl;

  ///////////////////////////////////////////////////////////////////////////////////
  // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
  ///////////////////////////////////////////////////////////////////////////////////

  const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
  });

  const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
  };

  return requestOptions;
}

///////////
class App extends Component {
  constructor() {
    super()
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
    }
  }

  handleInputChange = (event) => {
  this.setState({ input: event.target.value }); // I have problems remembering it
  };

  getCoordinates = (response) => {
    const boundingBox = response.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage'); //jquery helps me get the width and height of the image
    const width = image.width;
    const height = image.height;

    return {
      leftCol: boundingBox.left_col * width,
      topRow: boundingBox.top_row * height,
      rightCol: width - (boundingBox.right_col * width),
      bottomRow: height - (boundingBox.bottom_row * height)
    }
  }
  setBoxArea = (box) => {
    this.setState({ box: box });
  }


  handleSubmit = () => {
    console.log('click');
    this.setState({ imageUrl: this.state.input })
    // code to send the input through api key to a service
    fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifaiRequestOptions(this.state.input))
    .then(response => response.json()) // important line, without it I would be able to access box coordinatinates
    .then(response => this.setBoxArea(this.getCoordinates(response)))
    .catch(err => console.log(err));
  }

    // app.models.predict(
    //   'face-detection', // or just use 'face-detection' 
    //   this.state.input)
    //   .then(
    //   function(response) {
    //     console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
    //   },
    //   function(error) {
    //     // there was an error
    //   }
    // )

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <ParticlesComponent />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
          ? <div>
              <Logo />
              <Rank
                // name={this.state.user.name}
                // entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.handleInputChange}
                onButtonSubmit={this.handleSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl}/>
            </div>
          : (
             route === 'signin'
             ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
             : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
    // return (
    //   <div className='App'>
    //     <Navigation />
    //     <Logo />
    //     <Rank />
    //     <ImageLinkForm onInputChange={this.handleInputChange} onButtonSubmit={this.handleSubmit}/>
    //     <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
    //     <ParticlesComponent />
    //   </div>
    // )
  }
}

export default App
