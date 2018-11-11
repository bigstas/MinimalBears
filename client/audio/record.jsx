/* Licenses:
submittedAudio.wav originally called 320654__rhodesmas__level-up-02.wav, taken from user "rhodesmas" on freesound.org, under Creative Commons Attribution 3.0 Unported Licence; no changes have been made
*/
import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import { Link, withRouter } from 'react-router'
import update from 'immutability-helper'
// For tooltip details and options, see http://wwayne.com/react-tooltip/ and https://www.npmjs.com/package/react-tooltip
import ReactTooltip from 'react-tooltip'
// data mutations and queries
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import LoadingPage from '../auxiliary/loading'
import Translate from 'react-translate-component'
import counterpart from 'counterpart'
import Tutorial from '../auxiliary/tutorials'
import { PreRecord, RecordSelector, NoRecordPage } from './norecord'

    
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
const AudioContext = window.AudioContext || window.webkitAudioContext
const URL = window.URL || window.webkitURL


function StartButton(props) {
    /* The main button.
     * Press to start recording and go through all of the words. This puts the page in record mode.
     * Press while recording to move on to the next word.
     * On the final word, this button will end the recording of the words and place the page in done mode.
     * If all the words have been recorded, this button will clear all the recordings and restart recording from the beginning.
     * props: mode, next, max, callback
     */
     
    // display props
    const disabled = !((props.mode === "wait") || (props.mode === "record") || (props.mode === "done"))
    let className = (disabled ? 'topRowButton transparent' : 'topRowButton topRowButtonEnabled')
    let label = "record.startLabel.record" // default value
    
    // callback arguments
    const stop = (props.mode === "record")
    let start = true     // default value
    let mode  = "record" // default value
    let next
    let clearAll = false // default value
    
    if (props.mode === "wait") { 
        // start recording or continue where we left off
        next = props.next 
    } 
    else if (props.mode === "record") {
        // go on to the next item
        next = props.next +1
        if (props.next === props.max) {
            // we're already on the last item
            start = false
            mode  = "done"
            label = "record.startLabel.done"
        } else {
            // we're somewhere in the middle
            label = "record.startLabel.next"
        }
    } 
    else if (props.mode === "done") {
        // we've finished recording, and now starting recording from scratch
        next = 0
        label = "record.startLabel.reRecordAll"
        clearAll = true
    }
    
    // for this button, focus and next are the same
    const focus = next
    return (
        <div>
            <div className={className} id='startButton'
                data-tip data-for='startTooltip' data-delay-show='1000'
                onClick={disabled ? null : () => props.callback( stop, start, mode, focus, next, clearAll )}>
                    <Translate content={label} />
            </div>
            <ReactTooltip id='startTooltip' place="bottom" type="light" effect="solid" multiline={true}>
                <p style={{textAlign:'center'}}><Translate content="record.startLabel.tooltip1" /><br /><Translate content="record.startLabel.tooltip2" /></p>
            </ReactTooltip>
        </div>
    )
}

function StopButton(props) {
    /* Press this button to stop the recording at the current word.
     * Currently configured so that the current word's recording *will* be saved, and focus will move on to the next word.
     * Available in record mode. Sends page to wait mode or done mode (depending on whether everything has been recorded or not).
     * props: mode, next, max, callback
     */
    
    // display props
    const disabled = (props.mode !== "record")
    const className = (disabled ? 'topRowButton transparent' : 'topRowButton topRowButtonEnabled')
    
    // callback arguments
    const stop = true     // always
    const start = false   // always
    let mode  = "wait"  // default value
    const next  = props.next +1
    const focus = next // for this button, focus and next are the same
    
    if (props.next === props.max) {
        mode = "done"
    }
    
    return (
        <div>
            <div className={className} id='stopIc' data-tip data-for='stopTooltip' data-delay-show='500' onClick={disabled ? null : ()=>props.callback( stop, start, mode, focus, next )}>
                <img className='buttonIcon' id='stopIcon' src={'stop.png'} />
            </div>
            <ReactTooltip id='stopTooltip' place="bottom" type="light" effect="solid">
                <Translate content="record.stopTooltip" component="p" />
            </ReactTooltip>
        </div>
    )
}

