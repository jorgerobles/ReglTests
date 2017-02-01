import React, { Component } from 'react';

import { PerspectiveWebcam, VideoControls } from './Webcam.js'

class App extends Component {
    constructor(props){
      super(props)
      this.state={
        lens: {a:1, b:1.78289473684211, F:1.28399122807018, scale:0.490679824561404}, 
        fov: {x:1, y:1},
        //perspective: {before: [169,453,1180,485,871,324,452,315], after: [7,709,1273,706,1275,-10,0,-15]}
      }
    }
    render() {

      const change=(v)=> {
        this.setState(v)
      }


      return (
        <div className="App">
          <PerspectiveWebcam 
            width="1280" height="720" 
            lens={this.state.lens} fov={this.state.fov} 
            perspective={this.state.perspective}
//            src="../emblaser2.jpg"
            
             />
          <VideoControls lens={this.state.lens} fov={this.state.fov} onChange={change} />
          
        </div>
      );
    }
  }

export default App;
