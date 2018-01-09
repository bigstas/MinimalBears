import React from 'react'
import jwtDecode from 'jwt-decode'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Nav from './auxiliary/nav'
    
const AppBody = React.createClass({    
    getInitialState() {
        // this.state.user to be a string when there is a signed-in user; otherwise, false (bool)
        return {
            activeLanguageId: null,
            username: null,
            userId: null
        }
    },
    
    setLanguage(langId) {
        this.setState({
            activeLanguageId: langId
        })
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
                username: "Placeholder Username",  // TODO
                userId: jwt.id
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
            username: null,
            userId: null
        })
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        clearInterval(this.refreshTimer)
    },
    
    refresh() {
        // Get a new token using the refresh code
        console.log('refreshing json web token')
        this.props.refresh(localStorage.getItem('refreshToken'))
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
        return (
            <div id="app-container" >
                <Nav username={this.state.username}
                    userId={this.state.userId}
                    callbackLogOut={this.logOut}
                />
                {/* Insert the children according to routes.jsx (this.props.children), along with the childrens' props */}
                {React.cloneElement(
                    this.props.children, 
                    {activeLanguageId: this.state.activeLanguageId, 
                        username: this.state.username,
                        userId: this.state.userId,
                        callbackLanguage: this.setLanguage,
                        callbackUser: this.setUser,
                        callbackLogOut: this.logOut}
                )}
            </div>
        )
    }
})

const refresh = gql`mutation($input:RefreshInput!) {
    refresh(input:$input) {
        jsonWebToken
    }
}`

const refreshConfig = {
    name: 'refresh',
    options: {
        variables: {
            input: {
                refreshToken: localStorage.getItem('refreshToken')
            }
        }
    }
}

export default graphql(refresh, refreshConfig)(AppBody)