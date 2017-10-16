import { Navigation, Link } from 'react-router'
import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Translate from 'react-translate-component'
import { browserHistory } from 'react-router'

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
        } else {
            this.setState({
                emailError: emailFail  // sets to false? Should this just be removed as we set to false later anyway?
            })
        }
        // Try to log in
        this.props.login({variables: {input: {tryEmail: this.state.emailValue, tryPassword: this.state.passwordValue}}}).then((response) => {
            const jwt = response.data.authenticate.jsonWebToken
            if (!!jwt) {
	            this.setState({
	                emailError: false,
	                passwordError: false
	            })
	            this.props.callbackUser(jwt)
                // change page (currently navigates to Home)
                browserHistory.push('/')
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
                <div id="form">
                    <div>
                        <h1><Translate content="auth.login.loginTitle" /></h1>
                        <p>
                            <Translate content="auth.login.loggingIn" />
                        </p>

                        <form onSubmit={ this.onSubmit }>
                            <table>
                                <tbody>
                                    <tr><td colSpan="2" className="tdError"><p className={this.state.emailError ? "authErrorMsg" : "noDisplay"}><Translate content="auth.login.emailError" /></p></td></tr>
                                    <tr><td><Translate content="auth.email" /></td><td><input type="text" name="email" placeholder="Type your email address here" onChange={this.handleChange} /><br/></td></tr>
                                    <tr><td colSpan="2" className="tdError"><p className={this.state.passwordError ? "authErrorMsg" : "noDisplay"}><Translate content="auth.login.passwordError" /></p></td></tr>
                                    <tr><td><Translate content="auth.password" /></td><td><input type="password" name="password" onChange={this.handleChange} /><br/></td></tr>
                                </tbody>    
                            </table>
                            <div className="authbtn" onClick={this.handleSubmit} >
                                <Translate content="auth.login.loginButtonLabel" />
                            </div>
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