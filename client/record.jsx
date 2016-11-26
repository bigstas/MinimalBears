import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Link } from 'react-router'
import update from 'react-addons-update'
// For tooltip details and options, see http://wwayne.com/react-tooltip/ and https://www.npmjs.com/package/react-tooltip
import ReactTooltip from 'react-tooltip'


// Note that we use 'meteor/maxencecornet:audio-recorder',
// which defines window.Recorder for us

// navigator.mediaDevices.getUserMedia compatibility with different browsers
// https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia

// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {}
}

// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function(constraints) {

    // First get hold of the legacy getUserMedia, if present
    var getUserMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia)

    // Some browsers just don't implement it - return a rejected promise with an error
    // to keep a consistent interface
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
    }

    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    return new Promise(function(resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject)
    })
  }
}

// Cross-browser AudioContext and URL
// https://developer.mozilla.org/en/docs/Web/API/AudioContext
// https://developer.mozilla.org/en/docs/Web/API/Window/URL

const AudioContext = window.AudioContext || window.webkitAudioContext
const URL = window.URL || window.webkitURL


StartButton = React.createClass({
    /* The main button.
     * Press to start recording and go through all of the words. This puts the page in record mode.
     * Press while recording to move on to the next word.
     * On the final word, this button will end the recording of the words and place the page in done mode.
     */
    
    render() {
        // display props
        let disabled = !((this.props.mode === "wait") || (this.props.mode === "record") || (this.props.mode === "done"))
        let className = (disabled ? 'startButton transparent' : 'startButton startButtonEnabled')
        let label = "Record" // default value
        
        // callback arguments
        let stop = (this.props.mode === "record")
        let start = true     // default value
        let mode  = "record" // default value
        let next
        
        if (this.props.mode === "wait") { 
            // start recording or continue where we left off
            next = this.props.next 
        } 
        else if (this.props.mode === "record") {
            // go on to the next item
            next = this.props.next +1
            if (this.props.next === this.props.max) {
                // we're already on the last item
                start = false
                mode  = "done"
                label = "Done"
            } else {
                // we're somewhere in the middle
                label = "Next"
            }
        } 
        else if (this.props.mode === "done") {
            // we've finished recording, and now starting recording from scratch
            next = 0
            label = "Re-record all"
        }
        
        // for this button, focus and next are the same
        let focus = next
        return (
            <div>
                <div className={className}
                    data-tip data-for='startTooltip' data-delay-show='1000'
                    onClick={disabled ? null : () => this.props.callback( stop, start, mode, focus, next )}>
                        {label}
                </div>
                <ReactTooltip id='startTooltip' place="bottom" type="light" effect="solid" multiline={true}>
                    <p style={{textAlign:'center'}}>Record all the words,<br />one after the other.</p>
                </ReactTooltip>
            </div>
        )
    }
})

StopButton = React.createClass({
    /* Press this button to stop the recording at the current word.
     * Currently configured so that the current word's recording *will* be saved, and focus will move on to the next word.
     * Available in record mode. Sends page to wait mode or done mode (depending on whether everything has been recorded or not).
     */
    
    render() {
        // display props
        let disabled = (this.props.mode !== "record")
        let className = (disabled ? 'stopButton transparent' : 'stopButton stopButtonEnabled')
        
        // callback arguments
        let stop = true
        let start = false
        let mode  = "wait" // default value
        let next  = this.props.next +1
        let focus = next // for this button, focus and next are the same
        
        if (this.props.next === this.props.max) {
            mode = "done"
        }
        
        return (
            <div>
                <div className={className} data-tip='Click here to stop recording.' data-delay-show='1000' onClick={disabled ? null : ()=>this.props.callback( stop, start, mode, focus, next )}>
                    <img className="stopSymbol" src={"stop.png"} />
                </div>
                <ReactTooltip place="bottom" type="light" effect="solid" />
            </div>
        )
    }
})

PlayAllButton = React.createClass({
    /* Press this button to play back all the audio.
     * Available in done mode (i.e. when all the words have been recorded).
    */
    
    render() {
        // display props
        let disabled = !(this.props.recordedSoFar > 0 && (this.props.mode === "wait" || this.props.mode === "done" ))
        let className = (disabled ? 'playAllButton transparent' : 'playAllButton playAllButtonEnabled')
        let label = "Playback All"
        
        // callback arguments - ALL UNUSED at the moment
        //let stop = false
        //let start = false
        //let mode  = "playbackAll"
        //let next  = null
        //let focus = next // for this button, focus and next are the same
        
        return (
            <div>
                <div className={className}
                    data-tip='This plays all the audio.'
                    onClick={disabled ? null : this.props.playAllFunction}>
                        {label}
                </div>
                <ReactTooltip place="bottom" type="light" effect="solid" />
            </div>
        )
    }
})