function PlayAllButton(props) {
    /* Press this button to play back all the audio.
     * Available in done mode (i.e. when all the words have been recorded).
     * props: recordedSoFar, mode, playAllFunction
     */
    
    // display props
    const disabled = !(props.recordedSoFar > 0 && (props.mode === "wait" || props.mode === "done" ))
    const className = (disabled ? 'topRowButton transparent' : 'topRowButton topRowButtonEnabled')
    
    return (
        <div>
            <div className={className} id='playAllButton'
                data-tip data-for='playAllTooltip' data-delay-show='500'
                onClick={disabled ? null : props.playAllFunction}>
                    <Translate content="record.playbackAll" />
            </div>
            <ReactTooltip id='playAllTooltip' place="bottom" type="light" effect="solid">
                <Translate content="record.playbackAllTooltip" component="p" />
            </ReactTooltip>
        </div>
    )
}

function SubmitButton(props) {
    /* Press this button to submit the audio to the database. 
     * Enabled when in done mode (i.e. when all the words have been recorded).
     * props: mode, submitAudio
     */
    const disabled = !(props.mode === "done")
    const className = (disabled ? 'topRowButton transparent' : 'topRowButton topRowButtonEnabled animated rubberBand')
    return (
        <div>
            <div className={className} id='submitButton'
                data-tip data-for='submitTooltip' data-delay-show='500'
                onClick={disabled ? null : props.submitAudio}>
                    <Translate content="record.submit" />
            </div>
            <ReactTooltip id='submitTooltip' place="bottom" type="light" effect="solid">
                <Translate content="record.submitTooltip" component="p" />
            </ReactTooltip>
        </div>
    )
}

function TutorialButton(props) {
    /* Press this button to start the tutorial. */
    return (
        <div className='topRowButton topRowButtonEnabled' id='tutorialButton' onClick={props.restartTutorial}>?</div>
    )
}

function TopRow(props) {
    /* The top row of buttons.
     * Includes: start, stop, play all, submit.
     * props: mode, callback, next, max, playbackAll, recordedSoFar, submitAudio
     */
    return (
        <div id='topRow'>
            <StartButton   mode={props.mode} callback={props.callback} next={props.next} max={props.max} />
            <StopButton    mode={props.mode} callback={props.callback} next={props.next} max={props.max} />
            <PlayAllButton mode={props.mode} playAllFunction={props.playbackAll} recordedSoFar={props.recordedSoFar} />
            <SubmitButton  mode={props.mode} submitAudio={props.submitAudio} />
            <TutorialButton restartTutorial={props.restartTutorial} />
        </div>
    )
}

function ReRecord(props) {
    /* Button for re-recording a single word.
     * Available when there is no recording going on at the moment (wait mode or done mode) and this word has alreay been recorded (props.srcExists === true);
     * or if the word in question is being re-recorded (active === true), in which case you press this button to stop the re-recording.
     * Returns to the mode we started from when you're done recording (i.e. either wait mode or done mode).
     * props: mode, focused, srcExists, index, next, 
     */
    
    // the button is "active" if it is currently re-recording
    let active = ((props.mode === "reRecordSingleToWait" || props.mode === "reRecordSingleToDone") && props.focused)
    let disabled = !(props.srcExists && 
                        (props.mode === "wait" || props.mode === "done" || active)
                     )
    let icon = "record.png" // icon: red circle - press to record
    let className = (disabled ? 'wordRowButton transparent' : 'wordRowButton wordRowButtonEnabled')
    let tooltipId = 'rerecordTooltip' + props.index.toString()
    
    // callback arguments - default values, i.e. when not currently re-recording
    let stop  = false
    let start = true
    let focus = props.index
    let next  = null  // next shouldn't change
    let mode  = "reRecordSingleToWait"
    if (props.mode === "done") { mode = "reRecordSingleToDone" }
    
    // arguments when this row is being re-recorded
    if (active) {
        icon = "done.png" // icon: green tick - press to finish the recording
        stop  = true
        start = false
        focus = props.next
        className = 'wordRowButton reRecordActive'
        // Go back to previous mode, either wait mode or done mode, as encoded in the prop
        if      (props.mode === "reRecordSingleToWait") { mode = "wait" }
        else if (props.mode === "reRecordSingleToDone") { mode = "done" }
        else {
            // throw an error! (better than this one)
            console.log("incorrect mode passed: current mode is " + props.mode)
        }
    }
    
    // The first in the list needs to be highlighted for the tutorial
    let id
    if (props.index === 0) { id = "firstReRecordWord" }
    else { id = null }
    
    return (
        <div style={{display: 'inline-block'}}>
            <div className={className} id={id} key={props.index} data-tip data-for={tooltipId} data-delay-show='500' onClick={disabled ? null : ()=>props.callback( stop, start, mode, focus, next ) }>
                <img className='buttonIcon' id='recordIcon' src={icon} />
            </div>
            <ReactTooltip id={tooltipId} place="bottom" type="light" effect="solid">
                <Translate content="record.reRecordTooltip" component="p" />
            </ReactTooltip>
        </div>
    )
}

