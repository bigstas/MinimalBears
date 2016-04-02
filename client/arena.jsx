// Arena object and children for 'Train' page
// Star image by Yellowicon (licence: GNU/GPL)
// Ta Da sound recorded by Mike Koenig (license: Attribution 3.0)

import React from 'react';

// Progress bar
var ProgressBar = React.createClass({
    render() {
        return (
            <div id="progress">
                <div id="fill" style={this.props.style}></div>
            </div>
        );
    }
});

// Progress button
var Button = React.createClass({
    render() {
        // Uses CSS animate.css library. Syntax is:
        // className={'someClass otherClass classesThatHaveNothingToDoWithTheLibrary animated classThatTellsYouWhichWayYouWantToAnimateFromTheLibrary'}
        var btnClass = 'enabledProgress animated rubberBand';
        var click = this.props.handle;
        if (this.props.disabled) {
            btnClass = 'disabledProgress';
            click = function () {}; // click doesn't do anything when it's disabled
        }
        return (
            <div id="button" className={btnClass} onClick={click}>Progress</div>
        );
    }
});

// Button for responding to a recording
var WordOption = React.createClass({ 
    handleClick() {
        if (this.props.mode === "ask") {
            this.props.callbackParent(); // you only want things to happen in 'ask' mode, as outside of that mode these buttons shouldn't do anything
        }
    },
    
    render() {
        var background = (this.props.mode === "feedback")
            ? (this.props.feedback === "Correct!") ? "green" : "red"
            : "#b0b0e0" ;
        var text = (this.props.mode === "feedback") ? this.props.feedback : this.props.word;
        var wordOptionClass = (this.props.mode === "ask" ? 'wordOption wordOptionActive animated pulse' : 'wordOption');
        
        return (
            <div className={wordOptionClass}
            onClick={this.handleClick}
            style={{backgroundColor: background}}>
                {text}
            </div>
        );
    }
});

