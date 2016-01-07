var React = require('react');
var ReactDOM = require('react-dom');
var Parse = require('parse');
var Nav = require('./nav.js');
var Arena = require('./arena.js');

// Allow access to the server
Parse.initialize('sQd6phAVnaN8vGtSWIHiLb0vcxr92gSL2EpyXNK8', '10tf0eOb5UcxDPWX7ECQ86HpATQYU7YJ9apnYXId');

// Combine navigation bar and arena
var FullContent = React.createClass({
    render: function () {
        return (
            <div id="outerDiv">
                <Nav />
                <Arena />
            </div>
        )
    }
});

// Render!
ReactDOM.render(
    <FullContent />,
    document.body
);

// Reminder: change to 'content'