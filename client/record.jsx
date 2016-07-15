import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';
//import AudioRecorder from 'react-audio-recorder';
import update from 'react-addons-update';

// using $ meteor add maxencecornet:audio-recorder
RecordPage = React.createClass({
    getInitialState () {
        return {
            audioURLs: [],
            recording: false,
            //recordedUpTo: -1, // '0' means that you *have* recorded the first one
            active: -1,
            //reRecordIndex: -1,
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
            var rec = new Recorder(input);  // from maxencecornet:audio-recorder
            recorders.push(rec);
        }
        console.log('Recorders initialised.')
        console.log(recorders);
    },
    
    startRecording () {        
        this.setState({
            recording: true,
            active: 0
        });
        recorders[0].record();
        console.log('Recording...');
    },
    
    cutRecording () {
        recorders[this.state.active].stop();
        console.log('Stopped recording with recorder number ' + this.state.active.toString());
        
        // create WAV download link using audio data blob
        // create client-side URL for <audio /> to use as src
        recorders[this.state.active].exportWAV(this.makeUrl.bind(this, this.state.active));
        
        // clear recorders
        recorders[this.state.active].clear();
    },
    
    // function to be passed to exportWAV
    makeUrl (index, blob) {
        this.setState({
            audioURLs: update(this.state.audioURLs, {[index]: {$set: URL.createObjectURL(blob) }})
        });
        
        /*
        this.state.audioURLs[index] = URL.createObjectURL(blob);
        this.setState({
            // it's a ghost!
        });
        */
    },
    
    stopRecording () {
        this.cutRecording();
        
        console.log('Stopped all recordings.');
        this.setState({
            recording: false,
            active: this.state.active +1
        });
    },
    
    finishRecording() {
        this.cutRecording();
        
        this.setState({
            recording: false,
            active: this.state.active +1
        })
    },
    
    nextRecording () {
        this.cutRecording();
        console.log(this.state.audioURLs);
        recorders[this.state.active +1].record();
        this.setState({
            active: this.state.active +1
        });
    },
    
    continueRecording () {
        recorders[this.state.active].record();
        this.setState({
            recording: true
        })
    },
    
    reRecord(index) {
        this.setState({
            active: index,
            recording: 2
        });
        // no need to clear, as clear is done on cutRecording after it is recorded the first time
        recorders[index].record();
        console.log("Re-recording audio with index " + index.toString() + "...");
    },
    
    stopReRecord () {
        this.cutRecording();
        this.setState({
            active: this.state.audioURLs.length,
            recording: false
        })
    },
    
    playbackAll() {
        // Below isn't working properly... still plays all the audio at once...
        //for (i=0; i<=(this.state.recordedUpTo); i++) {
        
        this.setState({
            recording: "playback",
            active: 0
        });
        
        /*
        for (i=0; i<=(this.state.audioURLs.length); i++) {
            var audioId = '#recWord-' + i.toString() + '-audio'; // querySelector uses CSS selectors, so '#' necessary to mark id
            document.querySelector(audioId).addEventListener("ended", this.playback(i+1), false);
        }
        */
    },
    
    playback(index) {
        // Plays the audio element with a given index.
        if (this.state.audioURLs[index]) {
            // debug logs
            console.log(this.state.audioURLs);
            console.log("Index is " + index.toString());
            // get element id and play audio
            var audioId = 'recWord-' + index.toString() + '-audio';
            document.getElementById(audioId).play();
        } else {
            console.log("audio URL out of range: " + index.toString());
        }
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
        // The following two variables define what the main "record" button will look like and do.
        var recordLabel;
        var recFunction;
        var playButtonDisabled = false;

        if (this.state.recording === false) {
            if (this.state.active === -1) {
                recordLabel = "Start recording";
                recFunction = this.startRecording;
            }
            else if (this.state.active < this.state.recordingWords.length) {
                recordLabel = "Continue recording";
                recFunction = this.continueRecording; 
            }
            else {
                recordLabel = "Re-record all";
                recFunction = this.startRecording;
            }
        }
        else if (this.state.recording === true) {
            if (this.state.active === this.state.recordingWords.length -1) {
                recordLabel = "Done";
                recFunction = this.finishRecording;
            }
            else {
                recordLabel = "Next";
                recFunction = this.nextRecording; 
            }
        }
        // this is when re-recording, and this.state.recording === 2
        else if (this.state.recording === 2) {
            playButtonDisabled = true;
            recordLabel = '...';
        }
        else if (this.state.recording === "playback") {
            if (this.state.active < this.state.audioURLs.length) {
                var audioId = 'recWord-' + this.state.active.toString() + '-audio';
                var _this = this; // so we can access 'this' inside the function
                document.getElementById(audioId).addEventListener("ended", function(){
                    _this.setState({
                        active: _this.state.active +1
                    });
                });
                this.playback(this.state.active);
            } else {
                this.setState({
                    recording: false
                });
            }
        }
        else {
            throw ("this.state.recording is unrecognised, current value is: " + this.state.recording.toString())
        }

        var playAllDisabled = (this.state.audioURLs.length === 0 || this.state.recording) ? true : false;
        var submitDisabled = (this.state.audioURLs.length === this.state.recordingWords.length && !this.state.recording) ? false : true;
        
        return (
            <div id='record'>
                <p>Here is your list of words to record.</p>
                <div>
                    {/*Either the "start" button or the "next" button, depending on whether you are in the middle or recording or not.*/}
                    <button type="button" disabled={playButtonDisabled}
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
                        var backgroundColor = this.state.recording && (index === this.state.active) ? 'yellow' : 'white';
            
                        var playbackButtonDisabled = (index < this.state.active && this.state.recording === false) ? false : true;
                        var reRecordButtonDisabled = (index < this.state.active && this.state.recording === false) || (this.state.recording === 2) ? false: true;
            
                        var reRecordLabel = (this.state.recording === 2 && index === this.state.active) ? 'Done re-recording' : 'Re-record';
                        var reRecordFunc = this.state.recording === 2 ? this.stopReRecord : this.reRecord.bind(this, index);
            
                        return (
                            <li id={recWordIdLi} className='recWord' key={index} style={{backgroundColor}}>
                                <p style={{display: 'inline'}}>{c}</p>
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

