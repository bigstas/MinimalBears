import { Navigation, Link } from 'react-router'
import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

function validateEmail(email) {
    /* A regexp to check that an email address is in the form anyString@anyString.anyString
     */
    const re = /\S+@\S+\.\S+/
    return re.test(email)
}

const AuthJoinPage = React.createClass({
    getInitialState() {
        return {
            emailValue: "type your email address here",
            passwordValue: "***",
            confirmPassword: "###",
            emailError: false,
            passwordError: false
        }
    },
    
    handleChange(event) {
        let field = event.target.name
        //console.log("event.target.name : " + event.target.name)   // for debugging
        if      (field === "email")    { this.setState({emailValue:    event.target.value}) }
        else if (field === "password") { this.setState({passwordValue: event.target.value}) }
        else if (field === "confirmPassword") { this.setState({confirmPassword: event.target.value}) }
        else {alert ("something is wrong")}
    },
    
    handleSubmit(event) {
        /* If the email is not a valid expression (according to regexp above), shows an error in red text on the page.
         * If password does not match confirmed password, shows a similar error.
         * Otherwise, do something with the email and password values.
         */
        event.preventDefault()  // stops the page from reloading
        let errors = {passwordClash: this.state.passwordValue !== this.state.confirmPassword,
                     emailFail: !validateEmail(this.state.emailValue)}
        this.setState({
            emailError: errors.emailFail,
            passwordError: errors.passwordClash
        })
        if (!errors.passwordClash && !errors.emailFail) {
            // Connect to the server to create a new account
            this.props.signup({variables: {input: {email: this.state.emailValue, password: this.state.passwordValue}}}).then((response) => {
                const newUserId = response.data.signup.integer
                console.log(newUserId)
                // TODO log in and change page
                alert('New user created with id ' + newUserId)
            }).catch((error) => {
                // TODO translate these messages
                if (error.networkError) {
                    alert('We cannot connect to the server! Sadbearface.')
                } else {
                    // Apart from network errors, the only error we would expect is a duplicate email address
                    alert('Have you already registered this email address? Please log in!')  // TODO add link
                    // The human-readable Postgres error message will be under error.graphQLErrors[0].message
                }
            })
        }
    },
    
    render() {
        return (
            <div className='panel page-auth'>
                <div>
                    <div>
                        <h1>Join.</h1>
                        <p>
                            Joining allows you to keep track of your progress, contribute recordings, and receive suggestions for what you should practise next.
                        </p>

                        <form onSubmit={ this.onSubmit }>
                            <p className={this.state.emailError ? "authErrorMsg" : "noDisplay"}>Please provide a valid email address.</p>
                            Email: <input type="text" name="email" value={this.state.emailValue} onChange={this.handleChange} /> <br/>
                            <p className={this.state.passwordError ? "authErrorMsg" : "noDisplay"}>Your password must be the same in both fields.</p>
                            Password: <input type="text" name="password" value={this.state.passwordValue} onChange={this.handleChange} /> <br/>
                            Confirm password: <input type="text" name="confirmPassword" value={this.state.confirmPasswordValue} onChange={this.handleChange} /> <br/>
            
                            <button onClick={this.handleSubmit} >
                                Join Now
                            </button>
                        </form>
                    </div>

                    <Link to="login" >
                        Have an account? Log in.
                    </Link>
                </div>
            </div>
        )
    }
})

const signup = gql`mutation ($input: SignupInput!) {
    signup(input:$input) {
        integer
    }
}` // "integer" is the id of the new row

// Variables must be defined when the function is called
const signupConfig = {
    name: 'signup'
}

export default graphql(signup, signupConfig)(AuthJoinPage)