function PlaybackOne(props) {
    /* Button for playing back a single word. Can only use this if there is audio available for this index (props.srcExists === true).
     * props: srcExists, mode, index
     */
    const disabled = !(props.srcExists && (props.mode === "wait" || props.mode === "done"))
    const className = (disabled ? 'wordRowButton transparent' : 'wordRowButton wordRowButtonEnabled')
    const tooltipId = 'playbackTooltip' + props.index.toString()
    
    // The first in the list needs to be highlighted for the tutorial
    let id
    if (props.index === 0) { id="firstPlaybackWord" }
    else { id = null }
    
    return (
        <div style={{display: 'inline-block'}}>
            <div className={className} id={id} key={props.index} data-tip data-for={tooltipId} data-delay-show='500' onClick={disabled ? null : ()=>props.playbackFunction(props.index, false)}>
                <img className='buttonIcon' id='playIcon' src='play.png' />
            </div>
            <ReactTooltip id={tooltipId} place="bottom" type="light" effect="solid">
                <Translate content="record.playbackTooltip" component="p" />
            </ReactTooltip>
        </div>
    )
}

function WordRow(props) {
    /* A row below the top row. There is the same number of these as there are words to record.
     * Includes: re-record, playback, word. All inside a div that lights up on rollover, or when focused.
     * props: focused, index, mode, next, srcExists, callback, playbackFunction, word
     */
    const rowClassName = props.focused === true ? "wordRowFocused" : "wordRow"
    
    // The first in the list needs to be highlighted for the tutorial
    let id
    if (props.index === 0) { id="firstWord" }
    else { id = null }
    
    return (
        <div id={id} className={rowClassName}>
            <ReRecord index={props.index} mode={props.mode} next={props.next} srcExists={props.srcExists} callback={props.callback} focused={props.focused} />
            <PlaybackOne index={props.index} mode={props.mode} srcExists={props.srcExists} playbackFunction={props.playbackFunction}  />
            <p style={{display: "inline", cursor: "default"}}>{props.word}</p>
        </div>
    )
}

class RecordPage extends React.Component {
    /* A React element for the entire page body (below the Nav).
     * props: recordingWords, submitAudio
     */
    constructor(props) {
    	super(props)
    	this.state = {
            audioURLs: [],  // List of the recorded audio (as object URLs)
            audioBlobs: [],  // List of the recorded audio (as blobs)
            mode: "wait",   // wait, record, done, reRecordSingleToWait, reRecordSingleToDone, playback, playbackAll
            focus: 0,  // which item is under focus
            next: 0    // the first item that is not yet recorded
    	}
    }
    
    componentWillMount() {
        // Set up audio context (which contains audio nodes)
        this.audioContext = new AudioContext()
        // Find the microphone (note, using a Promise)
        navigator.mediaDevices.getUserMedia({audio: true, video: false})
        .then(stream => {
            // Create the audio node for the microphone
            this.source = this.audioContext.createMediaStreamSource(stream)
            // Create the recorder node (connected to the audio node)
            this.recorder = new Recorder(this.source)
        })
    }
    
    cutRecording () {
        /* Stop the recorder, save the data with a URL, clear the recorder
         */
        const currentIndex = this.state.focus  // In case of asynchronous changes
        this.recorder.stop()
        this.recorder.exportWAV(blob => this.makeUrl(currentIndex, blob))
        this.recorder.clear()
    }
    
    makeUrl (index, blob) {
        /* Function passed to exportWav (above)
         * Create a URL for the blob, and put it in this.state.audioURLs[index]
         */
        const url = URL.createObjectURL(blob)
        console.log('new url:')
        console.log(url)
        this.setState({
            audioURLs: update(this.state.audioURLs, {[index]: {$set: url }}),
            audioBlobs: update(this.state.audioBlobs, {[index]: {$set: blob }})
        })
    }
    
    recordCallback (stop, start, mode, focus, next, clearAll=false) {
        /* This is a callback function for buttons that control recording.
         * stop  : stop recording and save the recording
         * start : start a new recording
         * mode  : a new value for this.state.mode
         * focus : a new value for this.state.active
         * next  : a new value for this.state.next
         * clearAll : whether we should clear all of the audioURLs as we are restarting the recordings
         */
        if (stop)  { this.cutRecording() }
        if (start) { this.recorder.record() }
        const stateUpdate = {}
        if (mode  !== null) { stateUpdate.mode  = mode  }
        if (focus !== null) { stateUpdate.focus = focus }
        if (next  !== null) { stateUpdate.next  = next  }
        if (clearAll)       {
            stateUpdate.audioURLs = []
            stateUpdate.audioBlobs = []
            for (let i = 0 ; i < this.state.audioURLs.length ; i ++ ) {
                URL.revokeObjectURL(this.state.audioURLs[i])
            }
        }
        this.setState( stateUpdate )
        console.log(`stop: ${stop}
start: ${start}
mode: ${mode}
focus: ${focus}
next: ${next}`)
    }
    
