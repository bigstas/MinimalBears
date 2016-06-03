import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';
import AudioRecorder from 'react-audio-recorder';

// using $ meteor add maxencecornet:audio-recorder
RecordPage = React.createClass({
    getInitialState () {
        return {
            audioURLs: [],
            recording: false,
            //recordedUpTo: -1, // '0' means that you *have* recorded the first one
            reRecordIndex: -1,
            recordingWords: ["youth in Asia", "euthanasia", "a mission", "omission", "emission"]
        }
    },
                               
    startUserMedia (stream) {
        // audio_context comes predefined, somehow (?)
        // perhaps it's an environment variable
        var input = audio_context.createMediaStreamSource(stream);
        console.log('Media stream created.');
        // Uncomment if you want the audio to feedback directly
        //input.connect(audio_context.destination);
        //__log('Input connected to audio context destination.');
    
        recorders = [];
        for (i=0; i<(this.state.recordingWords.length); i++) {
            var rec = new Recorder(input);
            recorders.push(rec);
        }
        console.log('Recorders initialised.')
        console.log(recorders);
    },
    
    startRecording () {        
        this.setState({
            recording: true,
            //recordedUpTo: 0,
            audioURLs: [] // reset all audio URLs
        });
        recorders[0].record();
        console.log('Recording...');
    },
    
    cutRecording (active) {
        recorders[active].stop();
        console.log('Stopped recording with recorder number ' + active.toString());
        
        this.setState({
            recording: false
        });
        
        // create WAV download link using audio data blob
        // create client-side URL for <audio /> to use as src
        this.updateAudio(active);
        
        // clear recorders
        recorders[active].clear();
        
        /*
        // if cutting from re-record
        if (this.state.reRecordIndex !== -1) {
            this.setState({
                reRecordIndex: -1,
                recording: false
            });
        }
        */
    },
    
    stopRecording () {
        //recorder && recorder.stop();
        // Below - if you want to save the recorded audio for the current word
        //this.cutRecording(this.state.recordedUpTo);
        this.cutRecording(this.state.audioURLs.length);
        
        console.log('Stopped all recordings.');
        this.setState({
            recording: false
        });
    },
    
    nextRecording () {
        // cutRecording also saves the recording.
        // We only need to call it if we're pressing 'next'.
        // If we're pressing 'continue recording', this would have already been done for us with 'stop recording'.
        if (this.state.recording) {
            //this.cutRecording(this.state.recordedUpTo);
            this.cutRecording(this.state.audioURLs.length);
            this.setState({
                // just to get a re-render!
            });
        } else {
            this.setState({
                recording: true
            });
        }
        
        //recorders[this.state.recordedUpTo +1].record();
        console.log(this.state.audioURLs);
        recorders[this.state.audioURLs.length].record();
        
        /*
        // If this.state.recording === true, then we're pressing 'Next' during recording, meaning we should increment this.state.recordedUpTo.
        // If false, then we want to continue from where we left off, and we want to set this.state.recording = true.
        if (this.state.recording) {
            this.setState({
                recordedUpTo: this.state.recordedUpTo +1
            });
        } else {
            this.setState({
                recording: true
            });
        }
        */
    },
    
    // function to be passed to exportWAV
    makeUrl (blob) {
        console.log("makeUrl says that this.state.reRecordIndex is equal to " + this.state.reRecordIndex.toString() );
        if (this.state.reRecordIndex === -1) {
            // if not re-recording, push to make array 1 longer
            this.state.audioURLs.push(URL.createObjectURL(blob));
        } else {
            // if re-recording, replace element with re-recorded audio URL
            this.state.audioURLs[this.state.reRecordIndex] = URL.createObjectURL(blob);
        }
        // we need the component to update, so don't remove this.setState!
        this.setState({
            reRecordIndex: -1
        });
    },
    
    updateAudio(active) {
        //recorder && recorder.exportWAV(this.makeUrl);
        recorders[active].exportWAV(this.makeUrl);
    },
    
    playbackAll() {
        // Below isn't working properly... still plays all the audio at once...
        //for (i=0; i<=(this.state.recordedUpTo); i++) {
        for (i=0; i<=(this.state.audioURLs.length); i++) {
            var audioId = '#recWord-' + i.toString() + '-audio'; // querySelector uses CSS selectors, so '#' necessary to mark id
            document.querySelector(audioId).addEventListener("ended", this.playback(i+1), false);
        }
        
        /*
        // below - plays all the audio at once!
        for (i=0; i<=(this.state.recordedUpTo); i++) {
            var audioId = 'recWord-' + i.toString() + '-audio';
            document.getElementById(audioId).play();
        }
        */
    },
    
    playback(index) {
        if (this.state.audioURLs[index]) {
            // debug logs
            console.log(this.state.audioURLs);
            console.log("Index is " + index.toString());
            var audioId = 'recWord-' + index.toString() + '-audio';
            document.getElementById(audioId).play();
        } else {
            console.log("audio URL out of range: " + index.toString());
        }
    },
    
    reRecord(index) {
        // re-record!!
        //alert("This feature is yet to be implemented.");
        this.setState({
            reRecordIndex: index,
            recording: true
        });
        // no need to clear, as clear is done on cutRecording after it is recorded the first time
        recorders[index].record();
        console.log("Re-recording audio with index " + index.toString() + "...");
    },
    
    submitAudio() {
        alert("Your audio has not been submitted. Staś and Guy are yet to implement this feature.");
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
        } catch (e) {
            alert('No web audio support in this browser!');
        }
        
        navigator.getUserMedia({audio: true}, this.startUserMedia, function(e) {
            console.log('No live audio input: ' + e);
        });
    },
    
    render() {
        // var display = 'inline'; // this is the default value
        var recordLabel;
        var recFunction;
        //if (this.state.recordedUpTo === -1 && this.state.recording === false) {
        if (this.state.audioURLs.length === 0 && this.state.recording === false) {
            recordLabel = "Start recording";
            recFunction = this.startRecording;
        } // else if (this.state.recordedUpTo < this.state.recordingWords.length -1 && this.state.recording === false) {
        else if (this.state.audioURLs.length < this.state.recordingWords.length && this.state.recording === false) {
            recordLabel = "Continue recording";
            recFunction = this.nextRecording; 
        } // else if (this.state.recordedUpTo === this.state.recordingWords.length -1 && this.state.recording === true) {
        else if (this.state.audioURLs.length === this.state.recordingWords.length -1 && this.state.recording === true) {
            recordLabel = "Done";
            recFunction = this.stopRecording;
        } // else if (this.state.recordedUpTo === this.state.recordingWords.length -1 && this.state.recording === false) {
        else if (this.state.audioURLs.length === this.state.recordingWords.length && this.state.recording === false) {
            recordLabel = "Start again";
            recFunction = this.startRecording;
        } else {
            recordLabel = "Next";
            recFunction = this.nextRecording; 
        }
        
        //var playAllDisabled = (this.state.recordedUpTo === -1 || this.state.recording) ? true : false;
        //var submitDisabled = (this.state.recordedUpTo === this.state.recordingWords.length && !this.state.recording) ? false : true;
        var playAllDisabled = (this.state.audioURLs.length === 0 || this.state.recording) ? true : false;
        var submitDisabled = (this.state.audioURLs.length === this.state.recordingWords.length && !this.state.recording) ? false : true;
        
        return (
            <div id='record'>
                <p>Here is your list of words to record.</p>
                <div>
                    {/*Either the "start" button or the "next" button, depending on whether you are in the middle or recording or not.*/}
                    <button type="button" disabled={false}
                        onClick={recFunction}>
                        {recordLabel}
                        </button>
                    <button type="button" disabled={!this.state.recording} onClick={this.stopRecording}>Stop recording</button>
                </div>
                <ul>
                    {this.state.recordingWords.map(function(c, index) {
                        var recWordId = 'recWord-' + index.toString();
                        var recWordIdLi = recWordId + '-li';
                        var recWordIdAudio = recWordId + '-audio';
            
                        //var backgroundColor = this.state.recording && index === this.state.recordedUpTo ? 'yellow' : 'white';
                        //var localButtonDisabled = (index <= this.state.recordedUpTo && this.state.recording === false) ? false : true;
                        var backgroundColor = (this.state.recording && ((index === this.state.audioURLs.length && this.state.reRecordIndex === -1) || index === this.state.reRecordIndex)) ? 'yellow' : 'white';
            
                        var playbackButtonDisabled = (index < this.state.audioURLs.length && this.state.recording === false) ? false : true;
            
                        var reRecordButtonDisabled = (index < this.state.audioURLs.length && this.state.recording === false) || (index === this.state.reRecordIndex && this.state.recording === true) ? false: true;
                        var reRecordLabel = (index === this.state.reRecordIndex) ? 'Done re-recording' : 'Re-record';
                        var reRecordFunc = this.state.reRecordIndex === -1 ? this.reRecord.bind(this, index) : this.cutRecording.bind(this, index);
            
                        return (
                            <li id={recWordIdLi} className='recWord' key={index} style={{backgroundColor}}>
                                <p style={{display: 'inline'}}>{c}</p>
                                {/*In my (Staś) editor, there is inconsistent colouring of 'this' and other variables. Why?*/}
                                {/*It seems to be calling the function, rather than binding it...*/}
                                <button type="button" disabled={playbackButtonDisabled} onClick={this.playback.bind(this, index)}>Play back</button>
                                <button type="button" disabled={reRecordButtonDisabled} onClick={reRecordFunc}>{reRecordLabel}</button>
                                <audio id={recWordIdAudio} controls={false} muted={false} src={this.state.audioURLs[index]} />
                            </li>
                        );
                    }, this)}
                </ul>
                <button type="button" disabled={playAllDisabled} onClick={this.playbackAll}>Play all</button>
                <button type="button" disabled={submitDisabled}  onClick={this.submitAudio}>Submit!</button> 
                {/*May want to make the Submit button type="submit"*/}
            </div>
        )
    }
});

export default RecordPage;

