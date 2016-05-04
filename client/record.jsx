import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';
//import INTERPRETED from '../client/static/translations';
import AudioRecorder from 'react-audio-recorder';


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
            audioURL: null,
            recordingWords: ["youth in Asia", "euthanasia", "a mission", "omission", "emission"]
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
        
        document.getElementById('recWord-0').style.backgroundColor = 'yellow';
    },
    // ...so does this!
    stopRecording (button) {
        recorder && recorder.stop();
        // Below two lines disabled *temporarily*. Need to get that working later, but first there are bigger fish to fry, like getting this actually record stuff.
        //button.disabled = true;
        //button.previousElementSibling.disabled = false;
        console.log('Stopped recording.')
        
        // reset background colours (highlighting)
        for (i=0; i<5; i++) {
            var id = 'recWord-' + i.toString();
            document.getElementById(id).style.backgroundColor = 'white';
        }
    
        // create WAV download link using audio data blob
        // create client-side URL for <audio /> to use as src
        this.updateAudio();
    
        recorder.clear();
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
        // The buttons in the .map won't bind to this.startRecording, presumably because they can't see it.
        // That's the rationale behind this function here - to mediate between those buttons and the this.startRecording method.
        // They do bind to it, but the the startRecord function seems to be having trouble seeing this.startRecording as well.
        // But the buttons in the first <div> bind!
        // And binding with .map works in Arena!
        // WTF! So I'm not sure what to do.
        function startRecord() {
            this.startRecording;
            // The below prints 'undefined'.
            console.log(this.startRecording);
        }
        
        return (
            <div id='record'>
                <p>Here is your list of words to record.</p>
                <div>
                    {/*The below binds.*/}
                    <button type="button" onClick={this.startRecording}>Start recording</button>
                    <button type="button" onClick={this.stopRecording}>Stop recording</button>
                </div>
                <ul>
                    {this.state.recordingWords.map(function(c, index) {
                        var recWordId = 'recWord-' + index.toString();
                        return (
                            <li id={recWordId} className='recWord' key={index}>
                                <p style={{display: 'inline'}}>{c}</p>
                                {/*The below binds, but when called, does not call this.startRecording inside startRecord.*/}
                                <button type="button" onClick={startRecord}>Start recording</button>
                                {/*The below does not bind.*/}
                                <button type="button" onClick={this.stopRecording}>Stop recording</button>
                            </li>
                        );
                    })}
                </ul>
                <audio id="rec-JS-audio" controls={true} muted={false} src={this.state.audioURL} />
                <pre id="log"></pre>
            </div>
        )
    }
});

export default RecordPage;

