import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';
//import INTERPRETED from '../client/static/translations';
import AudioRecorder from 'react-audio-recorder';

/*
// from the recorder.js example
function __log(e, data) {
    //log.innerHTML += "\n" + e + " " + (data || '');
}
var audio_context;
var recorder;
function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
    //__log('Media stream created.');
    console.log('Media stream created.');
    // Uncomment if you want the audio to feedback directly
    //input.connect(audio_context.destination);
    //__log('Input connected to audio context destination.');
    
    recorder = new Recorder(input);
    __log('Recorder initialised.');
}
function startRecording(button) {
    recorder && recorder.record();
    button.disabled = true;
    button.nextElementSibling.disabled = false;
    __log('Recording...');
}
function stopRecording(button) {
    recorder && recorder.stop();
    button.disabled = true;
    button.previousElementSibling.disabled = false;
    __log('Stopped recording.');
    
    // create WAV download link using audio data blob
    createDownloadLink();
    
    recorder.clear();
}
function createDownloadLink() {
    recorder && recorder.exportWAV(function(blob) {
        var url = URL.createObjectURL(blob);
        var li = document.createElement('li');
        var au = document.createElement('audio');
        var hf = document.createElement('a');
      
        au.controls = true;
        au.src = url;
        hf.href = url;
        hf.download = new Date().toISOString() + '.wav';
        hf.innerHTML = hf.download;
        li.appendChild(au);
        li.appendChild(hf);
        recordingslist.appendChild(li);
    });
}
window.onload = function init() {
    try {
    // webkit shim
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        window.URL = window.URL || window.webkitURL;
      
        audio_context = new AudioContext;
        __log('Audio context set up.');
        __log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    } catch (e) {
        alert('No web audio support in this browser!');
    }
    
    navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
        __log('No live audio input: ' + e);
    });
};
*/



// using $ meteor add maxencecornet:audio-recorder
// if ultimately not used, delete this code and run
// $ meteor remove maxencecornet:audio-recorder
RecordPage = React.createClass({
    //********* from here - using MaximeCornet audio recoder *********
    handleRecord () {
        // no initialisation, following Nav example of this.mouseIsDownOnDropdown
        this.audioRecorder = new AudioRecorder();
        this.audioRecorder.startRecording();
    },
    // at the moment this autodownloads, not what we want but perhaps we could modify it?
    stopRecord () { 
        if (this.audioRecorder) {
            this.audioRecorder.stopRecording('wav', 'wavFile', this.recordCallback); 
        }
    },
    
    recordCallback () {
        // populate this
    },
    
    // --end
    //********* from here on - using record.js *********
    getInitialState () {
        return {
            audioURL: null
        }
    },
    
    __log (e, data) {
        // this is supposed to update a DOM <pre> element with id="log"
        //log.innerHTML += "\n" + e + " " + (data || '');
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
    
    // this definitely needs to be done differently!
    startRecording (button) {
        recorder && recorder.record();
        // Below two lines disabled *temporarily*. Need to get that working later, but first there are bigger fish to fry, like getting this actually record stuff.
        //button.disabled = true;
        //button.nextElementSibling.disabled = false;
        console.log('Recording...');
        //__log('Recording...');
    },
    // ...so does this!
    stopRecording (button) {
        recorder && recorder.stop();
        // Below two lines disabled *temporarily*. Need to get that working later, but first there are bigger fish to fry, like getting this actually record stuff.
        //button.disabled = true;
        //button.previousElementSibling.disabled = false;
        console.log('Stopped recording.')
        //__log('Stopped recording.');
    
        // create WAV download link using audio data blob
        // needs to be renamed! doesn't create a download link, creates a url as a src for the <audio />
        this.createDownloadLink();
    
        recorder.clear();
    },
    
    // function to be passed to exportWAV
    makeUrl (blob) {
        this.setState({
            audioURL: URL.createObjectURL(blob)
        });
    },
    
    createDownloadLink() {
        // When this.setState is inside recorder.exportWAV, then you get another error: this.setState is not a function.
        // recorder.exportWAV doesn't have a problem understanding what 'blob' is, even though it's not defined elsewhere.
        // I guess that the exportWAV method makes a blob, which is what it uses with the function (callback?) inside it,
        // but when you tell it to do this.setState it might not be clear on where "this" is, and therefore not be able to do it.
        // Before that, I tried using this.url to change <audio />'s src, but in order for it to update you need a re-render, 
        // so I thought it might be better to use a state variable since that would force a re-render, and also because direct sub-objects
        // like this.X rather than this.state.X or this.props.X seem to non-React-ish and perhaps slightly hacky.
        // Another solution might be to use this.url after all and force a re-render when you record something.
        
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
        return (
            <div id='record'>
                <p>This is the record page</p>
                <AudioRecorder />
                <div>
                    <button type="button" onClick={this.handleRecord}>Record!</button>
                    <button type="button" onClick={this.stopRecord}>Stop!</button>
                </div>
                <div>
                    <button type="button" onClick={this.startRecording}>Start recording with recorder.js</button>
                    <button type="button" onClick={this.stopRecording}>Stop recording with recorder.js</button>
                </div>
                <audio id="rec-JS-audio" controls={true} muted={false} src={this.state.audioURL} />
                <pre id="log"></pre>
            </div>
        )
    }
});

export default RecordPage;

