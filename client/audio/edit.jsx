import React from 'react'
import Translate from 'react-translate-component'
import Peaks from 'peaks.js'
import { graphql, compose } from 'react-apollo'

import LoadingPage from '../auxiliary/loading'
import { moderationQuery, approveAudioMutation, editAudioMutation } from '/lib/graphql'

function NoEditPage(props) {
    return (
        <div className='panel animated fadeIn' id='preRecord'>
            <Translate component="p" content="edit.noEdit" />
        </div>
    )
}

class PeaksObject extends React.Component {
    render() {
        this.myAudioContext = new AudioContext()
        console.log("this.props.src is " + this.props.src)
        return (
            <div>
                <div id='audioContainer' ref="audioContainer" />
                <audio id='mainAudio' ref="mainAudio" src={this.props.src} controls={false} />
            </div>
        )
    }
    
    updatePeaksObject() {
        console.log(this.refs.mainAudio.src)
        console.log(this.refs.mainAudio.duration)
        
        this.instance = Peaks.init({
            container: this.refs.audioContainer,
            mediaElement: this.refs.mainAudio,
            audioContext: this.myAudioContext,
            keyboard: false,
            height: 200,
            segments: [{
                startTime: 0.1,
                endTime: 0.3,
                editable: true,
                color: "#ff0000",
                labelText: "My label"
            }],
            waveformBuilderOptions: {
                scale: 1,
                amplitude_scale: 2
            },
            zoomAdapter: 'static',
            zoomLevels: [1, 2, 4, 8, 16, 32, 64, 128],
            overviewHighlightRectangleColor: 'grey',
            logger: console.error.bind(console)
        })
        console.log("Peaks init done")
    }
    
    componentDidMount() {
        this.refs.mainAudio.addEventListener('loadeddata', this.updatePeaksObject.bind(this))
	}
    
    shouldComponentUpdate(nextProps, nextState) {
        this.refs.mainAudio.src = nextProps.src
        this.refs.mainAudio.load()
        this.instance.destroy()
        
        return false
    }
    
    componentWillUnmount() { 
        this.instance.destroy() 
        // TODO: below requires testing - is it being destroyed?
        this.myAudioContext.close()
    }
}


class EditingPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
            src: ["alex bid.wav", "fran win.wav"],
            whichSrc: 0
		}
	}
    
    handleSubmit(segment) {
        // TODO: this should be passed to the database rather than just logged
        if (segment) {
            const segment = this.refs.PeaksObject.instance.segments.getSegments()[0]
            const times = [segment.startTime, segment.endTime]
            this.props.submitEdits({variables: {input: {
                file: "", // TODO!
                fromStart: {
                    seconds: 0.1
                },
                fromEnd: {
                    seconds: 0.1
                },
                volume: 0.9
            }}}).then((response) => {
                console.log("Success approving audio!")
                console.dir(response)
            }).catch((error) => {
                console.log("error on edit")
                console.error(error)
            })
            console.log(times)
        } else {
            this.handleApproval(true, () => {}) // any callback needed?
        }
        this.setState({ whichSrc: this.state.whichSrc +1 })
        alert("On to the next audio clip!")
    }
    
    handleReject() {
        this.handleApproval(false,
            () => this.setState.bind(this, { whichSrc: this.state.whichSrc +1 }) // do we need to bind(this)?
        )
        // some sort of dialogue box concerning why the audio has been rejected?
    }

    handleApproval(approved, callback) {
        this.props.approveAudio({variables: {input: {
            file: "", // TODO!
            approved: approved
        }}}).then( (response) => {
            console.log("Success approving audio!")
            console.dir(response)
            callback()
        }).catch( (error) => {
            console.log("error on approval")
            console.error(error)
        })
    }
    
    playOrPause() {
        if(this.refs.PeaksObject.refs.mainAudio.paused) {
            this.refs.PeaksObject.instance.player.play()
        } else {
            this.refs.PeaksObject.instance.player.pause()
        }
    }
    
    playClip() {
        const segments = this.refs.PeaksObject.instance.segments.getSegments()
        this.refs.PeaksObject.instance.player.playSegment(segments[0])
    }
    
    zoom(zoomIn) {
        if (zoomIn) { this.refs.PeaksObject.instance.zoom.zoomIn() }
        else        { this.refs.PeaksObject.instance.zoom.zoomOut() }
    }
    
    render() {
        console.log(this.state.whichSrc)
        // TODO: should be based on a query of some sort
        // use public.check_moderator (SQL)
        const userIsModerator = true
        if (!userIsModerator) { return <NoEditPage /> }
        if (this.props.audio.loading) { return <LoadingPage /> }
        return(
            <div className='panel animated fadeIn' id='edit'>
                <Translate  id='moderationHead' component="h1" content="edit.heading" />
                <p><Translate content="edit.thisRecording" />{this.props.audio.file}</p> {/* The idea is that the moderator should be able to see what word was supposed to be being recorded, otherwise we could have silly errors! */}
                <PeaksObject src={this.state.src[this.state.whichSrc]} ref="PeaksObject" />
                <div id='topButtons' style={{display: "block"}}>
                    <div className="authbtn" onClick={this.playOrPause.bind(this)} ><Translate content="edit.playAll" /></div>
                    <div className="authbtn" onClick={this.playClip.bind(this)} ><Translate content="edit.playClip" /></div>
                    <div className="authbtn" onClick={this.zoom.bind(this, true)} ><Translate content="edit.zoomIn" /></div>
                    <div className="authbtn" onClick={this.zoom.bind(this, false)} ><Translate content="edit.zoomOut" /></div>
                </div>
                <div id='bottomButtons' style={{display: "block"}}>
                    <div className="authbtn" onClick={this.handleSubmit.bind(this, false)} ><Translate content="edit.acceptFull" /></div>
                    <div className="authbtn" onClick={this.handleSubmit.bind(this, true)} ><Translate content="edit.acceptSegment" /></div>
                    <div className="authbtn" onClick={this.handleReject.bind(this)} ><Translate content="edit.reject" /></div>
                </div>
            </div>
        )
    }
}

const moderationQueryConfig = {
    name: 'audio',
    options: (ownProps) => ({
        variables: {
            languageId: ownProps.username ? ownProps.native[0] : 'eng'
        }
    })
}
// TODO allow the user to choose language to moderate,
// out of the languages they are a moderator for

// TODO replace mutations with Meteor methods

export default compose(
    graphql(moderationQuery, moderationQueryConfig),
    graphql(approveAudioMutation, {name: 'approveAudio'}),
    graphql(editAudioMutation, {name: 'submitEdits'})
)(EditingPage)