SubmitButton = React.createClass({
    /* Press this button to submit the audio to the database. 
     * Enabled when in done mode (i.e. when all the words have been recorded).
     * TO DO: properly write the submitAudio function.
     */
    render() {
        let disabled = !(this.props.mode === "done")
        let className = (disabled ? 'submitButton transparent' : 'submitButton submitButtonEnabled')
        return (
            <div>
                <div className={className}
                    data-tip='If you are ready, send all the audio to the database.'
                    onClick={disabled ? null : this.props.submitAudio}>
                        Submit!
                </div>
                <ReactTooltip place="bottom" type="light" effect="solid" />
            </div>
        )
    }
})

TopRow = React.createClass({
    /* The top row of buttons.
     * Includes: start, stop, play all, submit.
    */
    render() {
        return (
            <div id='topRow'>
                <StartButton   mode={this.props.mode} callback={this.props.callback} next={this.props.next} max={this.props.max} />
                <StopButton    mode={this.props.mode} callback={this.props.callback} next={this.props.next} max={this.props.max} />
                <PlayAllButton mode={this.props.mode} playAllFunction={this.props.playbackAll} recordedSoFar={this.props.recordedSoFar} />
                <SubmitButton  mode={this.props.mode} submitAudio={this.props.submitAudio} />
            </div>
        )
    }
})

ReRecord = React.createClass({
    /* Button for re-recording a single word.
     * Available when there is no recording going on at the moment (wait mode or done mode) and this word has alreay been recorded (this.props.srcExists === true) or if the word in question is being re-recorded (active === true).
     * Returns to the mode we started from when you're done recording (i.e. either wait mode or done mode).
     */
    render() {
        // the button is "active" if it is currently re-recording
        let active = ((this.props.mode === "reRecordSingleToWait" || this.props.mode === "reRecordSingleToDone") && this.props.focused)
        let disabled = !(this.props.srcExists && 
                            (this.props.mode === "wait" || this.props.mode === "done" || active)
                         )
        let icon = "record.png" // icon: red circle - press to record
        let className = (disabled ? 'reRecord transparent' : 'reRecord reRecordEnabled')
        let tooltip = "Re-record"
        
        // callback arguments - default values, i.e. when not currently re-recording
        let stop = false
        let start = true
        let focus = this.props.index
        let next = focus
        let mode = "reRecordSingleToWait"
        if (this.props.mode === "done") { mode = "reRecordSingleToDone" }
        
        // arguments when this row is being re-recorded
        if (active) {
            icon = "done.png" // icon: green tick - press to finish the recording
            stop  = true
            start = false
            className = 'reRecord reRecordActive'
            // Go back to previous mode, either wait mode or done mode, as encoded in the prop
            if      (this.props.mode === "reRecordSingleToWait") { mode = "wait" }
            else if (this.props.mode === "reRecordSingleToDone") { mode = "done" }
            else {
                // throw an error! (better than this one)
                console.log("incorrect mode passed: current mode is " + this.props.mode)
            }
        }
        
        return (
            <div style={{display: 'inline-block'}}>
                <div className={className} key={this.props.index} data-tip={tooltip} data-delay-show='1000' onClick={disabled ? null : ()=>this.props.callback( stop, start, mode, focus, next ) }>
                    <img className="recordSymbol" src={icon} />
                </div>
                <ReactTooltip place="bottom" type="light" effect="solid" />
            </div>
        )
    }
})

PlaybackOne = React.createClass({
    /* Button for playing back a single word.
     *
     */
    render() {
        let disabled = !(this.props.srcExists && (this.props.mode === "wait" || this.props.mode === "done"))
        let className = (disabled ? 'playbackOne transparent' : 'playbackOne playbackOneEnabled')
        
        // callback arguments - ALL UNUSED at the moment
        //let stop = false  --- unused
        //let start = false --- unused
        //let mode = "playback" --- unused
        //let focus = this.props.index  --- unused
        //let next = focus  --- unused
        
        return (
            <div style={{display: 'inline-block'}}>
                <div className={className} key={this.props.index} data-tip={'Play back'} data-delay-show='1000' onClick={disabled ? null : ()=>this.props.playbackFunction(this.props.index, false)}>
                    <img className="playSymbol" src="play.png" />
                </div>
                <ReactTooltip place="bottom" type="light" effect="solid" />
            </div>
        )
    }
})

WordRow = React.createClass({
    /* A row below the top row. There is the same number of these as there are words to record.
     * Includes: re-record, playback, word. All inside a div that lights up on rollover, or when focused.
     */
    render() {
        let rowClassName = "wordRow"
        if (this.props.focused === true) { rowClassName = "wordRowFocused"}
        
        return (
            <div className={rowClassName}>
                <ReRecord    index={this.props.index} mode={this.props.mode} srcExists={this.props.srcExists} callback={this.props.callback} focused={this.props.focused} />
                <PlaybackOne index={this.props.index} mode={this.props.mode} srcExists={this.props.srcExists} playbackFunction={this.props.playbackFunction}  />
                <p style={{display: "inline", cursor: "default"}}>{this.props.word}</p>
            </div>
        )
    }
})


