import { Navigation, Link } from 'react-router'
import React from 'react'

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
            alert('A name was submitted: ' + this.state.emailValue + " - and this too - " + this.state.passwordValue + " - but also this - " + this.state.confirmPassword)
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
                        Have an account? Sign in.
                    </Link>
                </div>
            </div>
        )
    }
})


export default AuthJoinPage