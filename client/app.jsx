import React from 'react'

import Nav from './auxiliary/nav'
    
const AppBody = React.createClass({    
    getInitialState() {
        // this.state.user to be a string when there is a signed-in user; otherwise, false (bool)
        return {
            activeLanguageId: null,
            interfaceLanguage: "English",
            user: "Overlord" /* This is currently not the normal setting of false, as I want to be able to access the profile page to prepare graphs etc */
        }
    },
    
    setLanguage(langId) {
        this.setState({
            activeLanguageId: langId
        })
    },
    
    render() {
        return (
            <div id="app-container" >
                <Nav username={this.state.user} />
                {/* Insert the children according to routes.jsx (this.props.children), along with the childrens' props */}
                {React.cloneElement(
                    this.props.children, 
                    {activeLanguageId: this.state.activeLanguageId, 
                        interfaceLanguage: this.state.interfaceLanguage,
                        user: this.state.user,
                        callbackLanguage: this.setLanguage}
                )}
            </div>
        )
    }
})

export default AppBody