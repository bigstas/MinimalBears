import React from 'react'
import Translate from 'react-translate-component'
import Peaks from 'peaks.js'

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
                <div id='audioContainer' ref={this.audioContainerRef.bind(this)} />
                <audio id='mainAudio' ref={this.mainAudioRef.bind(this)} src={this.props.src} controls={false} />
            </div>
        )
    }
    
    audioContainerRef(el) {
    	this.audioContainer = el
    	console.log('define audioContainer ref')
    	console.log(el)
    }
    
    mainAudioRef(el) {
    	this.mainAudio = el
    	console.log('define mainAudio ref')
    	console.log(el)
	}
    
    updatePeaksObject() {
        console.log(this.mainAudio.src)
        console.log(this.mainAudio.duration)
        
        this.instance = Peaks.init({
            container: this.audioContainer,
            mediaElement: this.mainAudio,
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
    	this.mainAudio.addEventListener('loadeddata', this.updatePeaksObject.bind(this))
	}
    
    shouldComponentUpdate(nextProps, nextState) {
        this.mainAudio.src = nextProps.src
        this.mainAudio.load()
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
            console.log(times)
        } else {
            // do something to accept the entire audio file as ok
        }
        this.setState({ whichSrc: this.state.whichSrc +1 })
        alert("On to the next audio clip!")
    }
    
    handleReject() {
        this.setState({ whichSrc: this.state.whichSrc +1 })
        // some sort of dialogue box concerning why the audio has been rejected?
    }
    
    playOrPause() {
        if(this.refs.PeaksObject.mainAudio.paused) {
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
        const userIsModerator = true
        if (!userIsModerator) { return <NoEditPage /> }
        
        return(
            <div className='panel animated fadeIn' id='edit'>
                <Translate  id='moderationHead' component="h1" content="edit.heading" />
                <p><Translate content="edit.thisRecording" />{this.state.src[this.state.whichSrc]}</p> {/* The idea is that the moderator should be able to see what word was supposed to be being recorded, otherwise we could have silly errors! */}
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

export default EditingPage