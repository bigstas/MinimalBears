import React from 'react'

import Nav from './auxiliary/nav'
    
const AppBody = React.createClass({    
    getInitialState() {
        // this.state.user to be a string when there is a signed-in user; otherwise, false (bool)
        return {
            activeLanguageId: null,
            interfaceLanguage: "English",
            /* user setting:
            false - for deployment. Also allows us to view/program things from the point of view of a guest (a non-logged-in user).
            any string - for development purposes. This allows us to program everything for a logged-in user. */
            user: "Overlord" 
        }
    },
    
    setLanguage(langId) {
        this.setState({
            activeLanguageId: langId
        })
    },
    // TO DO: The props below are old, some (most? all?) not necessary. Revise.
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