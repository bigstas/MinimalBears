import { Navigation, Link } from 'react-router'
import React from 'react'

function validateEmail(email) {
    /* A regexp to check that an email address is in the form anyString@anyString.anyString
     */
    const re = /\S+@\S+\.\S+/
    return re.test(email)
}

const AuthSignInPage = React.createClass({
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
        
        // This must include checking in the database! At the moment it doesn't!
        let correctPassword = "password"
        let errors = {passwordFail: (this.state.passwordValue !== correctPassword),
                     emailFail: !validateEmail(this.state.emailValue)}
        
        this.setState({
            passwordError: errors.passwordFail,
            emailError: errors.emailFail
        })
        
        if (!errors.passwordFail && !errors.emailFail) {
            alert("We're letting you in with this email: " + this.state.emailValue + " - and this password: " + this.state.passwordValue)
        }
    },
    
    render() {
        return (
            <div className='panel page-auth'>
                <div>
                    <div>
                        <h1>Sign in.</h1>
                        <p>
                            Signing in allows you to view and save your progress.
                        </p>

                        <form onSubmit={ this.onSubmit }>
                            <p className={this.state.emailError ? "authErrorMsg" : "noDisplay"}>This email address was not recognised.</p>
                            Email: <input type="text" name="email" value={this.state.emailValue} onChange={this.handleChange} /> <br/>
                            <p className={this.state.passwordError ? "authErrorMsg" : "noDisplay"}>Oops! Incorrect password.</p>
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

export default AuthSignInPage