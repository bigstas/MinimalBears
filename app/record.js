//'Record' page

var React = require('react');
var FileInput = require('./file-input.js');
//var ParseCCMixin = require('react-cloud-code-mixin');


var Form = React.createClass({
    getInitialState: function() {
        return {
            fileReady: false
        }
    },
    
    handleChange: function(event) {
        console.log('Selected file:', event.target.files[0]);
        this.setState({
            fileReady: true
        });
    },

    render: function() {
        var submitStyle = {
            marginLeft: '2%',
            display: 'none'
        };
        if (this.state.fileReady) {submitStyle.display = 'inline'}
        
        return (
            <form>
                <FileInput name="mySound"
                    accept=".wav"
                    placeholder="My Sound"
                    className="uploadSound"
                    onChange={this.handleChange} />
                <input type="button" value="submit" style={submitStyle} />
            </form>
        );
    }
});


var Record = React.createClass({

    // Enable cloud code subscriptions
    //mixins: [ParseCCMixin],
    
    render: function() {
        return (
            <div id='record'>
                <p>Record a sound</p>
                <p style={{color: 'lightgray'}}><em>Sound recording gizmo goes here</em></p>
                <p>Upload a sound file</p>
                <Form />
            </div>
        )
    }
});

module.exports = Record;