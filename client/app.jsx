import React from 'react'

AppBody = React.createClass({    
    getInitialState() {
        // this.state.user to be a string when there is a signed-in user otherwise, false (bool)
        return {
            activeLanguageId: null,
            interfaceLanguage: "English",
            user: false
        }
    },
    
    setLanguage(langId) {
        this.setState({
            activeLanguageId: langId
        })
    },
    
    submitAudio(msg) {
        alert(`Your audio has not been submitted. Staś and Guy are yet to implement this feature.
By the way, here is a special message: ` + msg)
    },
    
    render() {
        return (
            <div id="container" >
                <div id="content-container">
                    <Nav username={this.state.user} />
                    {/* Insert the children according to routes.jsx (this.props.children), along with the childrens' props */}
                    {React.cloneElement(
                        this.props.children, 
                        {activeLanguageId: this.state.activeLanguageId, 
                            interfaceLanguage: this.state.interfaceLanguage,
                            user: this.state.user,
                            callbackLanguage: this.setLanguage,
                            recordingWords: ["youth in Asia", "euthanasia", "a mission", "omission", "emission"],
                            submitAudio: this.submitAudio}
                    )}
                </div>
            </div>
        )
    }
})

export default AppBody