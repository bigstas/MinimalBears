//'About' page

var React = require('react');

var About = React.createClass({
    render: function () {
        return (
            <div id='about'>
                <h1>Minimal Bears: the research-based web app that improves your accent.</h1>
                <h2>What is Minimal Bears?</h2>
                <p>Minimal Bears is a web app that bla bla bla.</p>
                <h2>How do you know that this stuff works?</h2>
                <p>Research carried out by Mr Green shows that bla bla. The original research article is available <a href='#'>here</a>.</p>
            </div>
        )
    }
})

module.exports = About;