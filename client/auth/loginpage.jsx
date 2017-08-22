import { Navigation, Link } from 'react-router'
import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Translate from 'react-translate-component'

// TO DO: if you are already logged in, login and register join pages should be unavailable (you should be redirected, e.g. to your profile)
    
function validateEmail(email) {
    /* A regexp to check that an email address is in the form anyString@anyString.anyString
     */
    const re = /\S+@\S+\.\S+/
    return re.test(email)
}

const AuthLoginPage = React.createClass({
    getInitialState() {
        return {
            emailValue: "",
            passwordValue: "",
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
                        <h1><Translate content="auth.login.loginTitle" /></h1>
                        <p>
                            <Translate content="auth.login.loggingIn" />
                        </p>

                        <form onSubmit={ this.onSubmit }>
                            <p className={this.state.emailError ? "authErrorMsg" : "noDisplay"}><Translate content="auth.login.emailError" /></p>
                            <Translate content="auth.email" /> <input type="text" name="email" placeholder="type your email address here" onChange={this.handleChange} /> <br/>
                            <p className={this.state.passwordError ? "authErrorMsg" : "noDisplay"}><Translate content="auth.login.passwordError" /></p>
                            <Translate content="auth.password" /> <input type="password" name="password" onChange={this.handleChange} /> <br/>
            
                            <button onClick={this.handleSubmit} >
                                <Translate content="auth.login.loginButtonLabel" />
                            </button>
                        </form>
                    </div>

                    <Link to="register">
                        <Translate content="auth.login.joinLink" />
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