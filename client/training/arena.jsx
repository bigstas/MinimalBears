// Arena object and children for 'Train' page
// Ta Da sound recorded by Mike Koenig (license: Attribution 3.0)
/* Licences:
- incorrect.wav originally called 322931__rhodesmas__incorrect-01.wav, taken from user "rhodesmas" on freesound.org, under Creative Commons Attribution 3.0 Unported Licence; no changes have been made
- correct.wav originally called 322930__rhodesmas__success-03.wav, taken from user "rhodesmas" on freesound.org, under Creative Commons Attribution 3.0 Unported Licence; no changes have been made
- finish.wav originally called 322929__rhodesmas__success-04.wav, taken from user "rhodesmas" on freesound.org, under Creative Commons Attribution 3.0 Unported Licence; no changes have been made
*/
import React from 'react'
import Translate from 'react-translate-component'
import { graphql, compose } from 'react-apollo'

import DonePanel from './donepanel'
import {
    questionQuery,
    answerQuestionMutation,
    itemComplaintMutation,
    pairComplaintMutation,
    audioComplaintMutation
} from '/lib/graphql'

// Progress bar
function ProgressBar(props) {
    return (
        <div id="progressBar">
            <div id="progressBarFillFluid" style={props.style}></div>
        </div>
    )
}

// Progress button
function ProgressButton(props) {
    let btnClass = 'button progressButton animated rubberBand' // could do styling depending on mode if we want
    let label
    if      (props.mode === "wait")     { label = "train.progressLabel.begin" }
    else if (props.mode === "ask")      { label = "train.progressLabel.playAgain" }
    else if (props.mode === "feedback") { label = "train.progressLabel.next" }
    {/*else if (props.mode === "done")     { label = "train.progressLabel.goAgain" }*/}
    return (
        <div className={btnClass} onClick={props.handle}><Translate content={label} /></div>
    )
}

// Button for responding to a recording
class WordOption extends React.Component { 
    handleClick() {
        if (this.props.mode === "ask") {
            this.props.callbackParent() // you only want things to happen in 'ask' mode, as outside of that mode these buttons shouldn't do anything
        }
    }
    
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
            onClick={this.handleClick.bind(this)}>
                {useTranslate ? 
                    <Translate content={text} /> :
                    text
                }
            </div>
        )
    }
}

class FlagDropdown extends React.Component {
    // TODO: make these functions proper, sending mutations to the complaints table
    handleBadAudio() {
        console.log("bad audio")
    }
    handleBadPair() {
        console.log("bad pair")
        this.props.pairComplaint({
            variables: {
                input: {
                    pair: this.props.pairId
                }
            }
        })
    }
    handleBadItem(position) {
        console.log(`bad item on the ${position}`)
        /*
        this.props.itemComplaint({
            variables: {
                input: {
                    item: this.props.itemId
                }
            }
        })*/
    }

    render() {
        return (
            <div className="dropdownDiv" id="flagdropdown" onMouseDown={this.props.onMouseDown} onMouseUp={this.props.onMouseUp}>
                <div>What is the problem?</div>
                <div className="dropdownElement" onClick={this.handleBadAudio.bind(this)}>Flag audio</div>
                <div className="dropdownElement" onClick={this.handleBadPair.bind(this)}>Flag pair: {this.props.leftword}, {this.props.rightword}</div>
                <div className="dropdownElement" onClick={this.handleBadItem.bind(this,'left')}>Flag word: {this.props.leftword}</div>
                <div className="dropdownElement" onClick={this.handleBadItem.bind(this,'right')}>Flag word: {this.props.rightword}</div>
            </div>
        )
    }
}

// problem flagger
class Flagger extends React.Component {
    constructor(props) {
        super(props) // TODO: is this really necessary for this element??
        this.state = {
            dropdown: false,
            mouseIsDownOnDropdown: false
        }
    }

    // TODO: below is repeated code from the Nav -- is there a way to extract this code elsewhere
    // so that the code isn't repeated?
    toggleDropdown() {
        this.setState({ dropdown: !this.state.dropdown })
    }
    componentDidMount() {
        window.addEventListener('mousedown', this.pageClick.bind(this), false)
    }
    componentWillUnmount() {
        window.removeEventListener('mousedown', this.pageClick.bind(this))
    }
    pageClick(e) {
        if (this.state.mouseIsDownOnDropdown) { return } 
        else { this.setState({ dropdown: false }) }
    }
    mouseDownHandler(nextFunction) {
        this.setState({ mouseIsDownOnDropdown: true })
        nextFunction()
    }
    mouseUpHandler() {
    	this.setState({ mouseIsDownOnDropdown: false })
    }

