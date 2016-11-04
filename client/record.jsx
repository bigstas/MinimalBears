import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';
import update from 'react-addons-update';

// Note that we use 'meteor/maxencecornet:audio-recorder',
// which defines window.Recorder for us

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


StartButton = React.createClass({
    /* The first button.
    */
    
    render() {
        // display props
        let disabled = !((this.props.mode === "wait") || (this.props.mode === "record") || (this.props.mode === "done"));
        let label = "Record"; // default value
        
        // callback arguments
        let stop = (this.props.mode === "record");
        let start = true;     // default value
        let mode  = "record"; // default value
        let next;
        
        if (this.props.mode === "wait") { 
            // start recording or continue where we left off
            next = this.props.next; 
        } 
        else if (this.props.mode === "record") {
            // go on to the next item
            next = this.props.next +1;
            if (this.props.next === this.props.max) {
                // we're already on the last item
                start = false;
                mode  = "done";
                label = "Done";
            } else {
                // we're somewhere in the middle
                label = "Next";
            }
        } 
        else if (this.props.mode === "done") {
            // we've finished recording, and now starting recording from scratch
            next = 0;
            label = "Re-record all";
        }
        
        // for this button, focus and next are the same
        let focus = next;
        return (
            <button type="button" 
                disabled={disabled}
                onClick={() => this.props.callback( stop, start, mode, focus, next )}>
                    {label}
            </button> 
        )
    }
});

StopButton = React.createClass({
    /* The second button.
    */
    
    render() {
        // display props
        let disabled = (this.props.mode !== "record");
        let label = "Stop";
        
        // callback arguments
        let stop = true;
        let start = false;
        let mode  = "wait"; // default value
        let next  = this.props.next +1;
        let focus = next; // for this button, focus and next are the same
        
        if (this.props.next === this.props.max) {
            mode = "done";
        }
        
        return (
            <button type="button" 
                disabled={disabled}
                onClick={() => this.props.callback( stop, start, mode, focus, next )}>
                    {label}
            </button> 
        )
    }
});

PlayAllButton = React.createClass({
    /* The third button.
    */
    
    render() {
        // display props
        let disabled = (this.props.mode !== "done");
        let label = "Playback All";
        
        // callback arguments
        let stop = false;
        let start = false;
        let mode  = "playbackAll";
        let next  = null;
        let focus = next; // for this button, focus and next are the same
        
        return (
            <button type="button" 
                disabled={disabled}
                onClick={this.props.playAllFunction}>
                    {label}
            </button> 
        )
    }
});

SubmitButton = React.createClass({
    /* The fourth button.
    */
    render() {
        return (
            <button type="button" 
                disabled={this.props.mode !== "done"}
                onClick={this.props.submitAudio}>
                    Submit!
            </button> 
        )
    }
});

TopRow = React.createClass({
    /* The top row of buttons.
     * Includes: start, stop, play all, submit.
    */
    render() {
        return (
            <div>
                <StartButton   mode={this.props.mode} callback={this.props.callback} next={this.props.next} max={this.props.max} />
                <StopButton    mode={this.props.mode} callback={this.props.callback} next={this.props.next} max={this.props.max} />
                <PlayAllButton mode={this.props.mode} playAllFunction={this.props.callback} />
                <SubmitButton  mode={this.props.mode} submitAudio={this.props.submitAudio} />
            </div>
        )
    }
});

ReRecord = React.createClass({
    /* Button for re-recording a single word.
     * Available when there is no recording going on at the moment (wait mode or done mode) and this word has alreay been recorded (this.props.srcExists === true) or if the word in question is being re-recorded (active === true).
     */
    render() {
        // the button is "active" if it is currently re-recording
        let active = (this.props.mode === "reRecordSingle" && this.props.focused);
        let disabled = !(this.props.srcExists && 
                            (this.props.mode === "wait" || this.props.mode === "done" || active)
                         );
        let label = "Record"; // default value
        
        // callback arguments - default values, i.e. when not currently re-recording
        let stop = false;
        let start = true;
        let mode = "reRecordSingle";
        let focus = this.props.index;
        let next = focus;
        
        // arguments when this row is being re-recorded
        if (active) {
            label = "Done";
            stop  = true;
            start = false;
            mode  = "wait"; // TO DO: actually, this should sometimes go to "done", if the mode was "done" previously
        }
        
        return (
            <button type="button" 
                disabled={disabled}
                onClick={() => this.props.callback( stop, start, mode, focus, next )}>
                    {label}
            </button> 
        )
    }
});

PlaybackOne = React.createClass({
    /* Button for playing back a single word.
     *
     */
    render() {
        let disabled = !(this.props.srcExists && (this.props.mode === "wait" || this.props.mode === "done"));
        
        // callback arguments
        let stop = false;
        let start = false;
        let mode = "playback";
        let focus = this.props.index;
        let next = focus;
        
        return (
            <button type="button" 
                disabled={disabled}
                onClick={() => this.props.playbackFunction( this.props.index )}>
                    Listen
            </button> 
        )
    }
});

