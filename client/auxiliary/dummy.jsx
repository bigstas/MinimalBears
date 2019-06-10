import React from 'react'
import { graphql } from 'react-apollo'

import { submitAudioMutation } from '/lib/graphql'

function sum(a,b) {
    return a + b
}
    
// A dummy class for testing during development

class MyClass extends React.Component {
    
    doStuff() {
        const thing = {file: "1", speaker: "Guido", item: 16}
        this.props.audioMutation({variables: {input: thing}})
        console.log('done!')
    }
    
    render() {
        // As the props come from an asynchronous query, we cannot assume everything is there
        // If the data has not been returned yet:
        var text = "placeholder"  
        // If the data has been returned:
        /*
        if (!this.props.data.loading) {
            text = this.props.data.getCurrentUser.output
            //text = this.props.data.authenticate
        }*/
        // Render either way:
        return <button onClick={this.doStuff}>Click me!</button>
    }
}

// Wrap the class according to the function
export default graphql(submitAudioMutation, {name: 'audioMutation'})(MyClass)

export { sum }