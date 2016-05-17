import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';
//import INTERPRETED from '../client/static/translations';
import AudioRecorder from 'react-audio-recorder';

// using $ meteor add maxencecornet:audio-recorder
RecordPage = React.createClass({
    getInitialState () {
        return {
            audioURL: null,
            recording: false,
            recordedUpTo: 0,
            recordingWords: ["youth in Asia", "euthanasia", "a mission", "omission", "emission"]
        }
    },
                               
    startUserMedia (stream) {
        // audio_context comes predefined, somehow (?)
        // perhaps it's an environment variable
        var input = audio_context.createMediaStreamSource(stream);
        //__log('Media stream created.');
        console.log('Media stream created.');
        // Uncomment if you want the audio to feedback directly
        //input.connect(audio_context.destination);
        //__log('Input connected to audio context destination.');
    
        recorder = new Recorder(input);
        console.log('Recorder initialised.');
        //__log('Recorder initialised.');
    },
    
    startRecording (e : Event) {
        recorder && recorder.record();
        this.setState({
            recording: true
        });
        console.log('Recording...');
        
        var highlightId = 'recWord-' + this.state.recordedUpTo.toString();
        
        document.getElementById(highlightId).style.backgroundColor = 'yellow';
        //e.target.disabled = true; -- this is done in render using state
        //e.target.nextElementSibling.nextElementSibling.disabled = true;
    },
    
    stopRecording (e : Event) {
        recorder && recorder.stop();
        console.log('Stopped recording.')
        this.setState({
            recording: false
        });
        
        // reset background colours (highlighting)
        for (i=0; i<(this.state.recordingWords.length); i++) {
            var id = 'recWord-' + i.toString();
            document.getElementById(id).style.backgroundColor = 'white';
        }
    
        // create WAV download link using audio data blob
        // create client-side URL for <audio /> to use as src
        this.updateAudio();
    
        recorder.clear();
    },
    
    nextRecording () {
        console.log("hello!");
        
        // only need to increment this.state.recordedUpTo up to length of list
        if (this.state.recordedUpTo < this.state.recordingWords.length -1) {
            this.setState({
                recordedUpTo: this.state.recordedUpTo +1
            });
        } else {
            // otherwise, stop the recording as we've finished
            // doesn't work...
            this.stopRecording;
        }
    },
    
    // function to be passed to exportWAV
    makeUrl (blob) {
        this.setState({
            audioURL: URL.createObjectURL(blob)
        });
    },
    
    updateAudio() {
        recorder && recorder.exportWAV(this.makeUrl);
    },
    
    // This is used instead of window.onload = function init () {...}.
    // Should we use componentWillMount() instead? It is slightly earlier. Normally called on both client and server (according to docs),
    // but given that this is in the Meteor /client dir then we should only have it happen on the client anyway.
    componentDidMount () {
        try {
            // webkit shim
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            // navigator isn't defined anywhere...(?)
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
            // this line of code (below) is unnecessary? I think it's only for downloading the file that you just recorded
            window.URL = window.URL || window.webkitURL;
      
            audio_context = new AudioContext;
            console.log('Audio context set up.');
            console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
            //__log('Audio context set up.');
            //__log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
        } catch (e) {
            alert('No web audio support in this browser!');
        }
        
        navigator.getUserMedia({audio: true}, this.startUserMedia, function(e) {
            console.log('No live audio input: ' + e);
            //__log('No live audio input: ' + e);
        });
    },
    
    render() {
        // var display = 'inline'; // this is the default value
        var recordLabel;
        if (this.state.recordedUpTo === 0 && this.state.recording === false) {
            recordLabel = "Start recording";
        } else if (this.state.recordedUpTo < this.state.recordingWords.length -1 && this.state.recording === false) {
            recordLabel = "Continue recording";
        } else if (this.state.recordedUpTo === this.state.recordingWords.length -1 && this.state.recording === true) {
            recordLabel = "Done"; 
        } else if (this.state.recordedUpTo === this.state.recordingWords.length -1 && this.state.recording === false) {
            recordLabel = "Start again";
        } else {
            recordLabel = "Next";
        }
        
        return (
            <div id='record'>
                <p>Here is your list of words to record.</p>
                <div>
                    {/*Either the "start" button or the "next" button, depending on whether you are in the middle or recording or not.*/}
                    <button type="button" disabled={false}
                        onClick={this.state.recording ? this.nextRecording : this.startRecording}>
                        {recordLabel}
                        </button>
                    <button type="button" disabled={!this.state.recording} onClick={this.stopRecording}>Stop recording</button>
                </div>
                <ul>
                    {this.state.recordingWords.map(function(c, index) {
                        var recWordId = 'recWord-' + index.toString();
                        var backgroundColor = this.state.recording && index === this.state.recordedUpTo ? 'yellow' : 'white';
                        return (
                            <li id={recWordId} className='recWord' key={index} style={{backgroundColor}}>
                                <p style={{display: 'inline'}}>{c}</p>
                                <button type="button" onClick={this.startRecording}>Start recording</button>
                                <button type="button" onClick={this.stopRecording}>Stop recording</button>
                                <audio controls={false} muted={false} src={this.state.audioURL} />
                            </li>
                        );
                    }, this)}
                </ul>
                <audio id="rec-JS-audio" controls={true} muted={false} src={this.state.audioURL} />
                <pre id="log"></pre>
            </div>
        )
    }
});

export default RecordPage;

