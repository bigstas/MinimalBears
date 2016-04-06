/*
const {
  Link,
  Navigation,
  State,
  RouteHandler
} = ReactRouter;
*/

import React from 'react';
import { Link, Navigation, State, RouteHandler } from 'react-router'; // could probably remove Link; not sure about Navigation and State
import { createContainer } from 'meteor/react-meteor-data';


AppBody = React.createClass({    
    getInitialState() {
        return {
            activeLanguageId: 1,
            interfaceLangauge: "English",
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
                    <Nav />
                    <p>{this.props.stas}</p>
            {/* the above line is just test code to see how props work with createContainer */}
                    {/* this.props.children */}
                    {React.cloneElement(
                        this.props.children, 
                        {activeLanguageId: this.state.activeLanguageId, 
                            interfaceLanguage: this.state.interfaceLangauge,
                            user: this.state.user,
                            callbackApp: this.setLanguage}
                    )}
                </div>
            </div>
        );
    }
});

export default createContainer(({params}) => {
    const stas = "dude";
    return {
        stas
    };
}, AppBody);