    render() {
        return (
            <div>
                <div id="flagger"
                    onMouseDown={this.mouseDownHandler.bind(this,this.toggleDropdown.bind(this))}
                    onMouseUp={this.mouseUpHandler.bind(this)}>
                        Flag
                </div>
                {this.state.dropdown ? 
                    <FlagDropdown 
                        onMouseDown={this.mouseDownHandler.bind(this,()=>{})}
                        onMouseUp={this.mouseUpHandler.bind(this)}
                        leftword={this.props.leftword} rightword={this.props.rightword}
                        pairId={this.props.pairId}
                    /> : 
                    <span />
                }
            </div>
        )
    }
}

// The arena - where the action happens  
class Arena extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            counter: 0,
            maxRounds: 2,   // this number is set low during development - it should be increased for release
            score: 0,
            mode: "wait",   // possible modes are "wait", "feedback", "ask", "done", and "restart"
            correctAnswer: null,
            chosenWord: null,
            currentAudio: null,
            textList: ["placeholder", "more placeholder"]
        }
    }
    
    // After the user chooses an option during training
    onWordChosen(chosenIndex) {
        /* Handle the event of somebody clicking on one of the word buttons.
         * Add to the counter (and maybe score), visual feedback (button changes colour), auditory feedback (bell or quack).
         */
        // this event can only fire if you are asking for a response from the user
        const correct = (this.state.correctAnswer === chosenIndex)
        if (this.state.mode === 'ask') {
            this.setState({
                mode: (this.state.counter < this.state.maxRounds -1) ? "feedback" : "done",
                chosenWord: chosenIndex,
                score: correct ? this.state.score +1 : this.state.score,
                counter: (this.state.counter < this.state.maxRounds) ? this.state.counter +1 : this.state.maxRounds,
            })
            if (correct) {
                const snd = new Audio("correct.wav")
                snd.play()
            } else {
                const snd = new Audio("incorrect.wav")
                snd.play()
            }
            // send statistic to the database (right or wrong answer, audio, pair, timestamp)
            this.props.statsMutation({
                variables: {
                    input: { 
                        pair: this.props.questions.getQuestions.nodes[this.state.counter].pair,
                        audio: this.state.currentAudio,
                        correct: correct 
            }}}).then( (response) => {
                console.log('answer submitted to database')
                console.log(response)
            }).catch( (error) => {
                console.log('answer submission error')
                console.log(error)
            })
        }
    }
    
    handleProgressClick() {
        /* This method is what happens when the user presses the central "progress" button.
         * It either moves on to a new pair and plays a new sound; or it replays the current sound; or it starts from the beginning, depending on the current state.
         */
        // In "feedback" and "wait" mode, pressing the button should load a new pair and play a new sound
        if (this.state.mode === "wait" || this.state.mode === "feedback" || this.state.mode === "restart") {
            // If the data has been returned:
            if (!this.props.questions.loading) { // TODO move this check earlier on; it shouldn't be possible to click the button when there's no data
            // -- so what should display when there is no data? The loading page?
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
    }
    
    showDonePanel() {
        this.setState({ mode: "restart" })
    }
    
    restart() {
        // first, refetch the query for new training examples
        this.props.questions.refetch()
        // then, reset the counter and score
        this.setState({ counter: 0, score: 0 })
        // finally, start up the game again
        this.handleProgressClick()
    }
    
    render() {
        if (this.state.mode === "restart") {
            const snd = new Audio("finish.wav")
            snd.play()
            
            return <DonePanel handleClick={this.restart.bind(this)}
                       loggedIn={!!this.props.username}
                       score={100*this.state.score/this.state.maxRounds}
                       activeContrastId={this.props.activeContrastId}
                    /> 
        } else {
            if (this.state.mode === "done") {
                setTimeout(this.showDonePanel.bind(this), 1500) // wait for a moment before showing the results page
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
                    
                    {this.state.mode !== "done" ? <ProgressButton  mode={this.state.mode} handle={this.handleProgressClick.bind(this)} /> : <span />}
                    {/* TODO: whether this is on the screen or not should depend on the mode */}
                    {(this.state.mode === "ask" || this.state.mode === "feedback") ?
                        <Flagger 
                            leftword={this.state.textList[0]} rightword={this.state.textList[1]}
                            pairId={this.props.questions.getQuestions.nodes[this.state.counter].pair}
                            /> :
                        <span />
                    }

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
    }
}

const questionQueryConfig = {
    name: 'questions',
    options: (ownProps) => ({
        variables: {
            contrastId: ownProps.activeContrastId
        }
    })
}

export default compose(
    graphql(questionQuery, questionQueryConfig),
    graphql(answerQuestionMutation, {name: 'statsMutation'}),
    graphql(itemComplaintMutation, {name: 'itemComplaint'}),
    graphql(pairComplaintMutation, {name: 'pairComplaint'}),
    graphql(audioComplaintMutation, {name: 'audioComplaint'})
)(Arena)