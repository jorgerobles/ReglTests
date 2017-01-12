
import React from 'react';
import ReactDOM from 'react-dom'
import getUserMedia from 'getusermedia';

import Draggable from 'react-draggable';
import Select from 'react-select'

import { drawCommand, barrelDistort, perspectiveDistort } from './draw-commands/commands'


export class Webcam extends React.Component {

    componentWillUnmount() {
        this._stopVideo(this.stream);
    }

    componentDidMount() {

        this.video = ReactDOM.findDOMNode(this).querySelector('#stream video');
        this.canvas = ReactDOM.findDOMNode(this).querySelector('#stream canvas');
        
        this.image = new Image()
        this.image.src = '../emblaser2.jpg'
        
        

        const regl = require('regl')(this.canvas);
        const pipe = drawCommand(regl)

        const ratio = (value, index) => {
            let wh = !(index % 2) ? this.props.width : this.props.height;
            let rwh = !(index % 2) ? this.props.resolution.width : this.props.resolution.height;
            return parseInt((value / wh) * rwh);
        }

        const capture = (src) => {

            const texture = regl.texture(src)
                  texture.mipmap = 'nice'

            this.canvas.width = texture.width
            this.canvas.height = texture.height

            const fbo = regl.framebuffer({ width: this.props.resolution.width, height: this.props.resolution.height })
            const fbo2 = regl.framebuffer({ width: this.props.resolution.width, height: this.props.resolution.height })

            const loop = regl.frame(() => {
                try{
                    fbo({ width: this.props.resolution.width, height: this.props.resolution.height });
                    fbo2({ width: this.props.resolution.width, height: this.props.resolution.height });
                    texture(src)
                    
                    pipe({ src: texture, dest:fbo })
                    barrelDistort(regl, fbo, fbo2, this.props.lens, this.props.fov)

                    let {before, after} = this.props.perspective;
                    perspectiveDistort(regl, fbo2, null, before.map(ratio), after.map(ratio))
                } catch(e) {
                    loop.cancel();
                }

            })

        }
        /*
        let constraints = Object.assign({ video: true, audio: false }, this.props.constraints || {})
        if (this.props.device)
            constraints = Object.assign(constraints, { deviceId: { exact: this.props.device }, mandatory: { minWidth: this.props.resolution.width, minHeight: this.props.resolution.height } })



        getUserMedia(constraints, (err, stream) => {
            if (err) {
                console.error(err);
            } else {
                this.stream = stream;
                this._startVideo(this.stream, capture)

            }

        })
        */
        this.image.addEventListener('load',(e)=>{
            capture(this.image)
        })
        
    }

    _startVideo(stream, callback) {
        let that = this;
        this.video.src = window.URL.createObjectURL(stream);
        this.video.addEventListener('loadeddata', (e) => {
            if (this.video.readyState === 4) {
                callback.apply(that)
            }
        }, false)

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
        return <div className="webcamViewport" style={{ width: this.props.width + "px", height: this.props.height + "px", overflow: "hidden" }}>
            <div id="stream">
                <video width={this.props.width} height={this.props.height} style={{ display: "none" }} />
                
                <canvas />
            </div>
        </div>
    }

}

Webcam.defaultProps = {
    width: 1280,
    height: 720,
    resolution: { width: 1280, height: 720 }
}

export class Coordinator extends React.Component {

    constructor(props) {
        super(props);
        this.state = { position: this.props.position || [0, 0, 0, 0, 0, 0, 0, 0] }
        this.handleDrag.bind(this)
        this.handleStop.bind(this)
    }

    handleDrag(e, ui, index) {
        let position = Object.assign({}, this.state.position);
        position[index * 2] = position[index * 2] + ui.deltaX;
        position[index * 2 + 1] = position[index * 2 + 1] + ui.deltaY;
        this.setState({ position: position });

        if (this.props.onChange)
            this.props.onChange(position)
    }

    handleStop(e, ui, index) {
        if (this.props.onStop)
            this.props.onStop(this.state.position)
    }