    playbackAll() {
        /* Playback all recorded audio
         */
        // Start playing the first audio file
        // The state will make the event listeners play the rest
        this.setState({ mode: 'playbackAll' })
        this.playback(0)
    }
    
    playback(index) {
        // Plays the audio element with a given index.
        if (this.state.audioURLs[index]) { 
            this.setState({ focus: index })  // highlight the word currently playing
            // debug logs
            console.log("playback index is " + index.toString())
            console.log(this.state.audioURLs[index])
            // play audio
            this.audioElements[index].play()
        } else {
            console.log("audio URL out of range: " + index.toString())
        }
    }
    
    dispatchAudio () {
        const blobPackets = _.zip(this.props.recordingWords, this.state.audioBlobs)
        const promiseArray = blobPackets.map( (packet) => {
            const itemId = packet[0][1]
            const blob = packet[1]
            // The only way to read content from a Blob is to use a FileReader (https://developer.mozilla.org/en-US/docs/Web/API/Blob)
            // a FileReader reads the Blob asynchronously
            // the "loadend" event will trigger once readAsBinaryString is complete
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.addEventListener("loadend", () => {
                    // reader.result contains the contents of blob as a string
                    const blobString = btoa(reader.result)  // Make the byte string friendly (base-64 encoding)
                    console.log(blobString.length)
                    console.log(this.props.userId)
                    console.log(itemId)
                    this.props.submitAudio({variables: {input: { file: blobString,
                                                                  speaker: this.props.userId,
                                                                  item: itemId }}})
                    .then( (response) => {
                        resolve(response)
                    }).catch( (error) => {
                        reject(error)
                    })
                });
                reader.readAsBinaryString(blob) // convert blob to string
            })
        }, this)
        
        // If all files were successfully sent to the server,
        // update the page with a fresh set of words to record
        Promise.all(promiseArray)
        .then( (responses) => {
            const snd = new Audio("submittedAudio.wav")
            snd.play()
            alert(counterpart.translate("record.success"))
            // refetch the words that populate the page
            this.props.refetchCallback()
            // reset to original state
            this.setState({
                audioBlobs: [],
                audioURLs: [],
                mode: "wait",
                focus: 0,
                next: 0
            })
        }).catch( (error) => {
            alert(counterpart.translate("record.error"))
        })
    }
    
    restartTutorial() {
        /* Resets the tutorial and plays it back from the beginning, regardless of where they stopped the tutorial before
         */
        // this.joyride - joyride's Apollo wrapper, set in refs below, in render()
        // this.joyride.refs - the ref set on the joyride object, it ends up referring to the Apollo wrapper
        // (so then you have to go through wrappedInstance etc.)
        this.joyride.refs.wrappedInstance.joyride.reset(true)
    }
    
    render() {
        return (
            <div>
                <Tutorial autorun={!this.props.hasSeenTutorial} ref={c => (this.joyride = c)} />
                <div className='panel animated fadeIn' id='record'>
                    <TopRow next={this.state.next} 
                            max={this.props.recordingWords.length -1} 
                            mode={this.state.mode} 
                            callback={this.recordCallback} 
                            playbackAll={this.playbackAll} 
                            submitAudio={this.dispatchAudio} 
                            recordedSoFar={this.state.audioURLs.length}
                            restartTutorial={this.restartTutorial}
                            />
                    <div id="wordList">
                        {this.props.recordingWords.map(
                            function(c, index) {
                                // making a string of words
                                let word = ""
                                c[0].map(
                                    function(d, index) {
                                        const nextItem = " / " + d.toString()
                                        word += nextItem
                                    }
                                )
                                // don't include the first ", "
                                word = word.slice(3)
                                
                                const audioRef = "audio" + index.toString()
                                return(
                                    <div key={index}>
                                        <WordRow index={index} mode={this.state.mode} next={this.state.next} callback={this.recordCallback} playbackFunction={this.playback} word={word} focused={index === this.state.focus} srcExists={!!this.state.audioURLs[index]} />
                                        <audio ref={audioRef} controls={false} muted={false} src={this.state.audioURLs[index]} />
                                    </div>
                                )
                            }, this)
                        }
                    </div>
                </div>
            </div>
        )
    }
    
    componentDidMount() {
        /* To be called when component initially mounts (componentDidMount), and when new items are loaded.
         * Add event listeners to all the <audio> elements.
         * They listen for when the audio finishes playing ("ended").
         * We use this to make the audio carry on playing in playbackAll mode.
         * Also, create a list of <audio> elements for future reference.
         */
        console.log(this.refs)
        this.audioElements = this.props.recordingWords.map(function(word, index) {  // Not actually using the words, just the index
            const myRef = "audio" + index.toString()
            const element = this.refs[myRef]
            console.log('adding listener to index ' + index.toString())
            const nextIndex = index +1
            // trigger when playing ends
            element.addEventListener("ended", () => {
                console.log('inside handler')
                if (this.state.mode === 'playbackAll' && nextIndex < this.state.audioURLs.length) {
                    // If we're playing back all, and there are more files to come 
                    console.log('playbackAll, playing next file')
                    this.playback(nextIndex)  // play the next file
                } else {
                    // Reset the state
                    const done = (this.state.audioURLs.length === this.props.recordingWords.length)
                    this.setState({
                        mode:  done ? "done" : "wait",
                        focus: this.state.next
                    })
                }
            })
            return element
        }, this)
        // TODO: do the event listeners ever need to be replaced?
        
        // set route leave hook - asks you whether you want to leave ifyou have unsaved recordings
        this.props.router.setRouteLeaveHook(this.props.route, () => {
            if (this.state.audioURLs.length > 0) {
                return (counterpart.translate("record.leaveHook"))
            }
        })
    }
        
    componentWillUnmount() {
        // destroy the audioContext when the page closes - frees up resources, ensures that we are below the limit for the number of audio contexts if the page is returned to many times (the limit is 6)
        this.audioContext.close()
    }
}

