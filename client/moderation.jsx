import React from 'react'
import update from 'immutability-helper'
    
ModerationPage = React.createClass({
    getInitialState() {
        // TODO: change words to props in future
        return {
            words: ['words', 'stuff', 'more words'],    // words to moderate
            radiobuttonStatus: [null, null, null]       // accepted - true; rejected - false; no decision - null
        }
    },
    
    playAudio() {
        alert("This doesn't do anything yet.")
    },
    
    handleCheck(index, accept) {
        console.log(index.toString())
        this.setState({
            radiobuttonStatus: update(this.state.radiobuttonStatus, {[index]: {$set: accept }})
        })
    },
   
    confirmSelection() {
        let message
        if (this.state.radiobuttonStatus.indexOf(null) === -1) { message = "Here are the things you chose: " + this.state.radiobuttonStatus.toString() } 
        else { message = "Please ensure you have made a decision about every word before submitting." }
        alert(message)
    },
    
    loadMoreWords() {
        alert("This is supposed to load more words.")
    },
    
    render() {
        const displaying = "Displaying " + this.state.words.length.toString() + " audio files out of " + this.state.words.length.toString() + " available files."
        
        return(
            <div className='panel' id='loading'>
                <h2>Minimal Bears audio moderation page</h2>
                {this.state.words.map((c, index) => (
                    <div key={c}>
                        <form action="">
                            <input type="radio" id={"accept" + (2*index)  .toString()} name="decision" onChange={this.handleCheck.bind(this, index, true)} />
                            <input type="radio" id={"reject" + (2*index+1).toString()} name="decision" onChange={this.handleCheck.bind(this, index, false)} />
                            <p style={{display: "inline"}}>{c}</p>
                            <button type='button' onClick={this.playAudio}>Play</button>
                        </form>
                    </div>
                )
                )}
                <button type='button' onClick={this.confirmSelection}>Confirm Selection</button>
                <button type='button' onClick={this.loadMoreWords} disabled={!!this.state.words.length}>Load more words</button>
                <p>{displaying}</p>
            </div>
        )
    }
})

export default ModerationPage