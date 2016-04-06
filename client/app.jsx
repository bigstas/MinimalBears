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
            activeLanguageId: 0,
            interfaceLangauge: "English",
            user: "Guest"
        };
    },
    
    setLanguage(langId) {
        this.setState({
            activeLanguageId: langId
        });
    },
    
    // There is a funny choice in how data is to be handled.
    // Either one can call this.props.callbackApp(langId) to update the language,
    // or one call propagate with callbacks through parents.
    // I think having both available as options seems fine 
    // (atm selector calls back to train, and train back to app; choosing the language in some sort of settings tab would probably directly use this.props.callbackApp(langId) ),
    // but it might be neater to choose one way or the other rather than have both.
    render() {
        return (
            <div id="container" >
                <div id="content-container">
                    <Nav />
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

export default AppBody;