import React from 'react'
    
EditingPage = React.createClass({
    getInitialState() {
        return {
            words: ['words', 'stuff', 'more words'],
            checked: []
        }
    },
    
    playAudio() {
        alert("This doesn't do anything yet.")
    },
    
    handleCheck(event) {
        /* When ticking a box, add that index to the array this.state.checked.
         * When unticking a box, remove that index from the array this.state.checked.
         */
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
        }
    },
    
    deleteAudio() {
        const checklist = this.state.checked
        this.setState({
            words: this.state.words.filter((_, i) => checklist.indexOf(i) === -1 ),
            checked: []
        })
    },
    
    submitAudio() {
        alert("This is supposed to submit something.")
        this.deleteAudio()
    },
    
    loadMoreWords() {
        alert("This is supposed to load more words.")
    },
    
    render() {
        const displaying = "Displaying " + this.state.words.length.toString() + " audio files out of " + this.state.words.length.toString() + " available files."
        
        return(
            <div className='panel' id='loading'>
                <h2>Minimal Bears audio editing page</h2>
                {this.state.words.map((c, index) => (
                    <div key={c}>
                        <input type="checkbox" id={"cbox" + index.toString()} onChange={this.handleCheck} />
                        <label htmlFor={"cbox" + index.toString()}>{c}</label>
                        <button type='button' onClick={this.playAudio}>Play</button>
                    </div>
                )
                )}
                <button type='button' onClick={this.deleteAudio}>Delete selected</button>
                <button type='button' onClick={this.submitAudio}>Submit selected</button>
                <button type='button' onClick={this.loadMoreWords} disabled={!!this.state.words.length}>Load more words</button>
                <p>{displaying}</p>
            </div>
        )
    }
})

export default EditingPage