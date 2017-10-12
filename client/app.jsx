import React from 'react'
import jwtDecode from 'jwt-decode'

import Nav from './auxiliary/nav'
    
const AppBody = React.createClass({    
    getInitialState() {
        // this.state.user to be a string when there is a signed-in user; otherwise, false (bool)
        return {
            activeLanguageId: null,
            interfaceLanguage: "English",
            username: false, 
            userId: false
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
        let userId
        const timestamp = (new Date).getTime()
        if (!!jwt && timestamp > jwt.exp * 1000) {
            this.setState({
                username: jwt.id,  // TODO get username
                userId: jwt.id
            })
            localStorage.setItem('token', raw_jwt)   
        } else {
            this.logOut()
        }
    },
    
    logOut() {
        this.setState({
            username: false,
            userId: false
        })
        localStorage.removeItem('token')
    },
    
    //TODO: refresh tokens
    
    componentWillMount() {
        const raw_jwt = localStorage.getItem('token')
        if (!!raw_jwt) {
            this.setUser(raw_jwt)
        }
    },
    
    // TO DO: The props below are old, some (most? all?) not necessary. Revise.
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
                        interfaceLanguage: this.state.interfaceLanguage,
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

export default AppBody