// The arena - where the action happens
// currently in the process of ADAPTING this from Parse to Meteor
Arena = React.createClass({
    getInitialState() {
        this.data = {contrasts: []}; // For an empty dropdown list before a language is chosen
        return {
            ferocity: 'ferocity not ready',
            mySound: 'sound not ready',
            selection: 0,
            counter: 0,
            maxRounds: 10,
            mode: "wait",
            activeLanguageId: null,
            activeContrast: null,
            activePair: {items: []},
            items: [],
        };
    },
    
    // This mixin makes the getMeteorData method work
    mixins: [ReactMeteorData],
    
    // Loads items from the Languages collection and puts them in this.data.languages
    // This is kind of working fine, except that React seems to reload the data every time the user does anything
    // (e.g. choose something from the language dropdown, even before I've enabled contrasts in this code).
    // This is causing a visible lag of about a quarter of a second.
    // We will probably want some sort of componentShouldUpdate thing here to only have the data be re-fetched when we really need it.
    getMeteorData() {
        console.log("Getting data");
        const bearSubHandle = Meteor.subscribe("beardata");
        const langSubHandle = Meteor.subscribe("langdata");
        const contrastSubHandle = Meteor.subscribe("contrastdata");
        console.log(bearSubHandle.ready());
        console.log(langSubHandle.ready());
        console.log(contrastSubHandle.ready());
        
        if (bearSubHandle.ready() && langSubHandle.ready() && contrastSubHandle.ready()) {
            var langId = this.state.activeLanguageId === null ? 0: this.state.activeLanguageId;
            
            return {
                bears: Bears.fetch(),
                languages: Languages.fetch(),
                contrasts: Contrasts.where({
                    // The line immediately below fails at the moment, so commented out. The line below it works, and gives all the contrasts for English (language id = 1 in the database).
                    //language: langId
                    language: 1
                }).select("name"),
                bearsLoading: false
            };
        } else {
            return {
                bearsLoading: true
            };
        }
    },
    
    // After the user chooses a language
    handleLanguageChange() {
        this.setState({
            activeLanguageId: document.getElementById("chooseLanguage").value,
            activeContrast: null    // need to reset contrasts when language changes
        });
        console.log("The current activeLanguageId is " + this.state.activeLanguageId + " , with a type of " + typeof this.state.activeLanguageId);
    },
    
    // After the user chooses a contrast
    handleContrastChange() {
        this.setState({
            activeContrast: document.getElementById("chooseContrast").value,
            mode: 'feedback'
        });
    },
    
    // After the user chooses an option during training
    onWordChosen() {
        this.setState({
            mode: "feedback",
            counter: (this.state.counter < this.state.maxRounds) ? this.state.counter +1 : this.state.maxRounds
        });
    },
    
    // After the user wants move on to the next recording
    handleProgressClick() {
        // Set the state, play the file, and issue a new query
        var pair = JSON.parse(this.data.pair);
        console.log(pair);
        this.setState({
            mode: "ask",
            activePair: pair
        });
        var snd = new Audio(pair.url);
        snd.play();
        // (If the file is blocked, the response header will have connection: close)
        this.reloadData(['pair'])
    },
    
    // Force a re-render after a query is returned
    /* componentDidUpdate: function (props, state) {
        console.log(this.pendingQueries())
        if (state.isLoading && this.pendingQueries().length === 0) {
            this.setState({
                isLoading: false
            })
        }
    }, */
    
    increment() {
        this.setState({
            // mySound: new Audio(Meteor.call('sendSound')),
            counter: this.state.counter +1
        })
        Meteor.call('getFerocity', this.data.bears[0].age, this.dataCallback);
        
        var myNewBear = {
            colour: 'yellow',
            age: this.state.counter
        }
        Meteor.call('saveMyBear', myNewBear, this.bearCallback);
    },
    
    bearCallback(error, result) {
        if (error) {
            console.log("RAWR! error");
        } else {
            console.log("RAWR! curiosity?");
        }
    },
    
    dataCallback(error, result) {
        this.setState({
            ferocity: result
        })
    },
    
    soundCallback(error, result) {
        this.setState({
            mySound: result
        })
    },
    
    render() {
        var buttonDisabled = (this.state.mode!=="feedback" || this.state.counter === this.state.maxRounds) ? true : false;
        var starClass = (this.state.counter < this.state.maxRounds) ? 'offStar' : 'onStar';
        if (this.state.counter === this.state.maxRounds) {
            var snd = new Audio(this.data.tadaSound);
            snd.play()
        }
        
        console.log(this.data);
        console.log(this.data.bears);
        
        // Turn this into a single function to be defined elsewhere, or keep it here as these two?
        var languagesToBeMapped;
        if (this.data.languages === undefined) {
            languagesToBeMapped = ['loading...'];
        } else {
            languagesToBeMapped = this.data.languages;
        }
        var contrastsToBeMapped;
        if (this.data.contrasts === undefined) {
            contrastsToBeMapped = ['loading...'];
        } else {
            contrastsToBeMapped = this.data.contrasts;
        }
        
        /* use URLs!
        console.log(this.state.mySound);
        console.log(typeof this.state.mySound);
        if ((typeof this.state.mySound) !== 'string') {
            console.log("it's not a string");
            this.state.mySound.play();
        }*/
        
        return (
            <div id="arena">
                <button type='button' onClick={this.increment} />
                <p>{this.state.ferocity}</p>
                <p>{this.data.bears === undefined ? undefined : this.data.bears[0].age}</p>
                {/* Dropdown menus for language and contrast */}
                <select id="chooseLanguage" onChange={this.handleLanguageChange}>
                    {languagesToBeMapped.map(function(c) {
                        return <option value={c.id} key={c.id}>{c.name}</option>
                    })}
                </select>
                <select id="chooseContrast" onChange={this.handleContrastChange}>
                    {contrastsToBeMapped.map(function(c) {
                        return <option value={c.name} key={c.id}>{c.name}</option>
                    })}                  
                </select>
                
                {/* Training area */}
                <p id='arenaMessage' style={{color: 'darkkhaki'}}>{(this.state.counter === this.state.maxRounds) ? "CONGRATULATIONS! You did it!" : "This is the arena."}</p>
                <img className={starClass} src={this.data.starImage} alt='star' />
                
                <ProgressBar style={{ width: ( (this.state.counter/this.state.maxRounds) *100 ).toString() + "%", borderRadius: "20px", transitionDuration: "0.5s" }} />

                <Button disabled={buttonDisabled} handle={this.handleProgressClick} />
                
                {/* Buttons for choosing options */}
                <div id='optionContainer' className="container">
                    {this.state.activePair.items.map(function(c) {
                        return <WordOption
                                word={c.text}
                                feedback={c.correct ? "Correct!" : "Wrong!"}
                                callbackParent={this.onWordChosen}
                                mode={this.state.mode} />
                    }, this)}
                </div>
            </div> 
        );
    }
});