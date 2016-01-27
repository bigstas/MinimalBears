var React = require('react');
var ReactDOM = require('react-dom');
var Parse = require('parse');
var Nav = require('./nav.js');
var Gate = require('./gate.js');
var Arena = require('./arena.js');
var Record = require('./record.js');
var About = require('./about.js');
var Profile = require('./profile.js');

// Allow access to the server
Parse.initialize('sQd6phAVnaN8vGtSWIHiLb0vcxr92gSL2EpyXNK8', '10tf0eOb5UcxDPWX7ECQ86HpATQYU7YJ9apnYXId');

// Combine navigation bar and arena
var FullContent = React.createClass({
    getInitialState: function() {
        return {
            active: 0
        }
    },
    
    handleNavClick: function(id) {
        this.setState({
            active: id
        })
    },
    
    render: function () {
        return (
            <div id="outerDiv">
                <Nav active={this.state.active} callbackParent={this.handleNavClick} />
                {this.state.active === 0 ? <Gate /> : []}
                {this.state.active === 1 ? <Arena /> : []}
                {this.state.active === 2 ? <Record /> : []}
                {this.state.active === 3 ? <About /> : []}
                {this.state.active === 5 ? <Profile /> : []}
            </div>
        )
    }
});

// Render!
ReactDOM.render(
    <FullContent />,
    document.getElementById('content')
);

// Reminder: change to 'content'