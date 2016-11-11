// Arena object and children for 'Train' page
// Star image by Yellowicon (licence: GNU/GPL)
// Ta Da sound recorded by Mike Koenig (license: Attribution 3.0)

import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'

// new gql way of getting data...
import { connect } from 'react-apollo'
import gql from 'graphql-tag'

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

function random(myArray) {
    var rand = myArray[Math.floor(Math.random() * myArray.length)]
    return rand
}

// Progress bar
var ProgressBar = React.createClass({
    render() {
        return (
            <div id="progress">
                <div id="fill" style={this.props.style}></div>
            </div>
        )
    }
})

// Progress button
var Button = React.createClass({
    render() {
        // Uses CSS animate.css library. Syntax is:
        // className={'someClass otherClass classesThatHaveNothingToDoWithTheLibrary animated classThatTellsYouWhichWayYouWantToAnimateFromTheLibrary'}
        var btnClass = 'enabledProgress animated rubberBand'
        var click = this.props.handle
        if (this.props.disabled) {
            btnClass = 'disabledProgress'
            click = function () {} // click doesn't do anything when it's disabled
        }
        return (
            <div id="button" className={btnClass} onClick={click}>Progress</div>
        )
    }
})

// Button for responding to a recording
var WordOption = React.createClass({ 
    handleClick() {
        if (this.props.mode === "ask") {
            this.props.callbackParent() // you only want things to happen in 'ask' mode, as outside of that mode these buttons shouldn't do anything
        }
    },
    
    render() {
        //var background = (this.props.mode === "feedback")
            //? (this.props.correct) ? "green" : "white"
            //: "#b0b0e0" 
        //var text = (this.props.mode === "feedback") ? this.props.feedback : this.props.word
        //var wordOptionClass = (this.props.mode === "ask" ? 'wordOption wordOptionActive animated pulse' : 'wordOption')
        var text = ""
        var id = ""
        var wordOptionClass = "wordOption"
        if (this.props.mode === "feedback") {
            if (this.props.chosen) {
                if (this.props.correct) {
                    text = "Correct!"
                    id = "wordOptionCorrect"
                } else {
                    text = "Oops! Try again!"
                    id = "wordOptionWrong"
                }
            } else {
                id = "wordOptionNotChosen"
            }
        } else {
            text = this.props.word
            wordOptionClass += " animated pulse"
        }
        
        return (
            <div 
            id={id}
            className={wordOptionClass}
            onClick={this.handleClick}>
                {text}
            </div>
        )
    }
})


// The arena - where the action happens  
Arena = React.createClass({
    getInitialState() {
        return {
            counter: 0,
            maxRounds: 10,
            score: 0,
            mode: "wait",
            correctAnswer: Math.round(Math.random()),
            chosenWord: null,
            currentAudio: null,
            textList: ["placeholder", "more placeholder"]
        }
    },
    
    // After the user chooses an option during training
    onWordChosen(chosenIndex) {
        this.setState({
            mode: "feedback",
            chosenWord: chosenIndex,
            score: (this.state.correctAnswer === chosenIndex) ? this.state.score +1 : this.state.score,
            counter: (this.state.counter < this.state.maxRounds) ? this.state.counter +1 : this.state.maxRounds
        })
        if (chosenIndex === this.state.correctAnswer) {
            var snd = new Audio("correct bell short.wav")
            snd.play()
        } else {
            var snd = new Audio("quack wrong.wav")
            snd.play()
        }
    },
    
    // After the user wants move on to the next recording
    handleProgressClick() {
        // If the data has been returned:
        if (!this.props.pairs.loading && !this.props.items.loading) {
            /* Get all the pairs for a given contrast. Select a pair randomly.
             * Take a homophone of each item in the pair, to use as a label for the WordOption buttons.
             * Take an audio file corresponding to the correct item. Play it, and save it in state for potential replays.
             */
            var correctAnswer = Math.round(Math.random()) // randomly either 0 or 1
            // in nodes, need to subtract 1 from index, as GraphQL is 1-indexed, but JavaScript is 0-indexed
            // fetch all the pairs
            var pairString = this.props.pairs.contrastWithPairsNodes.nodes[this.props.activeContrastId-1].pairs
            // randomly select a single pair (list) of two ids, corresponding to the items in the given pair
            var pairIds = random(parsePairs(pairString))
            
            var items = this.props.items.itemWithAudioNodes.nodes
            var currentAudio = random(items[pairIds[correctAnswer]-1].audio) 
            var snd = new Audio(currentAudio)
            snd.play()
            
            this.setState({
                mode: "ask",
                currentAudio: currentAudio,
                textList: [items[pairIds[0]-1].homophones[0],  // Choose the first homophone (which is less ambiguous) --- TO BE AMENDED to choose a random homophone
                           items[pairIds[1]-1].homophones[0]],
                correctAnswer: correctAnswer
            })
        }
        else {
            // throw some sort of error...?
        }
    },
    
    render() {
        
        var buttonDisabled = ((this.state.mode!=="feedback" && this.state.mode!=="wait") || this.state.counter === this.state.maxRounds) ? true : false
        var starClass = (this.state.counter < this.state.maxRounds) ? 'offStar' : 'onStar'
        /* Trumpet at the end of training. To be fixed.
        if (this.state.counter === this.state.maxRounds) {
            var snd = new Audio(this.data.tadaSound) // TO BE AMENDED - no more this.data
            snd.play()
        }
        */
        
        return (
            <div id="arena">
                {(this.state.counter === this.state.maxRounds) ? 
                    <p id='arenaMessage'>CONGRATULATIONS! You did it!</p> : 
                    <p>Guess the words. Score: {this.state.score}/{this.state.counter}</p> }
                {/*<img className={starClass} src={this.data.starImage} alt='star' /> */}
                
                <ProgressBar style={{ width: ( (this.state.counter/this.state.maxRounds) *100 ).toString() + "%", borderRadius: "20px", transitionDuration: "0.5s" }} />

                <Button disabled={buttonDisabled} handle={this.handleProgressClick} />
                
                {/* Buttons for choosing options */}
                <div id='optionContainer' className="container">
                    {(this.state.mode === "ask" || this.state.mode === "feedback") ?
                        this.state.textList.map(function(c,index) {
                            return <WordOption
                                correct={index===this.state.correctAnswer ? true : false}
                                chosen={index===this.state.chosenWord ? true : false}
                                word={c}
                                key={index}
                                callbackParent={this.onWordChosen.bind(this, index)}
                                mode={this.state.mode} />
                        }, this) :
                        <div>{/*empty div*/}</div>
                    }
                </div>
            </div> 
        )
    }
})


/* The 'connect' function will create a wrapper for a class,
 * which makes queries to the database and passes the results as props.
 * We must provide a function that defines the queries.
 */

function mapQueriesToProps({ ownProps, state }) {

    return {
        pairs: {
            query: gql`query ($orderBy: ContrastWithPairsOrdering) {
            	contrastWithPairsNodes(orderBy: $orderBy) {
                	nodes {
                    	language
                    	name
                    	pairs
                	}
            	}
        	}`,
            variables: {
                orderBy: 'ROW_ID'
            }
        },
        items: {
            query: gql`query ($orderBy: ItemWithAudioOrdering) {
	            itemWithAudioNodes (orderBy: $orderBy) {
	                nodes {
	                	rowId
	                	language
	                	homophones
	                	audio
	                }
	            }
        	}`,
            variables: {
        	    orderBy: 'ROW_ID'
            }
        }
    }
}

export default connect({mapQueriesToProps})(Arena)