RecordPage = React.createClass({
    
    getInitialState () {
        return {
            audioURLs: [],  // List of the recorded audio
            mode: "wait",   // wait, record, done, reRecordSingleToWait, reRecordSingleToDone, playback, playbackAll
            focus: 0,  // which item is under focus
            next: 0    // the first item that is not yet recorded
        }
    },
    
    componentWillMount() {
        // Set up audio context (which contains audio nodes)
        this.audioContext = new AudioContext()
        // Find the microphone (note, using a Promise)
        navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(
            stream => {
                // Create the audio node for the microphone
                this.source = this.audioContext.createMediaStreamSource(stream)
                // Create the recorder node (connected to the audio node)
                this.recorder = new Recorder(this.source)
            })
    },
    
    cutRecording () {
        /* Stop the recorder, save the data with a URL, clear the recorder
         */
        let currentIndex = this.state.focus  // In case of asynchronous changes
        this.recorder.stop()
        this.recorder.exportWAV(blob => this.makeUrl(currentIndex, blob))
        this.recorder.clear()
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
        })
    },
    
    recordCallback (stop, start, mode, focus, next) {
        /* This is a callback function for buttons that control recording.
         * stop  : stop recording and save the recording
         * start : start a new recording
         * mode  : a new value for this.state.mode
         * focus : a new value for this.state.active
         * next  : a new value for this.state.next
         */
        if (stop)  { this.cutRecording() }
        if (start) { this.recorder.record() }
        let stateUpdate = {}
        if (mode  !== null) { stateUpdate.mode  = mode  }
        if (focus !== null) { stateUpdate.focus = focus }
        if (next  !== null) { stateUpdate.next  = next  }
        this.setState( stateUpdate )
        console.log(`stop: ${stop}
start: ${start}
mode: ${mode}
focus: ${focus}
next: ${next}`)
    },
    
    playbackAll() {
        /* Playback all recorded audio
         */
        // Start playing the first audio file
        // The state will make the event listeners play the rest
        this.playback(0, true)
    },
    
    playback(index, playAllAudio) {
        // Plays the audio element with a given index.
        if (this.state.audioURLs[index]) { 
            this.setState({ focus: index })  // highlight the word currently playing
            if (playAllAudio) {
                this.setState({ mode: "playbackAll" })
            } else {
                this.setState({ mode: "playback"})
            }
            // debug logs
            console.log("playback index is " + index.toString())
            console.log(this.state.audioURLs[index])
            // play audio
            this.audioElements[index].play()
        } else {
            console.log("audio URL out of range: " + index.toString())
        }
    },
    
    render() {
        return (
            <div className='panel' id='record'>
                <TopRow next={this.state.next} 
                        max={this.props.recordingWords.length -1} 
                        mode={this.state.mode} 
                        callback={this.recordCallback} 
                        playbackAll={this.playbackAll} 
                        submitAudio={this.props.submitAudio} 
                        recordedSoFar={this.state.audioURLs.length} />
                <div id="wordList">
                    {this.props.recordingWords.map(
                        function(c, index) {
                            let audioRef = "audio" + index.toString()
                            return(
                                <div>
                                    <WordRow index={index} mode={this.state.mode} callback={this.recordCallback} playbackFunction={this.playback} word={c} focused={index === this.state.focus} srcExists={!!this.state.audioURLs[index]} />
                                    <audio ref={audioRef} controls={false} muted={false} src={this.state.audioURLs[index]} />
                                </div>
                            )
                        }, this)
                    }
                </div>
            </div>
        )
    },
    
    componentDidMount() {
        /* add event listeners to all the <audio> elements
         * they listen for when the audio finishes playing ("ended")
         * we use this to make the audio carry on playing in playbackAll mode
         * Also, create a list of <audio> elements for future reference
         */
        console.log(this.refs)
        this.audioElements = this.props.recordingWords.map(function(c, index) {
            let myRef = "audio" + index.toString()
            let element = this.refs[myRef]
            console.log('adding listener to index ' + index.toString())
            let nextIndex = index +1
            element.addEventListener("ended",  // trigger when playing ends
                () => {
                    console.log('inside handler')
                    if (this.state.mode === 'playbackAll') {
                        console.log('playbackAll')
                        if (nextIndex < this.state.audioURLs.length) {
                            this.playback(nextIndex, true)  // play the next file
                        } else { // reset the state
                            let done = (this.state.audioURLs.length === this.props.recordingWords.length)
                            this.setState({mode: done ? "done" : "wait"})
                        }
                    }
                    else {
                        // repeated code - could be structured better
                        let done = (this.state.audioURLs.length === this.props.recordingWords.length)
                        this.setState({mode: done ? "done" : "wait"})
                    }
                })
            return element
        }, this)
    }
})


WrappedRecordPage = React.createClass({
    render() {
        return <RecordPage recordingWords={["youth in Asia", "euthanasia", "a mission", "omission", "emission"]} submitAudio={() => alert("We're supposed to do something here!")} /> 
    }
})


export default WrappedRecordPage

