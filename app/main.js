var React = require('react');
var ReactDOM = require('react-dom');
var Parse = require('parse');
var Nav = require('./nav.js');
var Arena = require('./arena.js');

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
                {this.state.active === 1 ? <Arena /> : []}
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