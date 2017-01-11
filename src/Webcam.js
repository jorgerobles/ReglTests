
import React from 'react';
import ReactDOM from 'react-dom'
import getUserMedia from 'getusermedia';

import { flatImage, barrelDistort, perspectiveDistort } from './draw-commands/commands'


export class Webcam extends React.Component {

    componentWillUnmount() {
        this._stopVideo(this.stream);
    }

    componentDidMount() {

        this.video = ReactDOM.findDOMNode(this).querySelector('#stream video');
        this.canvas = ReactDOM.findDOMNode(this).querySelector('#stream canvas');

        let regl=require('regl')(this.canvas);
        const capture = () => {

               regl.frame(() => {
                    //barrelDistort(regl, this.video)
                    perspectiveDistort(regl,this.video, 
                        [30,30,30,this.video.height-30, this.video.width-30, this.video.height-30, this.video.width-30,0],
                        [30,30,30,this.video.height-30, this.video.width-30, this.video.height-30, this.video.width-30,0]
                    )
                    
               })

        }

        let constraints = Object.assign({ video: true, audio: false }, this.props.constraints || {})
        if (this.props.device)
            constraints = Object.assign(constraints, { deviceId: { exact: this.props.device } })


        getUserMedia(constraints, (err, stream) => {
            if (err) {
                console.error(err);
            } else {
                this.stream = stream;
                this._startVideo(this.stream, capture)
                
            }

        })
    }

    _startVideo(stream, callback) {
        let that=this;
        this.video.src = window.URL.createObjectURL(stream);
        this.video.addEventListener('loadeddata',(e)=>{
            if (this.video.readyState===4){
                callback.apply(that)
            }
        },false)
        
        this.video.play();
        this.canvas.width = this.video.width;
        this.canvas.height = this.video.height;
        
    };

    _stopVideo(stream) {
        if (this.video)
            this.video.parentNode.removeChild(this.video);
        window.URL.revokeObjectURL(stream);
    }

    render() {
        return <div className="webcamViewport" style={{ width: this.props.width, height: this.props.height, overflow: "hidden" }}>
            <div id="stream">
                <video width={this.props.width} height={this.props.height} style={{ display: "none" }} />
                <canvas />
            </div>
        </div>
    }

}

Webcam.defaultProps = {
    width: 320,
    height: 240
}