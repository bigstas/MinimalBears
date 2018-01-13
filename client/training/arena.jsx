// Arena object and children for 'Train' page
// Star image by Yellowicon (licence: GNU/GPL)
// Ta Da sound recorded by Mike Koenig (license: Attribution 3.0)

import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import key from 'keymaster'
import Translate from 'react-translate-component'
import DonePanel from './donepanel'

// new gql way of getting data...
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

// random function not used in this file anymore as the random selection is done on the server. TODO - Remove this function?
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


// The arena - where the action happens  
const Arena = React.createClass({
    getInitialState() {
        return {
            counter: 0,
            maxRounds: 2,   // this number is set low during development - it should be increased for release
            score: 0,
            mode: "wait",   // possible modes are "wait", "feedback", "ask", "done", and "restart"
            correctAnswer: null,
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
            // TODO save result in database
        }
    },
    
    handleProgressClick() {
        /* This method is what happens when the user presses the central "progress" button.
         * It either moves on to a new pair and plays a new sound; or it replays the current sound; or it starts from the beginning, depending on the current state.
         */
        // In "feedback" and "wait" mode, pressing the button should load a new pair and play a new sound
        if (this.state.mode === "wait" || this.state.mode === "feedback" || this.state.mode === "restart") {
            // If the data has been returned:
            if (!this.props.questions.loading) { // TODO move this check earlier on; it shouldn't be possible to click the button when there's no data
                /* Get all the pairs for a given contrast. Select a pair randomly.
                 * Take a homophone of each item in the pair, to use as a label for the WordOption buttons.
                 * Take an audio file corresponding to the correct item. Play it, and save it in state for potential replays.
                 */
                
                const currentQuestion = this.props.questions.getQuestions.nodes[this.state.counter]
                const snd = new Audio(currentQuestion.file)
                snd.play()
                
                this.setState({
                    mode: "ask",
                    currentAudio: currentQuestion.file,
                    textList: [currentQuestion.first,
                               currentQuestion.second],
                    correctAnswer: currentQuestion.correct
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
    },  // TODO do we need this mode?
    
    render() {
        if (this.state.mode === "restart") {
            const snd = new Audio("Ta Da quieter.wav")
            snd.play()
            
            return <DonePanel handleClick={this.handleProgressClick} 
                       loggedIn={!!this.props.username}
                       score={100*this.state.score/this.state.maxRounds}
                       activeContrastId={this.props.activeContrastId}
                       average="80" /> 
            /* TODO - average should actually refer to some statistic */
        } else {
            if (this.state.mode === "done") {
                setTimeout(this.restart, 1500) // wait for a moment before showing the results page
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
        /* Keypress events: TODO
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

const questionQuery = gql`query($contrastId:Int) {
    getQuestions(contrastId:$contrastId, number: 10) {
        nodes {
          pair
          first
          second
          file
          correct
        }
    }
}`

const questionQueryConfig = {
    name: 'questions',
    options: (ownProps) => ({
        variables: {
            contrastId: ownProps.activeContrastId
        }
    })
}

export default graphql(questionQuery, questionQueryConfig)(Arena)