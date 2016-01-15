//'Record' page

var React = require('react');
var FileInput = require('./file-input.js');
var Parse = require('parse');
var ParseCCMixin = require('react-cloud-code-mixin');


var AudioForm = React.createClass({
    getInitialState: function() {
        return {fileReady: false}   // initially no file has been provided, so file is not ready
    },
    
    onSubmitAudio: function() {
        var Audio = Parse.Object.extend("Audio");
        var audio = new Audio();
        
        // more stuff happens here...
    },
    
    handleChange: function(event) {
        console.log('Selected file:', event.target.files[0]);
        this.setState({
            fileReady: true     // file is set to ready now that the user has selected a file
        });
    },

    render: function() {
        var submitStyle = {
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
                <input type="button" value="submit" style={submitStyle} onClick={this.onSubmitAudio} />
            </form>
        );
    }
});

var ItemForm = React.createClass({
    // Enable cloud code subscriptions
    mixins: [ParseCCMixin],
    
    // Cloud code subscriptions
    loadData: function(props, state) {
        var subs = {
            languages: {
                name: "fetchLanguages",
                propDeps: [],
                stateDeps: [],
                defaultValue: [] 
            }
        };
        return subs;
    },
 
    onSubmitItem: function() {
        // Define Item as a class which represents addition to the Item class; declare item as an instance of Item
        var Item = Parse.Object.extend("Item");
        var item = new Item();

        // Set Item properties
        var homophones = document.getElementById('itemNameInput').value;
        item.set("Homophones", [homophones]);
        var language = document.getElementById('itemLanguageInput').value;  // this is actually a language id, so can be used directly
        item.set("Language", language);
        
        // Save the item
        item.save(null, {
            success: function(item) {
            // Execute any logic that should take place after the object is saved.
            alert('New object created with objectId: ' + item.id);
            },
            error: function(item, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to create new object, with error code: ' + error.message);
            }
        });
    },
    
    render: function() {
        return (
            <form>
                Item name:<br/>
                <input id="itemNameInput" type="text" name="firstname" defaultValue="Mickey" /><br/>
                Item language:<br/>
                <select id="itemLanguageInput">    {/* this code is repeated from Arena - is there a way to DRY? */}
                    {this.data.languages.map(function(stringified) {
                    var c = JSON.parse(stringified);
                    return <option value={c.objectId} key={c.objectId}>{c.Name}</option>
                    })}
                </select>
                <br/>
                <input type="submit" value="Submit" onClick={this.onSubmitItem} />
            </form>
        );
    }
});


var Record = React.createClass({    
    render: function() {
        return (
            <div id='record'>
                <p>Record a sound</p>
                <p style={{color: 'lightgray'}}><em>Sound recording gizmo goes here</em></p>
                <p>Upload a sound file</p>
                <AudioForm />
                <ItemForm />
            </div>
        );
    }
});

module.exports = Record;