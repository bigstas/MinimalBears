import React from 'react'
import Translate from 'react-translate-component'
import Peaks from 'peaks.js'


const PeaksObject = React.createClass({
    render() {
        this.myAudioContext = new AudioContext()
        console.log("this.props.src is " + this.props.src)
        return (
            <div>
                <div id='audioContainer' ref={this.audioContainerRef} />
                <audio id='mainAudio' ref={this.mainAudioRef} src={this.props.src} controls={false} />
            </div>
        )
    },
    
    audioContainerRef(el) {this.audioContainer = el; console.log('define audioContainer ref'); console.log(el)},
    mainAudioRef(el) {this.mainAudio = el; console.log('define mainAudio ref'); console.log(el)},
    
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
    },
    
    componentDidMount() { this.mainAudio.addEventListener('loadeddata', this.updatePeaksObject) },
    
    shouldComponentUpdate(nextProps, nextState) {
        this.mainAudio.src = nextProps.src
        this.mainAudio.load()
        this.instance.destroy()
        
        return false
    },
    
    componentWillUnmount() { 
        this.instance.destroy() 
        // TODO: below requires testing - is it being destroyed?
        this.myAudioContext.close()
    }
})


const EditingPage = React.createClass({
    getInitialState() { 
        return ({ 
            src: ["alex bid.wav", "fran win.wav"],
            whichSrc: 0
        }) 
    },
    
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
    },
    
    handleReject() {
        this.setState({ whichSrc: this.state.whichSrc +1 })
        // some sort of dialogue box concerning why the audio has been rejected?
    },
    
    playOrPause() {
        if(this.refs.PeaksObject.mainAudio.paused) {
            this.refs.PeaksObject.instance.player.play()
        } else {
            this.refs.PeaksObject.instance.player.pause()
        }
    },
    
    playClip() {
        const segments = this.refs.PeaksObject.instance.segments.getSegments()
        this.refs.PeaksObject.instance.player.playSegment(segments[0])
    },
    
    zoom(zoomIn) {
        if (zoomIn) { this.refs.PeaksObject.instance.zoom.zoomIn() }
        else        { this.refs.PeaksObject.instance.zoom.zoomOut() }
    },
    
    render() {
        console.log(this.state.whichSrc)
        
        return(
            <div className='panel animated fadeIn' id='edit'>
                <p>Welcome to the editing page!</p>
                <PeaksObject src={this.state.src[this.state.whichSrc]} ref="PeaksObject" />
                <div style={{display: "block"}}>
                    <div className="authbtn" onClick={this.playOrPause} >Play</div>
                    <div className="authbtn" onClick={this.playClip} ><Translate content="edit.playClip" /></div>
                    <div className="authbtn" onClick={this.zoom.bind(this, true)} >Zoom in</div>
                    <div className="authbtn" onClick={this.zoom.bind(this, false)} >Zoom out</div>
                </div>
                <div className="authbtn" onClick={this.handleSubmit.bind(this, false)} >Accept full</div>
                <div className="authbtn" onClick={this.handleSubmit.bind(this, true)} >Accept segment</div>
                <div className="authbtn" onClick={this.handleReject} >Reject</div>
            </div>
        )
    }
})

export default EditingPage