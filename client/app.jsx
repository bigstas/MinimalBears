import React from 'react'
import jwtDecode from 'jwt-decode'
import { withApollo, graphql, compose } from 'react-apollo'
import Translate from 'react-translate-component'

import Nav from './auxiliary/nav'
import Routes from './routes'
import { refreshMutation, accountInfoQuery } from '/lib/graphql'

// AppContainer is a lightweight container for the Nav bar and current page

const AppContainer = (props) => {
    // If the user is not logged in, provide empty account data
    if (!props.isLoggedIn) {
        props = {
            accountInfo: {
                error: null,
                loading: false,
                getAccountInfo: {
                    username: null,
                    interface: null,
                    native: [],
                    customNative: null,
                    tutorial: false,
                    email: null
                }
            },
            username: null,
            ...props
        }
    }
    
    return ( 
        <div>
            <Nav callbackLogOut={props.callbackLogOut} username={props.username} isLoggedIn={props.isLoggedIn} />,
            <Routes {...props} />
        </div>
    )
}

// If the user is logged in, fetch account info
// Make username easily accessible as a prop

const AppContainerWithData = graphql(accountInfoQuery, {
    name: 'accountInfo',
    skip: (props) => (!props.isLoggedIn),
    props: (props) => {
        const username = (props.accountInfo.loading || props.accountInfo.error) ?
            null :
            props.accountInfo.getAccountInfo.username
        return {username, ...props}
    }
})(AppContainer)

// AppBody contains app-level state (such as whether the user is logged in)
// and provides authentication methods

class AppBody extends React.Component {
    constructor(props) {
        super(props)
        const raw_jwt = localStorage.getItem('token')
        this.state = {
            isLoggedIn: !!raw_jwt, // true if there is a jwt in local storage, false otherwise
            activeLanguageId: null
        }
    }
    
    setLanguage(langId) {
        this.setState({
            activeLanguageId: langId
        })
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
        // Props to be passed to AppContainer
        let pageProps = {
            isLoggedIn: this.state.isLoggedIn,
            activeLanguageId: this.state.activeLanguageId,
            callbackLanguage: this.setLanguage.bind(this),
            callbackUser: this.setUser.bind(this),
            callbackLogOut: this.logOut.bind(this),
        }
        return <AppContainerWithData {...pageProps} />
    }
}

// withApollo allows direct access to the "client" object as a prop
export default withApollo(graphql(refreshMutation, {name: 'refresh'})(AppBody))