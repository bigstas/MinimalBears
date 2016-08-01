import React from 'react';
import { connect } from 'react-apollo';
import gql from 'graphql-tag';

// A dummy class, that has one prop, "data".
// The prop should be an object returned from PostGraphQL,
// for a query for all rows in the "fakebear" table.
// The class will display the "bar" field of the first row in the results.
MyClass = React.createClass({
    render() {
        // As the props come from an asynchronous query, we cannot assume everything is there
        // If the data has not been returned yet:
        var text = "placeholder"  
        // If the data has been returned:
        if (!this.props.data.loading) {
            text = this.props.data.fakebearNodes.nodes[0].bar
        }
        // Render either way:
        return <p>{text}</p>
    }
})

// react-apollo provides a "connect" function to wrap a class:
// the wrapper fetches data, then gives it to the wrapped class as props.
// "connect" requires a function to link queries to props:
// this function should return an object where each property name is a prop name for the wrapped class,
// and each property must itself have a property "query" which gives a GraphQL query.
// (Properties other than "query" are for extra control on the functionality).
// (The function can also take two arguments: the wrapper's props, and the redux state)
function mapQueriesToProps({ ownProps, state }) {
    return {
        data: {
            query: gql`{fakebearNodes {
                nodes {
                    foo
                    bar
                }
            }}`
        }
    }
};

// Wrap the class according to the function
export default connect({mapQueriesToProps})(MyClass)