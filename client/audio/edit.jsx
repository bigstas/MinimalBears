import React from 'react'
import Translate from 'react-translate-component'
import Peaks from 'peaks.js'


const myAudioContext = new AudioContext()

const EditingPage = React.createClass({
    getInitialState() { return ({ lies: "false" }) },
    
    handleSubmit() {
        const segment = this.state.instance.segments.getSegments()[0]
        const times = [segment.startTime, segment.endTime]
        console.log(times)
        alert("something should happen now")
    },
    
    playClip() {
        const segments = this.state.instance.segments.getSegments()
        this.state.instance.player.playSegment(segments[0])
    },
    
    render() {
        return(
            <div className='panel' id='edit'>
                <p>Welcome to the editing page!</p>
                <div id='audioContainer' ref='audioContainer' />
                <audio id={this.state.lies} ref={'mainAudio'} src={"bukk bukk.wav"} controls />
                <div className="authbtn" onClick={this.handleSubmit} >
                    <Translate content="edit.submit" />
                </div>
                <div className="authbtn" onClick={this.playClip} >
                    <Translate content="edit.playClip" />
                </div>
            </div>
        )
    },
    
    componentDidMount() {
        const instance = Peaks.init({
            container: this.refs['audioContainer'],
            mediaElement: this.refs['mainAudio'],
            audioContext: myAudioContext,
            keyboard: true,
            segments: [{
                startTime: 1,
                endTime: 10,
                editable: true,
                color: "#ff0000",
                labelText: "My label"
            }],
            logger: console.error.bind(console)
        })

        instance.on('segments.ready', function(){
            // do something when segments are ready to be displayed
            console.log("everything is ready")
        })
        
        this.setState({ 
            lies: "true",
            instance: instance
        })
    }
})

export default EditingPage