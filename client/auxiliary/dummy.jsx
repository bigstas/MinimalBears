import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

function sum(a,b) {
    return a + b
}
    
// A dummy class for testing during development

const MyClass = React.createClass({
    
    doStuff() {
        const thing = {file: "1", speaker: "Guido", item: 16}
        this.props.audioMutation({variables: {input: thing}})
        console.log('done!')
    },
    
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
})


const getUser = gql`query {
    getCurrentUser(input: $input) {
        output
    }
}`

const login = gql`query ($email: String!, $password: String!) {
    authenticate(tryEmail: $email, tryPassword: $password)
}`

const audioMutation = gql`mutation ($input: SubmitAudioInput!) {
    submitAudio (input: $input) {
        output
    }
}`

const audioMutationConfig = {
    name: 'audioMutation'
}

// Wrap the class according to the function
export default graphql(audioMutation, audioMutationConfig)(MyClass)

export { sum }