// TODO define an SQL function for this
class WrappedRecordPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
            pressedStartTutorialButton: false,
            recordingLanguage: null // TODO: actually query form database
		}
	}
    
    selectLanguage(option) {
        this.setState({ recordingLanguage: option })
    }
    
    startTutorial() {
        this.setState({ pressedStartTutorialButton: true })
    }
    
    refetchQuery() {
        this.props.items.refetch()
    }
    
    render() {
        if (this.props.username) {
            if (this.props.items.loading) { return <LoadingPage /> }

            const firstNodes = this.props.items.getItemsToRecord.nodes.slice(0,10)
            console.log(firstNodes)
            const firstWords = firstNodes.map( function(item) {
                return [item.homophones, item.id]
            })
            console.log(firstNodes)

            if (!this.state.recordingLanguage) {
                // if they haven't recorded in any language before, display a selector
                return <RecordSelector callback={this.selectLanguage} />
            } else if (!this.state.pressedStartTutorialButton && !this.props.hasSeenTutorial) { 
                return <PreRecord callback={this.startTutorial} />
            } else {
                return <RecordPage recordingWords={firstWords} 
                           submitAudio={this.props.audioMutation} 
                           refetchCallback={this.refetchQuery} 
                           hasSeenTutorial={this.props.hasSeenTutorial} 
                           userId={this.props.userId} 
                           router={this.props.router} route={this.props.route}
                        />
            }
        }
        // TODO: else if (... native language not being recorded ...) { return <NoRecordPage loggedIn={true} reason='noSuchLanguage' /> }
        else { return <NoRecordPage loggedIn={false} /> }
    }
}

const itemQuery = gql`query ($languageId: String!, $number: Int!) {
    getItemsToRecord(languageId: $languageId, number: $number) {
        nodes {
            id
            language
            homophones
        }
    }
}`
const itemQueryConfig = {
    name: 'items',
    options: (ownProps) => ({
        variables: {
            // TODO this should take the whole array and do something with it server-side, instead of just taking the first element
            // e.g. check user's native languages / if one, choose / if more than one, display a selector
            // -- but this should be informed by what languages we can actually record for!
            languageId: ownProps.username ? ownProps.native[0] : 'eng',  
            number: 10
        }
    })
}

const audioMutation = gql`mutation ($input: SubmitAudioInput!) {
    submitAudio (input: $input) {
        integer
    }
}` // "integer" is the id of the new row

// Variables must be defined when the function is called
const audioMutationConfig = {
    name: 'audioMutation'
}

export default compose(
    graphql(itemQuery, itemQueryConfig),
    graphql(audioMutation, audioMutationConfig))
(withRouter(WrappedRecordPage))