WordRow = React.createClass({
    /* A row below the top row. There is the same number of these as there are words to record.
     * Includes: re-record, playback, word. All inside a div that lights up on rollover, or when focused.
     */
    render() {
        let rowClassName = "wordRow";
        if (this.props.focused === true) { rowClassName = "wordRowFocused"}
        
        return (
            <div className={rowClassName}>
                <ReRecord    index={this.props.index} mode={this.props.mode} srcExists={this.props.srcExists} callback={this.props.callback} focused={this.props.focused} />
                <PlaybackOne index={this.props.index} mode={this.props.mode} srcExists={this.props.srcExists} playbackFunction={this.props.playbackFunction}  />
                <p style={{display: "inline"}}>{this.props.word}</p>
            </div>
        )
    }
});


RecordPage = React.createClass({
    
    getInitialState () {
        return {
            audioURLs: [],  // List of the recorded audio
            mode: "wait",   // wait, record, done, reRecordSingle, playback, playbackAll
            focus: 0,  // which item is under focus
            next: 0    // the first item that is not yet recorded
        }
    },
    
    componentWillMount() {
        // Set up audio context (which contains audio nodes)
        this.audioContext = new AudioContext();
        // Find the microphone (note, using a Promise)
        navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(
            stream => {
                // Create the audio node for the microphone
                this.source = this.audioContext.createMediaStreamSource(stream)
                // Create the recorder node (connected to the audio node)
                this.recorder = new Recorder(this.source)
            });
    },
    
    cutRecording () {
        /* Stop the recorder, save the data with a URL, clear the recorder
         */
        let currentIndex = this.state.focus  // In case of asynchronous changes
        this.recorder.stop();
        this.recorder.exportWAV(blob => this.makeUrl(currentIndex, blob));
        this.recorder.clear();
    },
    
    makeUrl (index, blob) {
        /* Function passed to exportWav (above)
         * Create a URL for the blob, and put it in this.state.audioURLs[index]
         */
        url = URL.createObjectURL(blob)
        console.log('new url:')
        console.log(url)
        this.setState({
            audioURLs: update(this.state.audioURLs, {[index]: {$set: url }})  // TODO 'update' is now a legacy function
        });
    },
    
    recordCallback (stop, start, mode, focus, next) {
        /* This is a callback function for buttons that control recording.
         * stop  : stop recording and save the recording
         * start : start a new recording
         * mode  : a new value for this.state.mode
         * focus : a new value for this.state.active
         * next  : a new value for this.state.next
         */
        if (stop)  { this.cutRecording(); }
        if (start) { this.recorder.record(); }
        let stateUpdate = {};
        if (mode  !== null) { stateUpdate.mode  = mode;  }
        if (focus !== null) { stateUpdate.focus = focus; }
        if (next  !== null) { stateUpdate.next  = next;  }
        this.setState( stateUpdate );
        console.log(`stop: ${stop}
start: ${start}
mode: ${mode}
focus: ${focus}
next: ${next}`);
    },
    
    playbackAll() {
        /* Playback all recorded audio
         */
        this.setState({
            mode: "playbackAll"
        });
        
        // Start playing the first audio file
        // The state will make the event listeners play the rest
        this.playback(0)
    },
    
    playback(index) {
        // Plays the audio element with a given index.
        if (this.state.audioURLs[index]) {
            // debug logs
            console.log("playback index is " + index.toString());
            console.log(this.state.audioURLs[index])
            // play audio
            this.audioElements[index].play();
        } else {
            console.log("audio URL out of range: " + index.toString());
        }
    },
    
    submitAudio() {
        alert("We're supposed to do something here!");
    },
    
    render() {
        return (
            <div id="record">
                <TopRow next={this.state.next} max={this.props.recordingWords.length -1} mode={this.state.mode} callback={this.recordCallback} playbackAll={this.playbackAll} submitAudio={this.submitAudio} />
                {this.props.recordingWords.map(
                    function(c, index) {
                        let audioRef = "audio" + index.toString();
                        return(
                            <div>
                                <WordRow index={index} mode={this.state.mode} callback={this.recordCallback} playbackFunction={this.playback} word={c} focused={index === this.state.focus} srcExists={!!this.state.audioURLs[index]} />
                                <audio ref={audioRef} controls={false} muted={false} src={this.state.audioURLs[index]} />
                            </div>
                        )
                    }, this)
                }
            </div>
        )
    },
    
    componentDidMount() {
        /* add event listeners to all the <audio> elements
         * they listen for when the audio finishes playing ("ended")
         * we use this to make the audio carry on playing in playbackAll mode
         * Also, create a list of <audio> elements for future reference
         */
        console.log(this.refs);
        this.audioElements = this.props.recordingWords.map(function(c, index) {
            let myRef = "audio" + index.toString();
            let element = this.refs[myRef];
            console.log('adding listener to index ' + index.toString());
            let nextIndex = index +1;
            element.addEventListener("ended",  // trigger when playing ends
                () => {
                    console.log('inside handler')
                    if (this.state.mode === 'playbackAll') {
                        console.log('playbackAll')
                        if (nextIndex < this.state.audioURLs.length) {
                            this.playback(nextIndex)  // play the next file
                        } else {
                            this.setState({mode: "wait"})  // reset the state
                        }
                    }
                });
            return element;
        }, this);
    }
});

export default RecordPage;

