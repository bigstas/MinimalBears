// Arena object and children for 'Train' page
// Star image by Yellowicon (licence: GNU/GPL)
// Ta Da sound recorded by Mike Koenig (license: Attribution 3.0)

import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// new gql way of getting data...
import { connect } from 'react-apollo';
import gql from 'graphql-tag';

/*
IT WORKS LIKE THIS

{
  contrastWithPairsNodes(orderBy: ROW_ID) {
    nodes {
      language
      rowId
      name
      pairs
    }
  }
}

*/


function mapQueriesToProps({ ownProps, state }) {
    var aNumber = 1;
    var bNumber = 1;
    
    return {
        pairs: {
            query: gql`{contrastNodes(orderBy: $orderBy) {
                nodes {
                    language
                }
            }}`,
            variables: {
                orderBy: 'ROW_ID',
            }
        },
        info: {
            query: gql`{itemByRowId (rowId: 1) {
                homophones
            }}`
        }
    }
};
//...end


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
//class Arena extends React.Component {    
Arena = React.createClass({
    getInitialState() {
    //    this.data = {contrasts: []}; // For an empty dropdown list before a language is chosen
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
        var snd = new Audio("http://www.minimalbears.com/audio/tfss-899324fe-eb52-4aa2-8e96-a45dba306faa-kaija seek.wav");
        snd.play();
        // (If the file is blocked, the response header will have connection: close)
        this.reloadData(['pair'])
    },
    
    render() {
        var buttonDisabled = true; // <-- placeholder while below is commented out
        /*
        var buttonDisabled = (this.state.mode!=="feedback" || this.state.counter === this.state.maxRounds) ? true : false;
        var starClass = (this.state.counter < this.state.maxRounds) ? 'offStar' : 'onStar';
        if (this.state.counter === this.state.maxRounds) {
            var snd = new Audio(this.data.tadaSound);
            snd.play()
        }
        */
        
        console.log(this.props);
        
        // Turn this into a single function to be defined elsewhere, or keep it here as these two?
        var languagesToBeMapped;
        if (this.props.languages === undefined) {
            languagesToBeMapped = ['loading...'];
        } else {
            languagesToBeMapped = this.props.languages;
        }
        var contrastsToBeMapped;
        if (this.props.contrasts === undefined) {
            contrastsToBeMapped = ['loading...'];
        } else {
            contrastsToBeMapped = this.props.contrasts;
        }
        
        var textList = ["placeholder", "more placeholder"];  
        // If the data has been returned:
        if (!this.props.pairs.loading && !this.props.info.loading) {
            //textList = [this.props.data.contrastNodes.nodes[1].name,
            //        this.props.info.itemByRowId.homophones[0]]
            var pair = this.props.pairs.contrastNodes.nodes[0].language;
            textList = [pair, pair];
            //textlist = [pair.first, pair.second];
        }
        
        return (
            <div id="arena">
                <p id='arenaMessage' style={{color: 'darkkhaki'}}>{(this.state.counter === this.state.maxRounds) ? "CONGRATULATIONS! You did it!" : "This is the arena."}</p>
                {/*<img className={starClass} src={this.data.starImage} alt='star' /> */}
                
                <ProgressBar style={{ width: ( (this.state.counter/this.state.maxRounds) *100 ).toString() + "%", borderRadius: "20px", transitionDuration: "0.5s" }} />

                <Button disabled={buttonDisabled} handle={this.handleProgressClick} />
                
                {/* Buttons for choosing options */}
                <div id='optionContainer' className="container">
                    {/*
                    {this.state.activePair.items.map(function(c) {
                        return <WordOption
                                word={c.text}
                                feedback={c.correct ? "Correct!" : "Wrong!"}
                                callbackParent={this.onWordChosen}
                                mode={this.state.mode} />
                    }, this)}
                    */}
                    {
                        textList.map(function(c) {
                            return <WordOption
                                word={c}
                                feedback={"Correct!"}
                                callbackParent={this.onWordChosen}
                                mode={this.state.mode} />
                        }, this)
                    }
                </div>
            </div> 
        );
    }
});

//export default createContainer(({params}) => {return {};}, Arena);
export default connect({mapQueriesToProps})(Arena)