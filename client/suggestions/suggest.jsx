import React from 'react'
import { Selector } from '../training/selector'
import LoadingPage from '../auxiliary/loading'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const SuggestSelector = React.createClass({
    /* The first page that opens when you go to suggest.
     * Asks you to choose between suggesting word pairs and suggesting contrasts.
    */    
    render() {
        const options = [
            {
                id: 0,
                text: "suggest.contrasts"
            },
            {
                id: 1,
                text: "suggest.words"
            }
        ]
        
        return ( <Selector selectionMessage={"suggest.mainMessage"} options={options} callback={this.props.callback} /> )
    }
})

        
const InputContrasts = React.createClass({
    getInitialState() {
        return { 
            word0: "",
            word1: ""
        }
    },
    
    handleChange(event) {
        const field = event.target.name
        if      (field === 'input0') { this.setState({word0: event.target.value}) }
        else if (field === 'input1') { this.setState({word1: event.target.value}) }
        else { /* Throw an error? */ }
    },
    
    render() {
        return (
            <div>
                <input name='input0' style={{display: "inline"}} onChange={this.handleChange}></input><p style={{display: "inline"}}> vs </p><input name='input1' style={{display: "inline"}} onChange={this.handleChange}></input>
            </div>
        )
    }
})

        
const SuggestContrasts = React.createClass({
    getDropdownValue() {
        // Do something!
    },
    
    submitContrasts() {
        // TODO: this should submit the example word pairs into a table in the database.
        let count = 0
        for (let i=0; i<3; i++) {
            const input = this.refs['pair' + count.toString()]
            if (input.state.word0 && input.state.word1 && (input.state.word0 !== input.state.word1) ) { count +=1 }
        }
        if (count === 0 ) { alert ("Please enter at least one pair of words for your suggested new contrast.") }
        else if (count > 0) { alert("Thank you for your submission!") }
        else { /* Throw an error? */ }
    },
    
    render() {
        if (this.props.data.loading) { return <LoadingPage /> }
        
        const options = this.props.data.allLanguages.nodes.map((c, index) => (c.name))
        console.log(options)
        //["English", "German", "Polish"]
        
        return (
            <div className='panel animated fadeIn' id='suggestContrasts'>
                <h2>Suggest contrasts</h2>
                <h4>Select language of new contrast</h4>
                <select onChange={this.getDropdownValue}>
                    {options.map((c, index) => 
                        <option key={index} value={c}>{c}</option>
                    )}
                </select>
                <br /><br />
                <h4>Example word pairs</h4>
                <p>One word pair is enough, but please submit more if you can think of any.</p>
                <p>Example: enter {<em>sheep</em>} in one box and {<em>ship</em>} in the other to highlight the distinction between "ee" and "i". Then you could also add {<em>cheap</em>} and {<em>chip</em>}, and {<em>read</em>} and {<em>rid</em>} as further examples if you happened to think of them. (We already have all those though, so no need to suggest them!)</p>
                <InputContrasts ref='pair0' />
                <InputContrasts ref='pair1' />
                <InputContrasts ref='pair2' />                     
                <div className="authbtn" onClick={this.submitContrasts}>Submit</div>
                <div className="authbtn" onClick={this.props.callback}>Back</div>
            </div>
        )
    }
})

const SuggestWordPairs = React.createClass({
    getDropdownValue() {
        // Do something!
    },
    
    render() {
        if (this.props.data.loading) { return <LoadingPage /> }
        
        const options = this.props.data.allLanguages.nodes.map((c, index) => (c.name))
        
        return (
            <div className='panel animated fadeIn' id='suggestWordPairs'>
                <h2>Suggest Word Pairs</h2>
                <h4>Select language and contrast for new word pairs</h4>
                <select onChange={this.getDropdownValue}>
                    {options.map((c, index) => 
                        <option key={index} value={c}>{c}</option>
                    )}
                </select>
                <div className="authbtn" onClick={this.props.callback}>Back</div>
            </div>
        )
    }
})

const languageQuery = gql`query {
    allLanguages {
        nodes {
            name
            id
        }
    }
}`

const ConnectedContrastSuggestion = graphql(languageQuery)(SuggestContrasts)
const ConnectedWordPairSuggestion = graphql(languageQuery)(SuggestWordPairs)

export { SuggestSelector, ConnectedContrastSuggestion, ConnectedWordPairSuggestion }