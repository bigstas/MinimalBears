//'Record' page
var React = require('react');
var FileInput = require('./file-input.js');
var Parse = require('parse');
var ParseCCMixin = require('react-cloud-code-mixin');


var Form = React.createClass({
    getInitialState: function() {
        return {
            fileReady: false, // initially no file has been provided, so file is not ready
            isLoading: true
        }
    },
    
    // Enable cloud code subscriptions
    mixins: [ParseCCMixin],
    
    loadData: function(props, state) {
        var subs = {
            languages: {
                name: "fetchLanguages",
                propDeps: [],
                stateDeps: [],
                defaultValue: [] 
            }
        }
        return subs;
    },
    
    handleFileChange: function(event) {
        console.log('Selected file:', event.target.files[0]);
        this.setState({
            fileReady: true
        });
    },
    
    handleLanguageChange: function() {},
    
    submitItem: function() {
        var homophones = document.getElementById("homophonesText").value;
        homophones = homophones.toLowerCase();
        console.log(homophones);
        var langId = document.getElementById("chooseLanguageForItem").value;
        console.log(langId);
        
        var Item = Parse.Object.extend("Item");
        var item = new Item();
        var Language = new Parse.Object("Language");
        Language.id = langId;
        item.set("Language", Language );
        item.set("Homophones", [homophones]);
        item.set("Audio", []);
        
        item.save(null, {
            success: function(item) {
                console.log('Item saved with homophones ' + homophones + ' and language id ' + langId);
            },
            error: function(item, error) {
                console.log('Failed to create new object, with error code: ' + error.message);
            }
        });
    },
    
    // Force a re-render after a query is returned
    // Copied code - make once and import, to accord with DRY principle?
    componentDidUpdate: function (props, state) {
        console.log(this.pendingQueries())
        if (state.isLoading && this.pendingQueries().length === 0) {
            this.setState({
                isLoading: false
            })
        }
    },
    
    render: function() {
        var submitStyle = {
            marginLeft: '2%',
            display: 'none'
        };
        if (this.state.fileReady) {submitStyle.display = 'inline'}
        
        return (
            <div>
                <p>Upload a sound file</p>
                <form>
                    <FileInput name="mySound"
                        accept=".wav"
                        placeholder="My Sound"
                        className="uploadSound"
                        onChange={this.handleFileChange} />
                    Contribute an item<br/>
                    Homophones:<br/>
                    <input id="homophonesText" type="text" name="firstname"/><br/>
                </form>
                <select id="chooseLanguageForItem" onChange={this.handleLanguageChange}>
                    {this.data.languages.map(function(stringified) {
                        var c = JSON.parse(stringified);
                        return <option value={c.objectId} key={c.objectId}>{c.Name}</option>
                    })}
                </select>
                <button type="button" style={submitStyle} onClick={this.submitItem}>Submit</button>
            </div>
        );
    }
});


var Record = React.createClass({
    render: function() {
        return (
            <div id='record'>
                <p>Record a sound</p>
                <p style={{color: 'lightgray'}}><em>Sound recording gizmo goes here</em></p>
                <Form />
            </div>
        )
    }
});

module.exports = Record;