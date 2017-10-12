import React from 'react'
import Translate from 'react-translate-component'
import Peaks from 'peaks.js'


const myAudioContext = new AudioContext()


const PeaksObject = React.createClass({
    render() {
        return (
            <div>
                <div id='audioContainer' ref='audioContainer' />
                <audio id='editAudio' ref={'mainAudio'} src={this.props.src} controls />
            </div>
        )
    },
    
    updatePeaksObject() {
        const instance = Peaks.init({
            container: this.refs['audioContainer'],
            mediaElement: this.refs['mainAudio'],
            audioContext: myAudioContext,
            keyboard: false,
            segments: [{
                startTime: 1,
                endTime: 10,
                editable: true,
                color: "#ff0000",
                labelText: "My label"
            }],
            zoomAdapter: 'animated',
            overviewHighlightRectangleColor: 'grey',
            logger: console.error.bind(console)
        })

        instance.on('segments.ready', function(){
            // do something when segments are ready to be displayed
            console.log("everything is ready")
        })
        
        this.setState({ 
            instance: instance
        })
    },
    
    componentDidMount() { this.updatePeaksObject() },
    componentDidUpdate() { 
        this.state.instance.destroy() // to free up resources used by the old instance
        this.updatePeaksObject() },   // instantiates a new instance
    shouldComponentUpdate(nextProps, nextState) {  // to prevent infinite loops due to state being updated and then re-rendering
        if (this.props.src === nextProps.src) { 
            console.log("the props are the same, no need to change the Peaks object")
            return false
        } else {
            console.log("the Peaks object will change now as the new props have been provided")
            return true
        }
    }
})



const EditingPage = React.createClass({
    getInitialState() { 
        return ({ 
            lies: "false",
            src: ["bukk bukk.wav", "monka.m4a"],
            whichSrc: 0
        }) 
    },
    
    handleSubmit() {
        const segment = this.refs.PeaksObject.state.instance.segments.getSegments()[0]
        const times = [segment.startTime, segment.endTime]
        console.log(times)
        this.setState({ whichSrc: this.state.whichSrc +1 })
        alert("On to the next audio clip!")
    },
    
    playClip() {
        const segments = this.refs.PeaksObject.state.instance.segments.getSegments()
        this.refs.PeaksObject.state.instance.player.playSegment(segments[0])
    },
    
    render() {
        return(
            <div className='panel' id='edit'>
                <p>Welcome to the editing page!</p>
                <PeaksObject src={this.state.src[this.state.whichSrc]} ref="PeaksObject" />
                <div className="authbtn" onClick={this.handleSubmit} >
                    <Translate content="edit.submit" />
                </div>
                <div className="authbtn" onClick={this.playClip} >
                    <Translate content="edit.playClip" />
                </div>
            </div>
        )
    }
})

export default EditingPage