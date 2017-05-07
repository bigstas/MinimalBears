import React from 'react'
import Translate from 'react-translate-component'

const RecordTutorial = React.createClass({
    getInitialState() {
        return {
            tutorialStage: 0
        }
    },
    
    changeStage(direction) {
        let toAdd
        if (direction === "next") {toAdd = 1}
        else if (direction === "previous") {toAdd = -1}
        else { console.log("Improper argument: changeStage has been given an argument other than 'next' or 'previous'.")}
        this.setState({
            tutorialStage: this.state.tutorialStage + toAdd
        })
    },
    
    render() {
        const text1 = <p>Important text</p>
        const text2 = <p>more text</p>
        const tutorialContent = [
            {
                heading: "Record page tutorial",
                p1: "We will explain how the page works.",
                p2: "Hold on tight. It's gonna be a loooong ride."
            },
            {
                heading: "Record button",
                p1: "Press this button to start recording.",
                p2: "After you press it, it will change its label to 'Next'."
            },
            {
                heading: "Now you're ready!",
                p1: "All done! Now you can go and record things.",
                p2: "Thanks so much for contributing to our accent training adventure!"
            }
        ]
        const stage = tutorialContent[this.state.tutorialStage]
        const imageName = "tutorial" + this.state.tutorialStage.toString() + ".png"
        
        if (this.state.tutorialStage >= tutorialContent.length) {
            // This should now move you from the tutorial to the ordinary record page
            alert("Let's go to the record page now!")
        }
        
        return (
            <div className='tutorialPanel'>
                <div className='tutorialText'>
                    <h1>{stage.heading}</h1>
                    <img src={imageName} />
                    <p>{stage.p1}</p>
                    <p>{stage.p2}</p>
                </div>
                {/* Only allow "previous" button after stage 1 */}
                {this.state.tutorialStage > 0 ? <div className="button" onClick={this.changeStage.bind(this, "previous")}>Previous</div> : <span></span>}
                <div className="button" onClick={this.changeStage.bind(this, "next")}>{this.state.tutorialStage >= tutorialContent.length -1 ? "Great!" : "Next"}</div>
            </div>
        )
    },
    
    componentDidMount () {
        // Darken the background
        document.body.style.background = "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/hatter2.png')"
    },
    
    componentWillUnmount () {
        // Lighten the background on exit
        document.body.style.background = "url('/hatter2.png')"
    }
})

export default RecordTutorial