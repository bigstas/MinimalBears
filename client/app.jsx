import React from 'react'
import jwtDecode from 'jwt-decode'
import { withApollo, graphql, compose } from 'react-apollo'
import Translate from 'react-translate-component'

import Nav from './auxiliary/nav'
import { refreshMutation, accountInfoQuery } from '/lib/graphql'

// The app always uses AppBody, which always contains MinimalAppBody.
// If the user is signed in, there is an intermediate wrapper SignedInAppBody.

// TODO This page can probably be written more cleanly

class MinimalAppBody extends React.Component {
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
        let tutorial = false
        //if (this.props.accountInfo) { <-- was getting errors when there was no token but there was this prop
        //if (this.props.accountInfo && localStorage['token']) {
        if (this.props.accountInfo && !this.props.accountInfo.error && localStorage['token']) {
            console.log("jwt: " + localStorage['token'])
            if (this.props.accountInfo.loading) { return <Translate component="div" content="loading.loading" /> }
            console.log("ACCOUNT INFO:")
            console.log(this.props.accountInfo)
            username = this.props.accountInfo.getAccountInfo.username
            tutorial = this.props.accountInfo.getAccountInfo.tutorial
            native =   this.props.accountInfo.getAccountInfo.native
        }
        console.log("Username is: " + username)
            
        return (
            <div id="app-container">
                <Nav callbackLogOut={this.props.logOut} username={username} />
                {/* Insert the children according to routes.jsx (this.props.children), along with the childrens' props.
                username should come from query due to being wrapped by graphql for wrapped case; otherwise username is bool: false. */}
                {React.cloneElement(
                    this.props.children, 
                    {
                        username: username,
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

const SignedInAppBody = graphql(accountInfoQuery, {name: 'accountInfo'})(MinimalAppBody)

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
            localStorage.setItem('token', raw_jwt) // all localStorage calls are synchronous
            // Set the state, to change the app
            console.log('jwt valid, setting isLoggedIn to True')
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
        // Getting an error about passing a Promise instead of a function here, is that right?
        console.dir(typeof(this.props.client.resetStore()))
        // Below - order has been reversed; cannot put resetStore as callback of setState because it's a promise, not a function
        //this.setState( { isLoggedIn: false }, this.props.client.resetStore() )
        this.props.client.resetStore()
        .then(() => {
            this.setState( { isLoggedIn: false } )
        })
        
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
            console.log('found json web token, running setUser as App compenent mounts')
            this.setUser(raw_jwt)
            this.refresh()
        }
    }
    
    render() {
        let AppBodyClass
        
        if (this.state.isLoggedIn) {
            AppBodyClass = SignedInAppBody
        } else {
            AppBodyClass = MinimalAppBody
        }
        return <AppBodyClass children={this.props.children} setUser={this.setUser.bind(this)} logOut={this.logOut.bind(this)} />
    }
}

// withApollo allows direct access to the "client" object as a prop
export default withApollo(graphql(refreshMutation, {name: 'refresh'})(AppBody))