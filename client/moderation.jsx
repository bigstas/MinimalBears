import React from 'react'
    
ModerationPage = React.createClass({
    getInitialState() {
        // TODO: change to props in future
        return {
            words: ['words', 'stuff', 'more words']
        }
    },
    
    playAudio() {
        alert("This doesn't do anything yet.")
    },
    
    handleCheck(event, accept) {
        /* When ticking a box, add that index to the array this.state.checked.
         * When unticking a box, remove that index from the array this.state.checked.
        
        console.log(event.target.checked ? "Checkbox on" : "Checkbox off")
        let id = event.target.id.substring(4)   // id of the checkbox
        console.log(id)
        id = parseInt(id) // turns to an int
        
        if (event.target.checked) {
            this.setState((prevState) => ({
                checked: prevState.checked.concat([id])
            }))
        }
        else {
            const index = this.state.checked.indexOf(id)
            this.setState({
                checked: this.state.checked.filter((_, i) => i !== index)
            })
        } */
        let id = event.target.id.substring(6)
        console.log(id)
    },
    
    deleteAudio() {
        const checklist = this.state.checked
        this.setState({
            words: this.state.words.filter((_, i) => checklist.indexOf(i) === -1 ),
            checked: []
        })
    },
   
    confirmSelection() {
        alert("lkjsdlfkjsdlfkj")
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
                            <input type="radio" id={"accept" + (2*index)  .toString()} name="decision" onChange={this.handleCheck} />
                            <input type="radio" id={"reject" + (2*index+1).toString()} name="decision" onChange={this.handleCheck} />
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