//'Record' page
var React = require('react');
var FileInput = require('./file-input.js');
var Parse = require('parse');
var ParseCCMixin = require('react-cloud-code-mixin');


var Form = React.createClass({
    getInitialState: function() {
        this.data = {contrasts: []}; // For an empty dropdown list before a language is chosen
        return {
            file: false,   // initially no file has been provided
            activeLanguageId: null,
            isLoading: true     // to ensure re-render when queries mature
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
            },
            items: {
                name: "fetchItems",
                propDeps: [],
                stateDeps: [],
                defaultValue: []
            }
        }
        if (state.activeLanguageId) {
            subs.contrasts = {
                name: "fetchContrasts",
                params: {languageId: state.activeLanguageId},
                propDeps: [],
                stateDeps: ['activeLanguageId'],
                defaultValue: []
            }
        }
        return subs;
    },
    
    handleFileChange: function(event) {
        console.log('Selected file:', event.target.files[0]);
        this.setState({
            file: event.target.files[0]
        });
    },
    
    submitAudio: function() {
        if (!this.state.file) {
            alert("Cannot process - you have not chosen a file");
        } else {
            console.log(this.state.file);
            //alert("This part of the program is not ready yet, so although you provided a file, nothing happened.");
            var speaker = document.getElementById("chooseSpeakerForAudio").value;
            var itemId = document.getElementById("chooseItemForAudio").value;
            
            var Audio = Parse.Object.extend("Audio");
            var audio = new Audio();
            var Item = new Parse.Object("Item");
            var file = new Parse.File(this.state.file.name, this.state.file)
            Item.id = itemId;
            audio.set("Item", Item );
            audio.set("speaker", speaker);
            audio.set("File", file);
            
            audio.save(null, {
                success: function(audio) {
                    console.log('Audio saved with speaker ' + speaker + ' and item id ' + itemId);
                },
                error: function(item, error) {
                    console.log('Failed to create new object, with error code: ' + error.message);
                }
            });
        }
    },
    
    submitItem: function() {
        var homophones = document.getElementById("homophonesText").value;
        if (homophones === "") {
            alert("Cannot process - you have not written an item name");
        } else {
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
        }
    },
    
    submitPair: function() {
        // collect stringified objects
        var contrastString = document.getElementById("chooseContrastForPair").value;
        var item1String = document.getElementById("chooseItem1ForPair").value;
        var item2String = document.getElementById("chooseItem2ForPair").value;
        // turn them back into objects
        var contrastObject = JSON.parse(contrastString);
        var item1Object = JSON.parse(item1String);
        var item2Object = JSON.parse(item2String);
        // get their id's
        var contrast = new Parse.Object("Contrast");
        contrast.id = contrastObject.objectId;
        var item1 = new Parse.Object("Item");
        item1.id = item1Object.objectId;
        var item2 = new Parse.Object("Item");
        item2.id = item2Object.objectId;
        
        var Pair = Parse.Object.extend("Pair");
        var pair = new Pair();
        pair.set("Contrast", contrast);
        pair.set("First", item1);
        pair.set("Second", item2);
        
        pair.save(null, {
            success: function(pair) {
                console.log('Pair saved');
            },
            error: function(pair, error) {
                console.log('Failed to create new object, with error code: ' + error.message);
            }
        });
    },
        
    handleLanguageChange: function() {
        this.setState({
            activeLanguageId: document.getElementById("chooseLanguageForPair").value,
            isLoading: true
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
    
    render: function() {        // MANY code repetitions here - need to rationalise to follow DRY principle
        var speakerList = ['kaija', 'stas', 'wozza'];
        return (
            <div>
                <h3>Upload a sound file</h3>
                <FileInput name="mySound"
                    accept=".wav"
                    placeholder="My Sound"
                    className="uploadSound"
                    onChange={this.handleFileChange} />
                Speaker:
                <select id="chooseSpeakerForAudio">
                    {speakerList.map(function(c) {
                        return <option value={c} key={c}>{c}</option>
                    })}
                </select><br/>
                Item:
                <select id="chooseItemForAudio">
                    {this.data.items.map(function(stringified) {
                        var c = JSON.parse(stringified);
                        return <option value={c.objectId} key={c.objectId}>{c.Homophones}</option>
                    })}
                </select><br/>
                <button type="button" onClick={this.submitAudio}>Submit audio</button>
                <h3>Contribute an item</h3>
                Homophones:
                <input id="homophonesText" type="text" name="whatever" /><br/>
                Language:
                <select id="chooseLanguageForItem">
                    {this.data.languages.map(function(stringified) {
                        var c = JSON.parse(stringified);
                        return <option value={c.objectId} key={c.objectId}>{c.Name}</option>
                    })}
                </select><br/>
                <button type="button" onClick={this.submitItem}>Submit item</button>
                <h3>Link a pair</h3>
                <select id="chooseLanguageForPair" onChange={this.handleLanguageChange} >
                    {this.data.languages.map(function(stringified) {
                        var c = JSON.parse(stringified);
                        return <option value={c.objectId} key={c.objectId}>{c.Name}</option>
                    })}
                </select>
                <select id="chooseContrastForPair">
                    {this.data.contrasts.map(function(stringified) {
                        var c = JSON.parse(stringified);
                        return <option value={stringified} key={stringified}>{c.Name}</option>
                    })}                    
                </select>
                <select id="chooseItem1ForPair">
                    {this.data.items.map(function(stringified) {
                        var c = JSON.parse(stringified);
                        return <option value={stringified} key={stringified}>{c.Homophones[0]}</option>
                    })}                    
                </select>
                <select id="chooseItem2ForPair">
                    {this.data.items.map(function(stringified) {
                        var c = JSON.parse(stringified);
                        return <option value={stringified} key={stringified}>{c.Homophones[0]}</option>
                    })}                    
                </select>
                <button type="button" onClick={this.submitPair}>Submit pair</button>
                    {/* TO DO - in here put two more dropdowns, which allow you to choose among the words in the language */}
            </div>
        );
    }
});


var Record = React.createClass({
    render: function() {
        return (
            <div id='record'>
                <h3>Record a sound</h3>
                <p style={{color: 'lightgray'}}><em>Sound recording gizmo goes here</em></p>
                <Form />
            </div>
        )
    }
});

module.exports = Record;