import { Navigation, Link } from 'react-router'
import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Translate from 'react-translate-component'

function validateEmail(email) {
    /* A regexp to check that an email address is in the form anyString@anyString.anyString
     */
    const re = /\S+@\S+\.\S+/
    return re.test(email)
}

const AuthJoinPage = React.createClass({
    getInitialState() {
        return {
            username: "",
            emailValue: "",
            passwordValue: "",
            confirmPassword: "###",
            emailError: false,
            passwordError: false
        }
    },
    
    handleChange(event) {
        let field = event.target.name
        //console.log("event.target.name : " + event.target.name)   // for debugging
        if      (field === "username") { this.setState({username:      event.target.value}) }
        else if (field === "email")    { this.setState({emailValue:    event.target.value}) }
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
        let errors = {usernameIssue: this.state.username === "",
                     passwordClash: this.state.passwordValue !== this.state.confirmPassword,
                     emailFail: !validateEmail(this.state.emailValue)}
        this.setState({
            usernameError: errors.usernameIssue,
            emailError: errors.emailFail,
            passwordError: errors.passwordClash
        })
        if (!errors.passwordClash && !errors.emailFail && !errors.usernameIssue) {
            // Connect to the server to create a new account
            this.props.signup({variables: {input: {email: this.state.emailValue, password: this.state.passwordValue}}}).then((response) => {
                const newUserId = response.data.signup.integer
                console.log(newUserId)
                // TODO log in and change page
                alert('New user created with id ' + newUserId + ' and username ' + this.state.username)
            }).catch((error) => {
                // TODO translate these messages
                if (error.networkError) {
                    alert('We cannot connect to the server! Sadbearface.')
                } else {
                    // Apart from network errors, the only error we would expect is a duplicate email address -- OR USERNAME (TODO)
                    alert('Have you already registered this email address? Please log in!')  // TODO add link
                    // The human-readable Postgres error message will be under error.graphQLErrors[0].message
                }
            })
        }
    },
    
    render() {
        // TO DO: neaten up the presentation of the below by using a table
        return (
            <div className='panel page-auth'>
                <div id="form">
                    <div>
                        <h1><Translate content="auth.register.joinTitle" /></h1>
                        <p>
                            <Translate content="auth.register.joining" />
                        </p>

                        <form onSubmit={ this.onSubmit }>
                            <table>
                                <tbody>
                                    <tr><td colSpan="2" className="tdError"><p className={this.state.emailError ? "authErrorMsg" : "noDisplay"}><Translate content="auth.register.emailError" /></p></td></tr>
                                    <tr><td className="tdText"><Translate content="auth.email" /></td><td><input type="text" name="email" placeholder="type your email address here" onChange={this.handleChange} /></td></tr>
                                    <tr><td colSpan="2" className="tdError"><p className={this.state.usernameError ? "authErrorMsg" : "noDisplay"}><Translate content="auth.register.usernameError" /></p></td></tr>
                                    <tr><td className="tdText"><Translate content="auth.username" /></td><td><input type="text" name="username" placeholder="Your name" onChange={this.handleChange} /></td></tr>
                                    <tr><td colSpan="2" className="tdError"><p className={this.state.passwordError ? "authErrorMsg" : "noDisplay"}><Translate content="auth.register.passwordError" /></p></td></tr>
                                    <tr><td className="tdText"><Translate content="auth.password" /></td><td><input type="password" name="password" onChange={this.handleChange} /></td></tr>
                                    <tr><td className="tdText"><Translate content="auth.confirmPassword" /></td><td><input type="password" name="confirmPassword" onChange={this.handleChange} /></td></tr>
                                </tbody>
                            </table>
                            <button onClick={this.handleSubmit} >
                                <Translate content="auth.register.joinButtonLabel" />
                            </button>
                        </form>
                    </div>

                    <Link to="login" >
                        <Translate content="auth.register.loginLink" />
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