// Arena object and children for 'Train' page
// Star image by Yellowicon (licence: GNU/GPL)
// Ta Da sound recorded by Mike Koenig (license: Attribution 3.0)

import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// new gql way of getting data...
import { connect } from 'react-apollo';
import gql from 'graphql-tag';

function parsePairs(pairString) {
    /* Take a string of the form '{"(int,int)","(int,int)",...}'
     * where each 'int' represents an integer,
     * and return a list of lists of integers
     */
    // Split into strings of the form '(int,int)'
    stringList = pairString.substring(2, pairString.length-2).split('","')
    // Split these strings
    pairList = stringList.map(x => x.substring(1,x.length-1).split(','))
    // Convert to integers
    return pairList.map(x => x.map(y => parseInt(y)))
}


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
            mySound: 'sound not ready',
            selection: 0,
            counter: 0,
            maxRounds: 10,
            mode: "wait",
            activePair: {items: []},
            items: [],
        };
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
        
        var textList = ["placeholder", "more placeholder"];  
        // If the data has been returned:
        if (!this.props.pairs.loading) {
            var pairString = this.props.pairs.contrastWithPairsNodes.nodes[0].pairs;
            textList = parsePairs(pairString)[0]
        }
        
        var itemText = "another placeholder"
        if (!this.props.items.loading) {
            itemText = this.props.items.itemWithAudioNodes.nodes[1].audio
        }
        
        return (
            <div id="arena">
                <p id='arenaMessage' style={{color: 'darkkhaki'}}>{(this.state.counter === this.state.maxRounds) ? "CONGRATULATIONS! You did it!" : "This is the arena."}</p>
                {/*<img className={starClass} src={this.data.starImage} alt='star' /> */}
                
                <ProgressBar style={{ width: ( (this.state.counter/this.state.maxRounds) *100 ).toString() + "%", borderRadius: "20px", transitionDuration: "0.5s" }} />

                <Button disabled={buttonDisabled} handle={this.handleProgressClick} />
                
                
                <p>{itemText}</p>
                
                {/* Buttons for choosing options */}
                <div id='optionContainer' className="container">
                    {/*
                    {this.state.activePair.items.map(function(c) {
                        return <WordOption
                                word={c.text}
                                key={c.text}
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


/* The 'connect' function will create a wrapper for a class,
 * which makes queries to the database and passes the results as props.
 * We must provide a function that defines the queries.
 */

function mapQueriesToProps({ ownProps, state }) {

    return {
        pairs: {
            query: gql`query MyQuery($orderBy: ContrastWithPairsOrdering) {contrastWithPairsNodes(orderBy: $orderBy) {
                nodes {
                    language
                    name
                    pairs
                }
            }}`,
            variables: {
                orderBy: 'ROW_ID'
            }
        },
        items: {
            query: gql`query MyQuery($orderBy: ItemWithAudioOrdering) {itemWithAudioNodes (orderBy: $orderBy) {
                nodes {
                	rowId
                	language
                	homophones
                	audio
                }
            }}`,
            variables: {
        	    orderBy: 'ROW_ID'
            }
        }
    }
};

export default connect({mapQueriesToProps})(Arena)