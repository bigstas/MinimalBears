// Question mark image taken from wikimedia commons (open source)
import { Navigation, Link, browserHistory } from 'react-router'
import React from 'react'
import { graphql, compose } from 'react-apollo'
import Translate from 'react-translate-component'
import counterpart from 'counterpart'
import ReactTooltip from 'react-tooltip'
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import LoadingPage from '/client/auxiliary/loading'
import decodeError from '/client/auxiliary/errors'
import { allLanguages, signup } from '/lib/graphql'

// TODO: this is repeated in the loginpage. Move this to a util file.
function validateEmail(email) {
    /* A regexp to check that an email address is in the form anyString@anyString.anyString
     */
    const re = /\S+@\S+\.\S+/
    return re.test(email)
}

// TODO: these are likely to be shared between the joinpage and the loginpage, 
// so best off moving this to a util file
function InputRow(props) {
    /**
     * Props: translateLabel, type (text, email, or password), name, placeholder, callback (on change)
     */
    return (
        <tr>
            <td className="tdText"><Translate content={props.translateLabel} /></td>
            <td><input type={props.type} name={props.name} placeholder={props.placeholder} onChange={props.callback} /></td>
        </tr>
    )
}

function MessageRow(props) {
    /**
     * Props: colSpan, className (of p), translateLabel
     */
    return (
        <tr>
            <td colSpan={props.colSpan} className="tdError"><p className={props.className}><Translate content={props.translateLabel} /></p></td>
        </tr>
    )
}


class JoinPage extends React.Component {
	constructor(props) {
        super(props)
		this.state = {
            username: "",
            emailValue: "",
            passwordValue: "",
            confirmPassword: "###",
            nativeLanguage: [],
            customNativeLanguage: null,
            inputCustomLanguage: false,
            emailError: false,
            passwordError: false,
            languageError: false
        }
    }
    
    toggleCustomLanguage = () => { // arrow function keeps "this" defined as class instance
        this.setState({ 
            inputCustomLanguage: !this.state.inputCustomLanguage,
            customNativeLanguage: null
        })
    }
    
    handleChange = (event) => { // arrow function keeps "this" defined as class instance
        let field = event.target.name
        //console.log("event.target.name : " + event.target.name)   // for debugging
        if      (field === "username") { this.setState({username:      event.target.value}) }
        else if (field === "email")    { this.setState({emailValue:    event.target.value}) }
        else if (field === "password") { this.setState({passwordValue: event.target.value}) }
        else if (field === "confirmPassword") { this.setState({confirmPassword: event.target.value}) }
        else if (field === "customNativeLanguage") { this.setState({ customNativeLanguage: event.target.value }) }
        else {alert ("something is wrong")}
    }
    
    getDropdownValue = (selectedOptions) => { // arrow function keeps "this" as class instance
        let values = []
        selectedOptions.map(function(option, index) {
            values.push(option.value)
        })
        this.setState({ nativeLanguage: values })
        console.log(`values: ` + values)
        console.log(`Selected: label ${selectedOptions.label} and value ${selectedOptions.value}`)
        console.log(`Stringified: ` + JSON.stringify(selectedOptions, null, 4))
    }
    
    handleSubmit = (event) => {
        /* If the email is not a valid expression (according to regexp above), shows an error in red text on the page.
         * If password does not match confirmed password, shows a similar error.
         * Otherwise, do something with the email and password values.
         */
        event.preventDefault()  // stops the page from reloading
        let errors = {
            usernameIssue: this.state.username === "",
            passwordClash: this.state.passwordValue !== this.state.confirmPassword,
            emailFail: !validateEmail(this.state.emailValue),
            languageFail: (this.state.nativeLanguage.length === 0 && !this.state.customNativeLanguage)
        }
        this.setState({
            usernameError: errors.usernameIssue,
            emailError: errors.emailFail,
            passwordError: errors.passwordClash,
            languageError: errors.languageFail
        })
        if (!errors.passwordClash && !errors.emailFail && !errors.usernameIssue && !errors.languageFail) {
            // Connect to the server to create a new account
            
            // Replace an empty string with null
            let customNativeLanguage = this.state.customNativeLanguage
            if (customNativeLanguage === "") {
                customNativeLanguage = null 
            }
            
            return this.props.signup({variables: {input: {email: this.state.emailValue,
                                                          password: this.state.passwordValue,
                                                          username: this.state.username,
                                                          interface: counterpart.getLocale(),
                                                          nativeArray: this.state.nativeLanguage,
                                                          customNative: customNativeLanguage}}
            }).then((response) => {
                const jwt = response.data.tokenPair.jwt
                const refresh = response.data.tokenPair.refresh 
                
                // TODO log in (below)
                // uncomment below and insert JWT to auto-login
                //this.props.callbackUser( /* JWT goes in here!! */)
                
                // change page (navigates to Home)
                browserHistory.push('/')
            }).catch((error) => {
                console.dir(error)
                alert(decodeError(error))
            })
        }
    }
    
    render() {
        if (this.props.languages.loading) {
            return <LoadingPage />
        } 
        const optionList = this.props.languages.allLanguages.nodes.map((row) => {
            return { value: row.id, label: row.name }
        })
        
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
                                <colgroup>
                                   <col span="1" style={{width: "50%"}} />
                                   <col span="1" style={{width: "50%"}} />
                                </colgroup>
                                
                                <tbody>
                                {/* Email error message (usually .style.display=none) */}
                                    <MessageRow colSpan={2} className={this.state.emailError ? "authErrorMsg" : "noDisplay"} translateLabel="auth.register.emailError" />
                                {/* Input email */}
                                    <InputRow translateLabel="auth.email" type="email" name="email" placeholder="koala@minbears.wow" callback={this.handleChange} />
                                {/* Username error message (usually .style.display=none) */}
                                    <MessageRow colSpan={2} className={this.state.usernameError ? "authErrorMsg" : "noDisplay"} translateLabel="auth.register.usernameError" />
                                {/* Input username */}
                                    <InputRow translateLabel="auth.username" type="text" name="username" placeholder="koala" callback={this.handleChange} />                                    
                                {/* Password error message (usually .style.display=none) */}
                                    <MessageRow colSpan={2} className={this.state.passwordError ? "authErrorMsg" : "noDisplay"} translateLabel="auth.register.passwordError" />
                                {/* Input password */}
                                    <InputRow translateLabel="auth.password" type="password" name="password" placeholder="" callback={this.handleChange} />
                                {/* Empty table row to make spacing between each line the same (otherwise the two password fields are closer together than the rest) */}
                                    <tr><td></td><td></td></tr>
                                {/* Input confirm password */}
                                    <InputRow translateLabel="auth.confirmPassword" type="password" name="confirmPassword" placeholder="" callback={this.handleChange} />                                    
                                {/* Native language error message (usually .style.display=none) */}
                                    <MessageRow colSpan={2} className={this.state.languageError ? "authErrorMsg" : "noDisplay"} translateLabel="auth.register.languageError" />                                    
                                {/* Choose native language */}
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
                                        <td style={{textAlign: "left", paddingTop: "15px"}}>
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
}

const JoinPageWithData = compose(
    graphql(signup, {name: 'signup'}),
    graphql(allLanguages, {name: 'languages'})
)(JoinPage)

export { JoinPageWithData, JoinPage, validateEmail }