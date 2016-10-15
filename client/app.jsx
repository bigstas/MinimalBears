import React from 'react';

AppBody = React.createClass({    
    getInitialState() {
        return {
            activeLanguageId: null,
            interfaceLanguage: "Polish",
            user: "Guest"
        };
    },
    
    setLanguage(langId) {
        this.setState({
            activeLanguageId: langId
        });
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
                            callbackLanguage: this.setLanguage}
                    )}
                </div>
            </div>
        );
    }
});

export default AppBody;