    render() {

        let dots = this.props.dots || ['red', 'green', 'blue', 'purple']
        let dotSize = this.props.dotSize || 10;
        let symbol = this.props.symbol || ((props) => { return <svg height="100%" width="100%"><circle r="50%" cx="50%" cy="50%" fill={props.fill} stroke="white" strokeWidth="1" /></svg> })

        return <div className="coordinator" style={{ pointerEvents:"none",  width: this.props.width + "px", height: this.props.height + "px", position: 'relative', overflow: 'hidden', border: "1px solid #eee", ...this.props.style }}>
            {dots.map((fill, i) => {
                return <Draggable onStop={(e, ui) => { this.handleStop(e, ui, i) } } onDrag={(e, ui) => this.handleDrag(e, ui, i)} key={i} position={{ x: this.state.position[i * 2], y: this.state.position[i * 2 + 1] }} bounds="parent">
                    <div className="symbol" style={{ pointerEvents:"all",cursor: "move", marginTop: -dotSize / 2, marginLeft: -dotSize / 2, width: dotSize, height: dotSize }}>{symbol({ fill })}</div>
                </Draggable>
            })}
        </div >
    }
}

export class PerspectiveWebcam extends React.Component {

    constructor(props) {
        super(props);
        let w = this.props.width;
        let h = this.props.height;
        let p = this.props.perspective;

        this.state = {
            before: (p && p.before) ? p.before : [
                w * 0.2, h * 0.8,
                w * 0.8, h * 0.8,
                w * 0.8, h * 0.2,
                w * 0.2, h * 0.2
            ],
            after: (p && p.after) ? p.after : [
                w * 0.2, h * 0.8,
                w * 0.8, h * 0.8,
                w * 0.8, h * 0.2,
                w * 0.2, h * 0.2
            ],
        }
        this.handlePerspectiveChange.bind(this)
        this.handleStop.bind(this)
    }

    handlePerspectiveChange(position, key) {
        this.setState({ [key]: Object.values(position) })
    }

    handleStop() {
        if (this.props.onStop)
            this.props.onStop(this.state);
    }

    render() {

        let before = this.state.before;
        let after = this.state.after;

        return <div className="perspectiveWebcam">
            <div className="viewPort">
                <Webcam width={this.props.width} height={this.props.height} perspective={{ before, after }} lens={this.props.lens} fov={this.props.fov} device={this.props.device} />
                <Coordinator width={this.props.width} height={this.props.height}
                    onChange={(position) => { this.handlePerspectiveChange(position, "before") } }
                    onStop={(position) => { this.handleStop() } }
                    position={this.state.before}
                    style={{ position: "absolute", top: "0px", left: "0px" }}
                    symbol={
                        (props) => { return <svg height="100%" width="100%"><rect x="0" y="0" width="10" height="10" fill={props.fill} stroke="white" strokeWidth="1" /></svg> }
                    }
                    />
                <Coordinator width={this.props.width} height={this.props.height}
                    onChange={(position) => { this.handlePerspectiveChange(position, "after") } }
                    onStop={(position) => { this.handleStop() } }
                    position={this.state.after}
                    style={{ position: "absolute", top: "0px", left: "0px" }}
                    />
            </div>
        </div>
    }

}

export class VideoControls extends React.Component{

    constructor(props){
        super(props)
        this.handleChange.bind(this)
        this.state={
            lens:this.props.lens,
            fov: this.props.fov,
        }
    }

    handleChange(e,key,prop){
        let state={...this.state};
            state[key][prop]= e.target.value;
        this.setState(state)
        if (this.props.onChange)
            this.props.onChange(state);
        
    }

    render(){
        return <div className="videoControls">
            
            <label>a        <input className="form-control" value={this.props.lens.a} onChange={(e)=>{this.handleChange(e, "lens","a");}} type="range"  min="0" max="4" step="any"/></label>
            <label>b        <input className="form-control" value={this.props.lens.b} onChange={(e)=>{this.handleChange(e, "lens","b");}} type="range"  min="0" max="4" step="any"/></label>
            <label>F        <input className="form-control" value={this.props.lens.f} onChange={(e)=>{this.handleChange(e, "lens","F");}} type="range"  min="0" max="4" step="any" /></label>
            <label>scale    <input className="form-control" value={this.props.lens.scale} onChange={(e)=>{this.handleChange(e, "lens","scale");}} type="range"  min="0" max="20" step="any"/></label>
            <label>Fov X    <input className="form-control" value={this.props.fov.x} onChange={(e)=>{this.handleChange(e, "fov","x");}} type="range"  min="0" max="2" step="any" /></label>
            <label>Fov Y    <input className="form-control" value={this.props.fov.y} onChange={(e)=>{this.handleChange(e, "fov","y");}} type="range"  min="0" max="2" step="any" /></label>

            <code>{JSON.stringify(this.state)}</code>
        </div>
    }

}
