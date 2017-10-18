import React from 'react'
import { SuggestSelector, ConnectedContrastSuggestion, SuggestWordPairs } from './suggest'

const SuggestParent = React.createClass({
    getInitialState() {
        return {
            suggestionType: null,
            activeLanguage: null,
            activeContrast: null
        }
    },
    
    setSuggestionType(id) {
        if (id === 0) {
            this.setState({ suggestionType: "Contrast" })
        } else if (id === 1) {
            this.setState({ suggestionType: "Pair" })
        } else { 
            // throw an error...
            const ID = id.toString()
            console.log("WARNING: id value of " + ID + " received, expected 0 or 1. Check the setSuggestionType method in SuggestParent.")
        }
    },
    
    render() {
        if (!this.state.suggestionType) { return <SuggestSelector callback={this.setSuggestionType} /> }
        else if (this.state.suggestionType === "Contrast") { return <ConnectedContrastSuggestion /> }
        else if (this.state.suggestionType === "Pair") { return <SuggestWordPairs /> }
    }
})
   
export default SuggestParent