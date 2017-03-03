// Arena object and children for 'Train' page
// Star image by Yellowicon (licence: GNU/GPL)
// Ta Da sound recorded by Mike Koenig (license: Attribution 3.0)

import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import key from 'keymaster'
import Translate from 'react-translate-component'

// new gql way of getting data...
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'


function random(myArray) {
    var rand = myArray[Math.floor(Math.random() * myArray.length)]
    return rand
}

// Progress bar
var ProgressBar = React.createClass({
    render() {
        return (
            <div id="progressBar">
                <div id="progressBarFillFluid" style={this.props.style}></div>
            </div>
        )
    }
})

// Progress button
var ProgressButton = React.createClass({
    
    render() {
        // Uses CSS animate.css library. Syntax is:
        // className={'someClass otherClass classesThatHaveNothingToDoWithTheLibrary animated classThatTellsYouWhichWayYouWantToAnimateFromTheLibrary'}
        let btnClass = 'button animated rubberBand' // could do styling depending on mode if we want
        let label
        if      (this.props.mode === "wait")     { label = "train.progressLabel.begin" }
        else if (this.props.mode === "ask")      { label = "train.progressLabel.playAgain" }
        else if (this.props.mode === "feedback") { label = "train.progressLabel.next" }
        else if (this.props.mode === "done")     { label = "train.progressLabel.goAgain" }
        return (
            <div id='progressButton' className={btnClass} onClick={this.props.handle}><Translate content={label} /></div>
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
        var useTranslate = true
        var wordOptionClass = "button wordOption"
        if (this.props.mode === "feedback") {
            wordOptionClass += " defaultCursor"
            if (this.props.chosen) {
                if (this.props.correct) {
                    text = "train.correct"
                    id = "wordOptionCorrect"
                } else {
                    text = "train.wrong"
                    id = "wordOptionWrong"
                }
            } else {
                id = "wordOptionNotChosen"
            }
        } else {
            useTranslate = false
            text = this.props.word
            wordOptionClass += " animated pulse"
        }
        
        return (
            <div 
            id={id}
            className={wordOptionClass}
            onClick={this.handleClick}>
                {useTranslate ? 
                    <Translate content={text} /> :
                    text
                }
            </div>
        )
    }
})

// The arena - where the action happens  
Arena = React.createClass({
    getInitialState() {
        return {
            counter: 0,
            maxRounds: 10,   // this number is set low during development - it should be increased for release
            score: 0,
            mode: "wait",   // possible modes are "wait", "feedback", "ask", "done"
            correctAnswer: Math.round(Math.random()),
            chosenWord: null,
            currentAudio: null,
            textList: ["placeholder", "more placeholder"]
        }
    },
    
    // After the user chooses an option during training
    onWordChosen(chosenIndex) {
        /* Handle the event of somebody clicking on one of the word buttons.
         * Add to the counter (and maybe score), visual feedback (button changes colour), auditory feedback (bell or quack).
         */
        // this event can only fire if you are asking for a response from the user
        if (this.state.mode === 'ask') {
            this.setState({
                mode: (this.state.counter < this.state.maxRounds -1) ? "feedback" : "done",
                chosenWord: chosenIndex,
                score: (this.state.correctAnswer === chosenIndex) ? this.state.score +1 : this.state.score,
                counter: (this.state.counter < this.state.maxRounds) ? this.state.counter +1 : this.state.maxRounds,
            })
            if (chosenIndex === this.state.correctAnswer) {
                var snd = new Audio("correct bell short.wav")
                snd.play()
            } else {
                var snd = new Audio("quack wrong.wav")
                snd.play()
            }
        }
    },
    
    handleProgressClick() {
        /* This method is what happens when the user presses the central "progress" button.
         * It either moves on to a new pair and plays a new sound; or it replays the current sound; or it starts from the beginning, depending on the current state.
         */
        // In "feedback" and "wait" mode, pressing the button should load a new pair and play a new sound
        if (this.state.mode === "wait" || this.state.mode === "feedback" || this.state.mode === "done") {
            // If the data has been returned:
            if (!this.props.pairs.loading && !this.props.items.loading) {
                /* Get all the pairs for a given contrast. Select a pair randomly.
                 * Take a homophone of each item in the pair, to use as a label for the WordOption buttons.
                 * Take an audio file corresponding to the correct item. Play it, and save it in state for potential replays.
                 */
                const correctAnswer = Math.round(Math.random()) // randomly either 0 or 1
                const correctProperty = correctAnswer ? "second" : "first"
                // in nodes, need to subtract 1 from index, as GraphQL is 1-indexed, but JavaScript is 0-indexed
                // fetch all the pairs
                const pairArray = this.props.pairs.allContrastWithPairs.nodes[this.props.activeContrastId-1].pairs
                // randomly select a single pair (list) of two ids, corresponding to the items in the given pair
                const pair = random(pairArray)

                const items = this.props.items.allItemWithAudios.nodes
                const currentAudio = random(items[pair[correctProperty]-1].audioList) 
                const snd = new Audio(currentAudio)
                snd.play()
                
                this.setState({
                    mode: "ask",
                    currentAudio: currentAudio,
                    textList: [items[pair.first-1].homophones[0],  // Choose the first homophone (which is less ambiguous) --- TO BE AMENDED to choose a random homophone
                               items[pair.second-1].homophones[0]],
                    correctAnswer: correctAnswer
                })
                
                // if we're in "done" mode, we also need to reset some things
                if (this.state.mode === "done") {
                    this.setState({
                        counter: 0,
                        score: 0
                    })
                }
            }
        }
        else if (this.state.mode === "ask") {
            // replay the current sound
            let snd = new Audio (this.state.currentAudio)
            snd.play()
        }
        else {
            // throw some sort of error...?
        }
    },
    
    render() {
        var starClass = (this.state.counter < this.state.maxRounds) ? 'offStar' : 'onStar'
        /* Trumpet at the end of training. To be fixed.
        if (this.state.counter === this.state.maxRounds) {
            var snd = new Audio(this.data.tadaSound) // TO BE AMENDED - no more this.data
            snd.play()
        }
        */
        
        return (
            <div className='panel animated fadeIn' id='arena'>
                {(this.state.mode === "done") ? 
                    <h1 id='arenaMessage'>Bravo! You scored {this.state.score} out of 10!</h1> : 
                    <div><h1 className='score'><Translate content="train.score" /></h1><h1 className='score' id='scoreValue'>{this.state.score}</h1><h1 className='score'>/{this.state.counter}</h1></div> }
                {/*<img className={starClass} src={this.data.starImage} alt='star' /> */}
                
                <ProgressBar style={{ width: ( (this.state.counter/this.state.maxRounds) *100 ).toString() + "%", borderRadius: "20px", transitionDuration: "0.5s" }} />

                <ProgressButton  mode={this.state.mode} handle={this.handleProgressClick} />
                          
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
    }, 
        
    componentDidMount() {
        /* Keypress events:
         * Space - press central "progress" button; 1 & 2 - Word Option buttons 0 & 1
         * BUG: When you get to the end of training with the keyboard, then it doesn't set the score back down to 0. It does when you use mouse.
         * 2nd BUG: Two sounds play at the same time when you press space. Very strange.
         */
        key('1', this.onWordChosen.bind(this, 0))
        key('2', this.onWordChosen.bind(this, 1))
        key('space', this.handleProgressClick)  // check bug in docstring
        
    }
})


/* The 'graphql' function will create a wrapper for a class,
 * which makes queries to the database and passes the results as props.
 * We must provide a function that defines the queries.
 */

const pairQuery = gql`query ($orderBy: ContrastWithPairsOrderBy) {
	allContrastWithPairs(orderBy: $orderBy) {
    	nodes {
        	language
        	name
        	pairs {
                first
                second
        	}
    	}
	}
}`

const pairQueryConfig = {
    name: 'pairs',
    options: {
        variables: {
            orderBy: 'ID_ASC'
        }
    }
}

const itemQuery = gql`query ($orderBy: ItemWithAudiosOrderBy) {
    allItemWithAudios (orderBy: $orderBy) {
        nodes {
        	id
        	language
        	homophones
        	audioList
        }
    }
}`

const itemQueryConfig = {
    name: 'items',
    options: {
        variables: {
    	    orderBy: 'ID_ASC'
        }
    }
}

export default compose(
    graphql(pairQuery, pairQueryConfig),
    graphql(itemQuery, itemQueryConfig)
)(Arena)