import React from 'react'
// see issue: https://github.com/bbc/peaks.js/issues/174
import Peaks from '../node_modules/peaks.js/peaks.js'

const myAudioContext = new AudioContext()

EditingPage = React.createClass({                       
    render() {
        return(
            <div className='panel' id='edit'>
                <p>Hello world</p>
                <div id='audioContainer' ref='audioContainer'>
                    <audio ref={'mainAudio'} src={"bukk bukk.wav"} />
                </div>
            </div>
        )
    },
    
    componentDidMount() {
        const p = Peaks.init({
            container: this.refs['audioContainer'],
            mediaElement: this.refs['mainAudio'],
            audioContext: myAudioContext,
            keyboard: true
        })

        p.on('segments.ready', function(){
            // do something when segments are ready to be displayed
            console.log("everything is ready")
        })
    }
})

export default EditingPage