import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';
import update from 'react-addons-update';
//import Recorder from 'recorderjs';  // !!!

// navigator.mediaDevices.getUserMedia compatibility with different browsers
// https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia

// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function(constraints) {

    // First get hold of the legacy getUserMedia, if present
    var getUserMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia);

    // Some browsers just don't implement it - return a rejected promise with an error
    // to keep a consistent interface
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }

    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    return new Promise(function(resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  }
}

// Cross-browser AudioContext and URL
// https://developer.mozilla.org/en/docs/Web/API/AudioContext
// https://developer.mozilla.org/en/docs/Web/API/Window/URL

const AudioContext = window.AudioContext || window.webkitAudioContext;
const URL = window.URL || window.webkitURL


RecordPage = React.createClass({
	
    getInitialState () {
        return {
        	recorder: null,
        	audioURLs: [],
            recording: false,
            active: -1
        }
    },
    
    componentWillMount() {
    	// Set up audio context (which contains audio nodes)
        const audioContext = new AudioContext();
        // Find the microphone (note, using a Promise)
        navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(
    		stream => {
    			// Create the audio node for the microphone
    			const input = audioContext.createMediaStreamSource(stream);
    			// Create the recorder node (connected to the audio node)
    			const recorder = new Recorder(input)
    			this.setState({
    				recorder
    			})
    		})
    },
    
    startRecording () {
    	/* Start recording from the first item
    	 */
        this.setState({
            recording: true,
            active: 0
        });
        this.state.recorder.record();
        console.log('Recording...');
    },
    
    cutRecording () {
    	/* Stop the recorder, save the data with a URL, clear the recorder
    	 */
        this.state.recorder.stop();
        this.state.recorder.exportWAV(this.makeUrl.bind(this, this.state.active));
        this.state.recorder.clear();
    },
    
    makeUrl (index, blob) {
    	/* Function passed to exportWav (above)
    	 * Create a URL for the blob, and put it in this.state.audioURLs[index]
    	 */
        this.setState({
            audioURLs: update(this.state.audioURLs, {[index]: {$set: URL.createObjectURL(blob) }})
        });
    },
    
    stopRecording () {
    	/* Stop all recording
    	 */
        this.cutRecording();
        this.setState({
            recording: false,
            active: this.state.active +1
        });
        console.log('Stopped all recordings.');
    },
    
    nextRecording () {
    	/* Stop recording the current word, start recording the next word
    	 */
        this.cutRecording();
        this.state.recorder.record();
        this.setState({
            active: this.state.active +1
        });
        console.log(this.state.audioURLs);
    },
    
    continueRecording () {
    	/* Start recording again (pick up where we left off)
    	 */
        this.state.recorder.record();
        this.setState({
            recording: true
        })
        console.log('continuing');
    },
    
    reRecord(index) {
    	/* Start recording an item again
    	 */
        this.state.recorder.record();
        this.setState({
            active: index,
            recording: 'rerecord'
        });
        console.log("Re-recording audio with index " + index.toString() + "...");
    },
    
    stopReRecord () {
    	/* Finish recording the item again
    	 */
        this.cutRecording();
        this.setState({
            active: this.state.audioURLs.length,
            recording: false
        })
        console.log(this.state.audioURLs);
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
            else if (this.state.active < this.props.recordingWords.length) {
                recordLabel = "Continue recording";
                recFunction = this.continueRecording; 
            }
            else {
                recordLabel = "Re-record all";
                recFunction = this.startRecording;
            }
        }
        else if (this.state.recording === true) {
            if (this.state.active === this.props.recordingWords.length -1) {
                recordLabel = "Done";
                recFunction = this.stopRecording;
            }
            else {
                recordLabel = "Next";
                recFunction = this.nextRecording; 
            }
        }
        // this is when re-recording
        else if (this.state.recording === 'rerecord') {
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
        var submitDisabled = (this.state.audioURLs.length === this.props.recordingWords.length && !this.state.recording) ? false : true;
        
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
                    {this.props.recordingWords.map(function(c, index) {
                        var recWordId = 'recWord-' + index.toString();
                        var recWordIdLi = recWordId + '-li';
                        var recWordIdAudio = recWordId + '-audio';
            
                        var backgroundColor = this.state.recording && (index === this.state.active) ? 'yellow' : 'white';
            
                        var playbackButtonDisabled = (index < this.state.active && this.state.recording === false) ? false : true;
                        var reRecordButtonDisabled = (index < this.state.active && this.state.recording === false) || (this.state.recording === 'rerecord') ? false: true;
            
                        var reRecordLabel = (this.state.recording === 'rerecord' && index === this.state.active) ? 'Done re-recording' : 'Re-record';
                        var reRecordFunc = this.state.recording === 'rerecord' ? this.stopReRecord : this.reRecord.bind(this, index);
            
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
                <button type="button" disabled={submitDisabled}  onClick={this.props.submitAudio.bind(this, "Hello")}>Submit!</button> 
                {/*May want to make the Submit button type="submit"*/}
            </div>
        )
    }
});

export default RecordPage;

