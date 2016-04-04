//'About' page

import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

About = React.createClass({
    render() {
        return (
            <div id='about'>
                <h1>Minimal Bears: the research-based web app that improves your accent.</h1>
                <h2>What is Minimal Bears?</h2>
                <p>Minimal Bears is a web app that bla bla bla.</p>
                <h2>How do you know that this stuff works?</h2>
                <p>Research carried out by Mr Green shows that bla bla. The original research article is available <a href='#'>here</a>.</p>
            </div>
        );
    }
});

// see https://themeteorchef.com/snippets/react-router-basics/#tmc-working-with-params
export default createContainer(({params, location}) => {
    const { shoutout } = params;
    return {
        shoutout
    };
}, About);