// Question mark image taken from wikimedia commons (open source)

import { Navigation, Link } from 'react-router'
import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Translate from 'react-translate-component'
import counterpart from 'counterpart'
import ReactTooltip from 'react-tooltip'
import Select from 'react-select'
import 'react-select/dist/react-select.css'

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
            nativeLanguage: [],
            customNativeLanguage: "",
            inputCustomLanguage: false,
            emailError: false,
            passwordError: false,
            languageError: false
        }
    },
    
    toggleCustomLanguage() {
        this.setState({ 
            inputCustomLanguage: !this.state.inputCustomLanguage,
            customNativeLanguage: ""
        })
    },
    
    handleChange(event) {
        let field = event.target.name
        //console.log("event.target.name : " + event.target.name)   // for debugging
        if      (field === "username") { this.setState({username:      event.target.value}) }
        else if (field === "email")    { this.setState({emailValue:    event.target.value}) }
        else if (field === "password") { this.setState({passwordValue: event.target.value}) }
        else if (field === "confirmPassword") { this.setState({confirmPassword: event.target.value}) }
        else if (field === "customNativeLanguage") { this.setState({ customNativeLanguage: event.target.value }) }
        else {alert ("something is wrong")}
    },
    
    getDropdownValue(selectedOptions) {
        let values = []
        selectedOptions.map(function(c, index) {
            values.push(c.value)
        })
        this.setState({ nativeLanguage: values })
        console.log(`values: ` + values)
        console.log(`Selected: label ${selectedOptions.label} and value ${selectedOptions.value}`)
        console.log(`Stringified: ` + JSON.stringify(selectedOptions, null, 4))
    },
    
    handleSubmit(event) {
        /* If the email is not a valid expression (according to regexp above), shows an error in red text on the page.
         * If password does not match confirmed password, shows a similar error.
         * Otherwise, do something with the email and password values.
         */
        event.preventDefault()  // stops the page from reloading
        let errors = {
            usernameIssue: this.state.username === "",
            passwordClash: this.state.passwordValue !== this.state.confirmPassword,
            emailFail: !validateEmail(this.state.emailValue),
            languageFail: (this.state.nativeLanguage.length === 0 && this.state.customNativeLanguage === "")
        } // Note: [] === [] returns false (wtf!), as does []===false, because Javascript is like that
        this.setState({
            usernameError: errors.usernameIssue,
            emailError: errors.emailFail,
            passwordError: errors.passwordClash,
            languageError: errors.languageFail
        })
        if (!errors.passwordClash && !errors.emailFail && !errors.usernameIssue && !errors.languageFail) {
            // Connect to the server to create a new account
            this.props.signup({variables: {input: {email: this.state.emailValue,
                                                   password: this.state.passwordValue,
                                                   username: this.state.username}}})
            .then((response) => {
                const newUserId = response.data.signup.integer
                console.log(newUserId)
                // TODO log in and change page
                alert('New user created with id ' + newUserId + ' and username ' + this.state.username)
            }).catch((error) => {
                // TODO test this to see whether the translation is working! (How to do this??)
                if (error.networkError) {
                    alert( counterpart.translate(["auth", "register", "errors", "serverError"]) )
                } else {
                    // Apart from network errors, the only error we would expect is a duplicate email address -- OR USERNAME (TODO)
                    // TODO this is throwing email errors when it should be throwing email errors (i.e. when you use the same username, it tells you to change the email address)
                    alert( counterpart.translate(["auth", "register", "errors", "duplicateEmail"]) )  // TODO add link
                    console.log(error.graphQLErrors[0].message)
                }
            })
        }
    },
    
    render() {
        const options = ["English", "Deutsch", "Polski"]
        // Array.push - adds to the end of the array; Array.unshift - adds to the beginning of the array
        let optionList = []
        for (let i=0; i<options.length; i++) {
            optionList.push({value: options[i], label: options[i]})
        }
        
        return (
            <div className='panel animated fadeIn'>
                <div id="form">
                    <div>
                        <h1><Translate content="auth.register.joinTitle" /></h1>
                        <p>
                            <Translate content="auth.register.joining" />
                        </p>

                        <form onSubmit={ this.onSubmit }>
                            <table>
                                <tbody>
                                {/* Email error message (usually .style.display=none) */}
                                    <tr><td colSpan="2" className="tdError"><p className={this.state.emailError ? "authErrorMsg" : "noDisplay"}><Translate content="auth.register.emailError" /></p></td></tr>
                                {/* Input email */}
                                    <tr><td className="tdText"><Translate content="auth.email" /></td><td><input type="text" name="email" placeholder="koala@minbears.wow" onChange={this.handleChange} /></td></tr>
                                {/* Username error message (usually .style.display=none) */}
                                    <tr><td colSpan="2" className="tdError"><p className={this.state.usernameError ? "authErrorMsg" : "noDisplay"}><Translate content="auth.register.usernameError" /></p></td></tr>
                                {/* Input username */}
                                    <tr><td className="tdText"><Translate content="auth.username" /></td><td><input type="text" name="username" placeholder="koala" onChange={this.handleChange} /></td></tr>
                                {/* Password error message (usually .style.display=none) */}
                                    <tr><td colSpan="2" className="tdError"><p className={this.state.passwordError ? "authErrorMsg" : "noDisplay"}><Translate content="auth.register.passwordError" /></p></td></tr>
                                {/* Input password */}
                                    <tr><td className="tdText"><Translate content="auth.password" /></td><td><input type="password" name="password" onChange={this.handleChange} /></td></tr>
                                {/* Empty table row to make spacing between each line the same (otherwise the two password fields are closer together than the rest) */}
                                    <tr><td></td><td></td></tr>
                                {/* Input confirm password */}
                                    <tr><td className="tdText"><Translate content="auth.confirmPassword" /></td><td><input type="password" name="confirmPassword" onChange={this.handleChange} /></td></tr>
                                {/* Native language error message (usually .style.display=none) */}
                                    <tr><td colSpan="2" className="tdError"><p className={this.state.languageError ? "authErrorMsg" : "noDisplay"}><Translate content="auth.register.languageError" /></p></td></tr>
                                {/* Choose native language TODO: use database */}
                                    <tr>
                                        <td className="tdText">
                                            <p style={{display: "inline"}}>
                                                <Translate content="auth.register.nativeLanguage" />
                                            </p>
                                            <img style={{width: "15px", display: "inline"}} src="questionmark.png" data-tip data-for='languageTooltip' data-delay-show='100' />
                                        </td>
                                        <td>
                                            <Select
                                                name="form-field-name"
                                                value={this.state.nativeLanguage}
                                                onChange={this.getDropdownValue}
                                                options={optionList}
                                                multi
                                                rtl={false} autosize={false} placeholder=""
                                                noResultsText={<Translate content="auth.register.noResults" />}
                                                style={{textAlign: "left"}}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{textAlign: "left"}}>
                                            <input
                                                id="customLanguageInput"
                                                type="checkbox"
                                                name="offTheList"
                                                onChange={this.toggleCustomLanguage}
                                                style={{width: "15px", verticalAlign: "middle"}}
                                            />
                                            <label
                                                htmlFor="customLanguageInput"
                                                style={{verticalAlign: "middle"}}>
                                                <Translate content="auth.register.notInTheList" />
                                            </label>
                                        </td>
                                        <td>
                                            {this.state.inputCustomLanguage ?
                                            <input
                                                type="text"
                                                name="customNativeLanguage"
                                                placeholder="Cebuano, Hopi, Saami, ..."
                                                onChange={this.handleChange}
                                            />
                                            : <span /> }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            
                            <ReactTooltip id='languageTooltip' place="bottom" type="light" effect="solid" multiline={true}>
                                <p style={{textAlign:'center', fontSize: "11px"}}>
                                    <Translate content="auth.register.tooltip" unsafe />
                                </p>
                            </ReactTooltip>
                            <div className="authbtn" onClick={this.handleSubmit} >
                                <Translate content="auth.register.joinButtonLabel" />
                            </div>
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