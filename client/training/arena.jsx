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
            counter: 0,
            maxRounds: 10,
            mode: "wait",
            correctAnswer: Math.round(Math.random()),
            currentAudio: null,
            textList: ["placeholder", "more placeholder"]
        };
    },
    
    // After the user chooses an option during training
    onWordChosen() {
        this.setState({
            mode: "feedback",
            counter: (this.state.counter < this.state.maxRounds) ? this.state.counter +1 : this.state.maxRounds,
            correctAnswer: Math.round(Math.random())
        });
    },
    
    // After the user wants move on to the next recording
    handleProgressClick() {
        /* OLD
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
        */

        // If the data has been returned:
        if (!this.props.pairs.loading) {
            /* Get all the pairs for a given contrast. Select a pair randomly.
             * Take a homophone of each item in the pair, to use as a label for the WordOption buttons.
             * Take an audio file corresponding to the correct item. Play it, and save it in state for potential replays.
            */
            var pairString = this.props.pairs.contrastWithPairsNodes.nodes[0].pairs;
            var pairIds = parsePairs(pairString)[0]; // a list two-element lists of ids of items for the given pair
            var randomPair = pairIds[Math.floor(Math.random() * pairIds.length)];  // a single pair (list) of two ids, corresponding to the items in the given pair
            
            // play the new sound
            var currentAudio = this.props.items.itemWithAudioNodes.nodes[randomPair[this.state.correctAnswer]-1];
            console.log("Here is pairIds: " + pairIds);
            console.log(typeof pairIds);
            console.log("Here is currentAudio: " + currentAudio);
            var snd = new Audio(currentAudio);
            snd.play();
            
            // in textList and currentAudio, need to subtract 1 from index, as GraphQL is 1-indexed, but JavaScript is 0-indexed
            this.setState({
                mode: "ask",
                currentAudio: currentAudio,
                textList: [this.props.items.itemWithAudioNodes.nodes[randomPair[0]-1].homophones[0],
                        this.props.items.itemWithAudioNodes.nodes[randomPair[1]-1].homophones[0]
                        ]
            });
        }
        else {
            // throw some sort of error...?
        }
    },
    
    render() {
        //var buttonDisabled = true; // <-- placeholder while below is commented out
        
        var buttonDisabled = ((this.state.mode!=="feedback" && this.state.mode!=="wait") || this.state.counter === this.state.maxRounds) ? true : false;
        var starClass = (this.state.counter < this.state.maxRounds) ? 'offStar' : 'onStar';
        if (this.state.counter === this.state.maxRounds) {
            var snd = new Audio(this.data.tadaSound);
            snd.play()
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
                                key={c.text}
                                feedback={c.correct ? "Correct!" : "Wrong!"}
                                callbackParent={this.onWordChosen}
                                mode={this.state.mode} />
                    }, this)}
                    */}
                    {
                        this.state.textList.map(function(c,index) {
                            return <WordOption
                                word={c}
                                key={index}
                                feedback={index === this.state.correctAnswer ? "Correct!" : "Oops! Try again!"}
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