import React from 'react';
import { connect } from 'react-apollo';
import gql from 'graphql-tag';

/*
About = React.createClass({
    render() {
        return (
            <div id='about'>
                <h1>Minimal Bears: the research-based web app that improves your accent.</h1>
                <h2>What is Minimal Bears?</h2>
                <p>Minimal Bears is a web app that bla bla bla.</p>
                <h2>How do you know that this stuff works?</h2>
                <p>Your language id is {this.props.activeLanguageId} and your interface language is {this.props.interfaceLanguage}.</p>
                <p>Research carried out by Mr Green shows that bla bla. The original research article is available <a href='#'>here</a>.</p>
                <p>{this.props.data.name}</p>
            </div>
        );
    }
});
*/

function About({ data }) {
    //return <p>{data.Language.name}</p>
    return <p>Foo</p>
}


function mapQueriesToProps({ ownProps, state }) {
    return {
        data: gql`
            {
                Language(id: 1) {
                    name
                }
            }
        `
    }
};

export default connect({mapQueriesToProps})(About)
//export default About

/*
        data: gql`
            {
                Language(id: 1) {
                    name
                }
            }
        `
/*
/*

        fromQuery: gql`
            {
                query getFoo($myint Int!)
            }
        `
*/