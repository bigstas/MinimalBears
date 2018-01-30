import React from 'react'
import jwtDecode from 'jwt-decode'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Nav from './auxiliary/nav'
    

const AppBodyChild = React.createClass({
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
        let userId = null
        if (this.props.isLoggedIn) {
            if (this.props.data.loading) { return <div>Loading</div> } // TODO: prettify / rationalise
            username = this.props.data.getAccountInfo.username
            userId =   this.props.data.getAccountInfo.id
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

// AppBodyChild will be wrapped in AppBody if user is logged in, this setup comes before the wrapping
// Calling graphql on this turns it into a function which returns a React element (needed below)
const accountInfoQuery = graphql(gql`query{
    getAccountInfo {
        id
        username
        interface
        native
        customNative
        tutorial
    }
}`)
// Try this out without config, then the name defaults to "data". Then could delete this.
const accountInfoQueryConfig = {
    name: 'accountInfo'
}

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
            // Set the state, to change the app
            this.setState({
                isLoggedIn: true
            })
            // Store the token in memory, to be added to request headers
            localStorage.setItem('token', raw_jwt)
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
        let Child = <AppBodyChild children={this.props.children} setUser={this.props.setUser} logOut={this.props.logOut} isLoggedIn={this.state.isLoggedIn} />
              
        if (this.state.isLoggedIn) {
            // wrapped version
            console.log(Child)
            // below returns a function, we need to return a React element
            //Child = graphql(accountInfoQuery, accountInfoQueryConfig)(Child)
            const ChildWithData = accountInfoQuery(Child)
            console.log(ChildWithData)
            return ChildWithData
        } else {
            // unwrapped version
            return Child
        }
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