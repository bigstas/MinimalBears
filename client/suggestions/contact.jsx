import React from 'react'
import { Link } from 'react-router'
import Translate from 'react-translate-component'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const Contact = React.createClass({
    getInitialState() {
        return ({
            topic: null,
            message: ""
        })
    },
    
    onWrite(event) {
        this.setState({
            message: event.target.value
        })
    },
    
    onChooseTopic(event) {
        this.setState({
            topic: event.target.value
        })
    },
    
    submit() {
        if (this.state.topic !== null && this.state.message !== "") {
            this.props.messageMutation({
                    variables: {
                        input: { 
                            message: this.state.message,
                            topic: this.state.topic
            }}}).then( (response) => {
                    console.log('message submitted to the database')
                    console.log(response)
                    alert("Your message has been submitted!")
            }).catch( (error) => {
                    console.log('message submission error')
                    console.log(error)
                    alert("There has been an error, and we have not been able to process your message. Please try again later.")
            })
        }
    },
    
    render() {
        let btnClass = "authbtn"
        if (this.state.topic === null || this.state.message === "") {
            // button is inactive
            btnClass += " transparent"
        }
        
        return (
            <div className='panel animated fadeIn' id='contact'>
                <h1>Contact Us</h1>
                <select onChange={this.onChooseTopic}>
                    <option value={null}>Select topic...</option>
                    <option value="bug">Bug report</option>
                    <option value="feature">Feature request</option>
                    <option value="other">Other</option>
                </select>
                <textarea style={{width: "100%", marginTop: "10px"}} name="text" cols="40" rows="8" placeholder="Your message here" onChange={this.onWrite} />
                <div className={btnClass} onClick={this.submit}>Submit</div>
            </div>
        )
    }
})

const messageMutation = gql`mutation ($input: SendMessageInput!) {
  sendMessage (input: $input) {
    clientMutationId
  }
}` // what is clientMutationId supposed to be?

const messageMutationConfig = {
    name: 'messageMutation' // variables defined elsewhere, don't need to be defined here
}

export default graphql(messageMutation, messageMutationConfig)(Contact)