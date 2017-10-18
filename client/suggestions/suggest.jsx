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
    render() {
        return (
            <div>
                <input style={{display: "inline"}}></input><p style={{display: "inline"}}> vs </p><input style={{display: "inline"}}></input>
            </div>
        )
    }
})

        
const SuggestContrasts = React.createClass({
    submitContrasts() {
        // TO DO: this should submit the example word pairs into a table in the database.
        
        alert("Thank you for your submission!")
    },
    
    render() {
        if (this.props.data.loading) { return <LoadingPage /> }
        
        const options = this.props.data.allLanguages.nodes.map((c, index) => (c.name))
        console.log(options)
        //["English", "German", "Polish"]
        
        return (
            <div className='panel' id='suggestContrasts'>
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
                <InputContrasts />
                <InputContrasts />
                <InputContrasts />                     
                <div className="authbtn" onClick={this.submitContrasts}>Submit</div>
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

const SuggestWordPairs = React.createClass({
    render() {
        return (
            <div className='panel' id='suggestWordPairs'>
                <h2>Suggest Word Pairs</h2>
            </div>
        )
    }
})

const ConnectedContrastSuggestion = graphql(languageQuery)(SuggestContrasts)

export { SuggestSelector, ConnectedContrastSuggestion, SuggestWordPairs }