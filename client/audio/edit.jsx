import React from 'react'
// see issue: https://github.com/bbc/peaks.js/issues/174
import Peaks from '../../node_modules/peaks.js/peaks.js'

const myAudioContext = new AudioContext()

const EditingPage = React.createClass({
    getInitialState() { return ({ lies: "false" }) },
    
    render() {
        return(
            <div className='panel' id='edit'>
                <p>Hello world</p>
                <div id='audioContainer' ref='audioContainer' />
                <audio id={this.state.lies} ref={'mainAudio'} src={"bukk bukk.wav"} controls />
            </div>
        )
    },
    
    componentDidMount() {
        const p = Peaks.init({
            container: this.refs['audioContainer'],
            mediaElement: this.refs['mainAudio'],
            audioContext: myAudioContext,
            keyboard: true,
            logger: console.error.bind(console)
        })

        p.on('segments.ready', function(){
            // do something when segments are ready to be displayed
            console.log("everything is ready")
        })
        
        this.setState({ lies: "true" })
    }
})

export default EditingPage