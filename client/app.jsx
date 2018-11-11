import React from 'react'
import jwtDecode from 'jwt-decode'
import { withApollo, graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Nav from './auxiliary/nav'
import Translate from 'react-translate-component'

class UserAppBody extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
            activeLanguageId: null
        }
    }
    
    setLanguage(langId) {
        this.setState({
            activeLanguageId: langId
        })
    }
    
    render() {
        let native = null
        let username = false
        // TODO: remove all userId references in app
        let userId = null
        let tutorial = false
        if (this.props.accountInfo) {
            if (this.props.accountInfo.loading) { return <Translate component="div" content="loading.loading" /> }
            console.log(this.props.accountInfo)
            username = this.props.accountInfo.getAccountInfo.username
            userId =   this.props.accountInfo.getAccountInfo.id
            tutorial = this.props.accountInfo.getAccountInfo.tutorial
            native =   this.props.accountInfo.getAccountInfo.native
        }
        console.log("Username is: " + username)
            
        return (
            <div id="app-container">
                <Nav callbackLogOut={this.props.logOut} username={username} />
                {/* Insert the children according to routes.jsx (this.props.children), along with the childrens' props.
                username should come from query due to being wrapped by graphql for wrapped case; otherwise username is bool: false.
                userId should no longer be necessary. */}
                {React.cloneElement(
                    this.props.children, 
                    {
                        username: username,
                        userId: userId,
                        hasSeenTutorial: tutorial,
                        native: native,
                        activeLanguageId: this.state.activeLanguageId, 
                        callbackLanguage: this.setLanguage.bind(this),
                        callbackUser: this.props.setUser,
                        callbackLogOut: this.props.logOut
                    }
                )}
            </div>
        )
    }
}

// UserAppBody will be wrapped in AppBody if user is logged in, this setup comes before the wrapping
// Calling graphql on this turns it into a function which returns a React element (needed below)
const accountInfoQuery = gql`query{
    getAccountInfo {
        id
        username
        interface
        native
        customNative
        tutorial
        email
    }
}`
// Try this out without config, then the name defaults to "data". Then could delete this.
const accountInfoQueryConfig = {
    name: 'accountInfo',
    options: {
        // This doesn't fix the problem with logout, and we may want to move to "no-cache".
        // In the current version of Apollo, "no-cache" seems to not be an option.
        // Commented out as it was causing crashes for Gergő.
        //fetchPolicy: "standby"
    }
}
const SignedInAppBody = graphql(accountInfoQuery, accountInfoQueryConfig)(UserAppBody)


class AppBody extends React.Component {
	constructor(props) {
		super(props)
        const raw_jwt = localStorage.getItem('token')
        this.state = {
            isLoggedIn: !!raw_jwt // true if there is a jwt in local storage, false otherwise
        }
    }
    
    setUser(raw_jwt) {
        const jwt = jwtDecode(raw_jwt)
        
        // Check if the token has expired
        // Note that getTime() is in milliseconds, but jwt.exp is in seconds
        const timestamp = (new Date).getTime()
        if (!!jwt && timestamp < jwt.exp * 1000) {
            // If the token is still valid:
            // Store the token in memory, to be added to request headers
            localStorage.setItem('token', raw_jwt)
            // Set the state, to change the app
            this.setState({
                isLoggedIn: true
            })
            // Automatically refresh the token
            this.refreshTimer = setInterval(this.refresh, 1000*60*20)  // Refresh every 20 minutes
            console.log('timer set up')
            
        } else {
            // If the token is no longer valid, log out to clear information
            this.logOut()
        }
    }
    
    logOut() {
        // Clear everything from setUser (state, memory, refreshing)
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('token')
        clearInterval(this.refreshTimer)
        console.log('logging out')
        // second argument is a callback that setState will call when it is finished
        this.setState( { isLoggedIn: false }, this.props.client.resetStore() )
        // Behaviour seems right, but GraphQL permission denied errors are being called (due to above line)
        // on get_account_info, get_practice_languages, and get_all_stats (twice).
        // TODO - find the reason for the error, and fix so that no error gets raised.
        console.log("Logout successful")
    }
    
    refresh() {
        // Get a new token using the refresh code
        console.log('refreshing json web token')
        this.props.refresh({variables: {input: {refreshToken: localStorage.getItem('refreshToken')}}})
        .then((response) => {
            // Store the new token
            const raw_jwt = response.data.refresh.jsonWebToken
            console.log('setting token')
            console.log(raw_jwt)
            localStorage.setItem('token', raw_jwt)
        }).catch((error) => {
            // If we can't connect to the server, try again
            if (error.networkError) {
                console.log('network error?') //TODO
                //this.refresh()
            } else { //TODO
                // If we connected to the server and refreshing failed, log out
                console.log('error, logging out')
                console.log(error)
                this.logOut()
            }
        })
    }
    
    componentWillMount() {
        const raw_jwt = localStorage.getItem('token')
        if (!!raw_jwt) {
            console.log('found json web token')
            this.setUser(raw_jwt)
            this.refresh()
        }
    }
    
    render() {
        let AppBodyClass
        
        if (this.state.isLoggedIn) {
            AppBodyClass = SignedInAppBody
        } else {
            AppBodyClass = UserAppBody
        }
        return <AppBodyClass children={this.props.children} setUser={this.setUser.bind(this)} logOut={this.logOut.bind(this)} />
    }
}

const refresh = gql`mutation($input:RefreshInput!) {
    refresh(input:$input) {
        jsonWebToken
    }
}`
const refreshConfig = {
    name: 'refresh'
}

export default withApollo(graphql(refresh, refreshConfig)(AppBody))