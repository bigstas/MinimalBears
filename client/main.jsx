// The main script which introduces the nav bar and which pane is shown below

import React from 'react';
import ReactDOM from 'react-dom';
// remove?
import ArenaContainer from '../client/arena';
import AboutContainer from '../client/about';

import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../client/routes';

Meteor.startup(() => {
    render(renderRoutes(), document.getElementById('content'));
});

// Combine navigation bar and 'arena', to produce whole app
/*
FullContent = React.createClass({
    getInitialState() {
        return {
            active: 0
        }
    },
    
    handleNavClick(id) {
        this.setState({
            active: id
        })
    },
    
    render() {
        return (
            <div id="outerDiv">
                <Nav active={this.state.active} callbackParent={this.handleNavClick} />
            
                {this.state.active === 1 ? <ArenaContainer params={{activeLanguageId: 1}} /> : []}
            {/* {this.state.active === 2 ? <Record /> : []}
            {/*    {this.state.active === 3 ? <About /> : []}
                {this.state.active === 5 ? <Profile /> : []}
            </div>
        )
    }
});


// Run the app!
if (Meteor.isClient) {
    Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
        ReactDOM.render(<FullContent />, document.getElementById("content"));
    });
}
*/
                
