// Allow access to the server
Parse.initialize('sQd6phAVnaN8vGtSWIHiLb0vcxr92gSL2EpyXNK8', '10tf0eOb5UcxDPWX7ECQ86HpATQYU7YJ9apnYXId');

//var React = require('react');
//var Nav = React.createFactory(require('Nav'));

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
    document.getElementById('content')
);