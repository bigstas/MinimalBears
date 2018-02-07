import React from 'react'
import jwtDecode from 'jwt-decode'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Nav from './auxiliary/nav'
    

const UserAppBody = React.createClass({
    getInitialState() {
        return {
            activeLanguageId: null
        }
    },
    
    setLanguage(langId) {
        this.setState({
            activeLanguageId: langId
        })
    },
    
    render() {
        let username = false
        // TODO: remove all userId references in app
        let userId = null
        if (this.props.accountInfo) {
            if (this.props.accountInfo.loading) { return <div>Loading</div> } // TODO: prettify / rationalise
            console.log(this.props.accountInfo)
            username = this.props.accountInfo.getAccountInfo.username
            userId =   this.props.accountInfo.getAccountInfo.id
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
                        activeLanguageId: this.state.activeLanguageId, 
                        callbackLanguage: this.setLanguage,
                        callbackUser: this.props.setUser,
                        callbackLogOut: this.props.logOut
                    }
                )}
            </div>
        )
    }
})

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
        fetchPolicy: "standby"
    }
}
const SignedInAppBody = graphql(accountInfoQuery, accountInfoQueryConfig)(UserAppBody)


const AppBody = React.createClass({    
    getInitialState() {
        const raw_jwt = localStorage.getItem('token')
        return {
            isLoggedIn: !!raw_jwt // true if there is a jwt in local storage, false otherwise
        }
    },
    
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
    },
    
    logOut() {
        // Clear everything from setUser (state, memory, refreshing)
        console.log('logging out')
        this.setState({
            isLoggedIn: false
        })
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        clearInterval(this.refreshTimer)
    },
    
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
    },
    
    componentWillMount() {
        const raw_jwt = localStorage.getItem('token')
        if (!!raw_jwt) {
            console.log('found json web token')
            this.setUser(raw_jwt)
            this.refresh()
        }
    },
    
    render() {
        let AppBodyClass
        
        if (this.state.isLoggedIn) {
            AppBodyClass = SignedInAppBody
        } else {
            AppBodyClass = UserAppBody
        }
        return <AppBodyClass children={this.props.children} setUser={this.setUser} logOut={this.logOut} />
    }
})

const refresh = gql`mutation($input:RefreshInput!) {
    refresh(input:$input) {
        jsonWebToken
    }
}`
const refreshConfig = {
    name: 'refresh'
}

export default graphql(refresh, refreshConfig)(AppBody)