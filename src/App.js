import React, { Component } from 'react';

import { PerspectiveWebcam, VideoControls } from './Webcam.js'

class App extends Component {
    constructor(props){
      super(props)
      this.state={
        lens: {a:1, b:1.78289473684211, F:1.28399122807018, scale:0.490679824561404}, 
        fov: {x:1, y:1},
        perspective: {before: [217,181,436,180,88,253,589,270], after: [2,1,635,-3,0,410,635,405]}
        //[175,156,496,55,162,275,503,314],"after":[1,63,635,61,3,410,635,405]
      }
    }
    render() {

      const change=(v)=> {
        this.setState(v)
      }

      return (
        <div className="App">
          <PerspectiveWebcam 
            width="640" height="425" 
            lens={this.state.lens} fov={this.state.fov} 
            perspective={this.state.perspective}
            src="../emblaser2.jpg"
            
             />
          <VideoControls lens={this.state.lens} fov={this.state.fov} onChange={change} />
        </div>
      );
    }
  }

export default App;
