// Arena object and children for 'Train' page
// Ta Da sound recorded by Mike Koenig (license: Attribution 3.0)
/* Licences:
- incorrect.wav originally called 322931__rhodesmas__incorrect-01.wav, taken from user "rhodesmas" on freesound.org, under Creative Commons Attribution 3.0 Unported Licence; no changes have been made
- correct.wav originally called 322930__rhodesmas__success-03.wav, taken from user "rhodesmas" on freesound.org, under Creative Commons Attribution 3.0 Unported Licence; no changes have been made
- finish.wav originally called 322929__rhodesmas__success-04.wav, taken from user "rhodesmas" on freesound.org, under Creative Commons Attribution 3.0 Unported Licence; no changes have been made
*/
import React from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import Translate from 'react-translate-component'
import DonePanel from './donepanel'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'


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
    },
    
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
    },
    
    showDonePanel() {
        this.setState({ mode: "restart" })
    },
    
    restart() {
        // first, refetch the query for new training examples
        this.props.questions.refetch()
        // then, reset the counter and score
        this.setState({ counter: 0, score: 0 })
        // finally, start up the game again
        this.handleProgressClick()
    },
    
    render() {
        if (this.state.mode === "restart") {
            const snd = new Audio("finish.wav")
            snd.play()
            
            return <DonePanel handleClick={this.restart} 
                       loggedIn={!!this.props.username}
                       score={100*this.state.score/this.state.maxRounds}
                       activeContrastId={this.props.activeContrastId}
                    /> 
        } else {
            if (this.state.mode === "done") {
                setTimeout(this.showDonePanel, 1500) // wait for a moment before showing the results page
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

const statsMutation = gql`mutation ($input: AnswerQuestionInput!) {
    answerQuestion (input: $input) {
        clientMutationId
    }
}` // what is clientMutationId for?

const statsMutationConfig = {
    name: 'statsMutation'
}

export default compose(
    graphql(questionQuery, questionQueryConfig),
    graphql(statsMutation, statsMutationConfig))
(Arena)
//export default graphql(questionQuery, questionQueryConfig)(Arena)