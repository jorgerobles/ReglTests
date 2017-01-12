import React, { Component } from 'react';

import { PerspectiveWebcam, VideoControls } from './Webcam.js'

class App extends Component {
    constructor(props){
      super(props)
      this.state={lens: {a:1, b:1, F:1, scale:1}, fov: {x:1, y:1}}
    }
    render() {

      const change=(v)=> {
        this.setState(v)
      }

      return (
        <div className="App">
          <PerspectiveWebcam width="1280" height="720" lens={this.state.lens} fov={this.state.fov} />
          <VideoControls lens={this.state.lens} fov={this.state.fov} onChange={change} />
        </div>
      );
    }
  }

export default App;
