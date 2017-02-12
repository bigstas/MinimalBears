import React from 'react'
    
AppBody = React.createClass({    
    getInitialState() {
        // this.state.user to be a string when there is a signed-in user; otherwise, false (bool)
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
    
    render() {
        return (
            <div id="app-container" >
                {/* The nav-arena-wrapper is used to allow us to have a footer correctly positioned at the bottom of the page. */}
                <div id="nav-arena-wrapper" >
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
                <div className="footer">
                    <p className="quote">'The noblest pleasure is the joy of understanding.'- Leonardo da Vinci</p>
                    <div className="social" ></div>
                </div>
            </div>
        )
    }
})

export default AppBody