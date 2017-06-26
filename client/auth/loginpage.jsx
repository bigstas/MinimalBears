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

const AuthLoginPage = React.createClass({
    getInitialState() {
        return {
            emailValue: "type your email address here",
            passwordValue: "***",
            emailError: false,
            passwordError: false
        }
    },
    
    handleChange(event) {
        let field = event.target.name
        //console.log("event.target.name : " + event.target.name)   // for debugging
        if      (field === "email")    { this.setState({emailValue:    event.target.value}) }
        else if (field === "password") { this.setState({passwordValue: event.target.value}) }
        else {alert ("something is wrong")}
    },
    
    handleSubmit(event) {
        /* If the email is not a valid expression (according to regexp above), show an error in red on the page. Otherwise, check the database. (To do!)
         * If the server says the email is wrong, show that error. If it says the password is wrong, show that error.
         * Otherwise, let the user in.
         */
        event.preventDefault()  // stops the page from reloading
        
        // Check if the email address is an email address
        let emailFail = !validateEmail(this.state.emailValue)
        if (emailFail) {
            this.setState({
                emailError: emailFail,
                passwordError: false
            })
            return
        }
        // Try to log in
        this.props.login({variables: {input: {tryEmail: this.state.emailValue, tryPassword: this.state.passwordValue}}}).then((response) => {
            const jwt = response.data.authenticate.jsonWebToken
            if (jwt) {
	            this.setState({
	                emailError: false,
	                passwordError: false
	            })
	            localStorage.setItem('token', jwt)
                // TODO change page
            } else {
                this.setState({
                    emailError: false,
                    passwordError: true
                })
            }
        }).catch((error) => {
            console.log(error)
            // TODO unexpected error (e.g. network error)...
        })
        
    },
    
    render() {
        return (
            <div className='panel page-auth'>
                <div>
                    <div>
                        <h1>Log in.</h1>
                        <p>
                            Logging in allows you to view and save your progress.
                        </p>

                        <form onSubmit={ this.onSubmit }>
                            <p className={this.state.emailError ? "authErrorMsg" : "noDisplay"}>Please enter an email address.</p>
                            Email: <input type="text" name="email" value={this.state.emailValue} onChange={this.handleChange} /> <br/>
                            <p className={this.state.passwordError ? "authErrorMsg" : "noDisplay"}>Oops! Incorrect email address or password.</p>
                            Password: <input type="text" name="password" value={this.state.passwordValue} onChange={this.handleChange} /> <br/>
            
                            <button onClick={this.handleSubmit} >
                                Sign In
                            </button>
                        </form>
                    </div>

                    <Link to="register">
                        Need an account? Join Now.
                    </Link>
                </div>
            </div>
        )
    }
})

const login = gql`mutation ($input: AuthenticateInput!) {
    authenticate(input: $input) {
        jsonWebToken
    }
}`

// Variables must be defined when the function is called
const loginConfig = {
    name: 'login'
}

export default graphql(login, loginConfig)(AuthLoginPage)