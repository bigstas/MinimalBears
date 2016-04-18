import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link } from 'react-router';
import INTERPRETED from '../client/static/translations';


// using $ meteor add maxencecornet:audio-recorder
// if ultimately not used, delete this code and run
// $ meteor remove maxencecornet:audio-recorder
RecordPage = React.createClass({    
    handleRecord () {
        // no initialisation, following Nav example of this.mouseIsDownOnDropdown
        this.audioRecorder = new AudioRecorder();
        this.audioRecorder.startRecording();
    },
    // at the moment this autodownloads, not what we want but perhaps we could modify it?
    stopRecord () { 
        if (this.audioRecorder) {
            this.audioRecorder.stopRecording('wav', 'wavFile', this.recordCallback); 
        }
    },
    
    recordCallback () {
        // populate this
    },
    
    render() {
        return (
            <div id='record'>
                <p>This is the record page</p>
                <button type="button" onClick={this.handleRecord}>Record!</button>
                <button type="button" onClick={this.stopRecord}>Stop!</button>
            </div>
        )
    }
});

export default RecordPage;

