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
                <audio id='mainAudio' ref={this.mainAudioRef} src={this.props.src} controls />
            </div>
        )
    },
    
    audioContainerRef(el) {this.audioContainer = el; console.log('define audioContainer ref'); console.log(el)},
    mainAudioRef(el) {this.mainAudio = el; console.log('define mainAudio ref'); console.log(el)},
    
    updatePeaksObject() {
        console.log('updating')
        console.log(this.mainAudio.src)
        console.log(this.mainAudio)
        console.log(this.audioContainer)
        this.instance = Peaks.init({
            container: this.audioContainer,
            mediaElement: this.mainAudio,
            audioContext: this.myAudioContext,
            keyboard: false,
            segments: [{
                startTime: 1,
                endTime: 10,
                editable: true,
                color: "#ff0000",
                labelText: "My label"
            }],
            zoomAdapter: 'animated',
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
            src: ["bukk bukk.wav", "monka.m4a", "bukk bukk.wav"],
            whichSrc: 0
        }) 
    },
    
    handleSubmit() {
        // TODO: this should be passed to the database rather than just logged
        const segment = this.refs.PeaksObject.instance.segments.getSegments()[0]
        const times = [segment.startTime, segment.endTime]
        console.log(times)
        this.setState({ whichSrc: this.state.whichSrc +1 })
        alert("On to the next audio clip!")
    },
    
    playClip() {
        const segments = this.refs.PeaksObject.instance.segments.getSegments()
        this.refs.PeaksObject.instance.player.playSegment(segments[0])
    },
    
    render() {
        console.log(this.state.whichSrc)
        
        return(
            <div className='panel' id='edit'>
                <p>Welcome to the editing page!</p>
                <PeaksObject src={this.state.src[this.state.whichSrc]} ref="PeaksObject" />
                <div className="authbtn" onClick={this.handleSubmit} >
                    <Translate content="edit.submit" />
                </div>
                <div className="authbtn" onClick={this.playClip} >
                    <Translate content="edit.playClip" />
                </div>
            </div>
        )
    }
})

export default EditingPage