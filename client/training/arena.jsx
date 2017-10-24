// Arena object and children for 'Train' page
// Star image by Yellowicon (licence: GNU/GPL)
// Ta Da sound recorded by Mike Koenig (license: Attribution 3.0)

import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import key from 'keymaster'
import Translate from 'react-translate-component'
import { Link } from 'react-router'

// new gql way of getting data...
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'


function random(myArray) {
    const rand = myArray[Math.floor(Math.random() * myArray.length)]
    return rand
}

// Progress bar
const ProgressBar = React.createClass({
    render() {
        return (
            <div id="progressBar">
                <div id="progressBarFillFluid" style={this.props.style}></div>
            </div>
        )
    }
})

// Progress button
const ProgressButton = React.createClass({
    
    render() {
        // Uses CSS animate.css library. Syntax is:
        // className={'someClass otherClass classesThatHaveNothingToDoWithTheLibrary animated classThatTellsYouWhichWayYouWantToAnimateFromTheLibrary'}
        let btnClass = 'button progressButton animated rubberBand' // could do styling depending on mode if we want
        let label
        if      (this.props.mode === "wait")     { label = "train.progressLabel.begin" }
        else if (this.props.mode === "ask")      { label = "train.progressLabel.playAgain" }
        else if (this.props.mode === "feedback") { label = "train.progressLabel.next" }
        {/*else if (this.props.mode === "done")     { label = "train.progressLabel.goAgain" }*/}
        return (
            <div className={btnClass} onClick={this.props.handle}><Translate content={label} /></div>
        )
    }
})

// Button for responding to a recording
const WordOption = React.createClass({ 
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
        let text = ""
        let id = ""
        let useTranslate = true
        let wordOptionClass = "button wordOption"
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

const DonePanel = React.createClass({
    getInitialState() {
        return { clicked: false }
    },
    
    mustBeLoggedIn() {
        alert("You must be logged in to view stats!")
    },
    
    render() {
        const bearPics = [
            ["bear2.png", "There's no greater power than the power of Hi 5."], 
            ["bear3.png", "Give a bear a fish, and it will be your friend for a day."], 
            ["bear4.png", "Remember to share with your friends!"], 
            ["bear6.png", "Bears never forget!"]
        ]
        const pic = random(bearPics)
        console.log(pic)
        
        const statsButton = (this.props.loggedIn ? 
            <div className="button endButton"><Link className='plainLink' to="/" style={{color: "lightyellow"}}><Translate content={"train.viewStats"} /></Link></div> :
            <div className="button endButton" onClick={this.mustBeLoggedIn}><Translate content={"train.viewStats"} /></div>
        )
        
        return (
            <div className="panel animated fadeIn">
                <img id="endImage" src={pic[0]} />
                <p className="caption"><em>{pic[1]}</em></p>
                <div>
                    <div className="endDiv" id="resultsDiv">
                        <div className="endDiv">
                            <p className="hugeNumberTitle">Your score:</p>
                            <p className="hugeNumber">{this.props.score}%</p>
                        </div>
                        <div className="endDiv">
                            <p className="hugeNumberTitle">Your average:</p>
                            <p className="hugeNumber">{this.props.average}%</p>
                        </div>
                    </div>
                    <div className="endDiv" id="buttonDiv">
                        <div className="button endButton" onClick={this.props.handleClick}>Play again</div>
                        {statsButton}
                    </div>
                </div>
            </div>
        )
    }
})

// The arena - where the action happens  
const Arena = React.createClass({
    getInitialState() {
        return {
            counter: 0,
            maxRounds: 2,   // this number is set low during development - it should be increased for release
            score: 0,
            mode: "wait",   // possible modes are "wait", "feedback", "ask", "done", and "restart"
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
                const snd = new Audio("correct bell short.wav")
                snd.play()
            } else {
                const snd = new Audio("quack wrong quieter.wav")
                snd.play()
            }
        }
    },
    
    handleProgressClick() {
        /* This method is what happens when the user presses the central "progress" button.
         * It either moves on to a new pair and plays a new sound; or it replays the current sound; or it starts from the beginning, depending on the current state.
         */
        // In "feedback" and "wait" mode, pressing the button should load a new pair and play a new sound
        if (this.state.mode === "wait" || this.state.mode === "feedback" || this.state.mode === "restart") {
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
                
                // if we're in "restart" mode, we also need to reset some things
                if (this.state.mode === "restart") {
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
    
    restart() {
        this.setState({ mode: "restart" })
    },
    
    render() {
        if (this.state.mode === "restart") {
            const snd = new Audio("Ta Da quieter.wav")
            snd.play()
            
            return <DonePanel handleClick={this.handleProgressClick} 
                       loggedIn={!!this.props.username}
                       score={100*this.state.score/this.state.maxRounds}
                       average="80" /> 
            /* TO DO - average should actually refer to some statistic */
        } else {
            if (this.state.mode === "done") {
                setTimeout(this.restart, 2000) // wait for a moment before showing the results page
            }
            return (
                <div className='panel animated fadeIn' id='arena'>
                    <div style={{textAlign:"center"}}>
                        <div style={{display:"inline-block"}}>
                            <h1 className='score' id='scoreValue' style={{margin:"20px 0 40px 0"}}>{this.state.score}</h1>
                        </div>
                        <div style={{display:"inline-block"}}>
                            <h4 className='score' style={{display:"inline"}}>/{this.state.maxRounds}</h4>
                        </div>
                    </div>
                    
                    <ProgressBar style={{ width: ( (this.state.counter/this.state.maxRounds) *100 ).toString() + "%", borderRadius: "20px", transitionDuration: "1.5s" }} />
                    
                    {this.state.mode !== "done" ? <ProgressButton  mode={this.state.mode} handle={this.handleProgressClick} /> : <span />}

                    {/* Buttons for choosing options */ }
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