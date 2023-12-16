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

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
  }
};

class App extends Component {
  constructor() {
    super()
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',
      }
    }
  }

  onLoadUser = (data) => {
    this.setState(Object.assign(this.state.user, {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    }))
    console.log(this.state.user);
  }

  handleInputChange = (event) => {
  this.setState({ input: event.target.value }); // I have problems remembering it
  };

  getCoordinates = (response) => {
    const boundingBox = response;
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
    this.setState({ 
      imageUrl: this.state.input,
     })
    // code to send the input to a service using an api key 
    fetch('http://localhost:3000/imageurl', {
        method: 'post',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({
          url: this.state.input
        })
      })
      .then(response => response.json()) // important line, without it I wouldn't be able to access box coordinatinates
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
        }
        this.setBoxArea(this.getCoordinates(response))
      })
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
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
  
    let displayContent;
    if (route === 'home') {
      displayContent = (
        <div>
          <Logo />
          <Rank
            name={this.state.user.name}
            entries={this.state.user.entries}
          />
          <ImageLinkForm
            onInputChange={this.handleInputChange}
            onButtonSubmit={this.handleSubmit}
          />
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
      );
    } else if (route === 'signin' || route === 'signout') {
      displayContent = <Signin loadUser={this.onLoadUser} onRouteChange={this.onRouteChange} />;
    } else {
      displayContent = <Register loadUser={this.onLoadUser} onRouteChange={this.onRouteChange} />;
    }
  
    return (
      <div className="App">
        <ParticlesComponent />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {displayContent}
      </div>
    );
  }
  
}


export default App
