import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

// A dummy class, that has one prop, "data".
// The prop should be an object returned from PostGraphQL,
// for a query given at the bottom
// The class will display the results.
MyClass = React.createClass({
    render() {
        // As the props come from an asynchronous query, we cannot assume everything is there
        // If the data has not been returned yet:
        var text = "placeholder"  
        // If the data has been returned:
        if (!this.props.data.loading) {
            text = this.props.data.getCurrentUser.output
            //text = this.props.data.authenticate
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

let getUser = {
    query: gql`mutation($input: GetCurrentUserInput!) {
        getCurrentUser(input: $input) {
            output
        }
    }`,
    variables: {
        input: {
            clientMutationId: 'a'
        }
    }
}

let login = {
    query: gql`query ($email: String!, $password: String!) {
        authenticate(tryEmail: $email, tryPassword: $password)
    }`,
    variables: {
        email: 'guido@example.com',
        password: 'foobar'
    }
}

let update = {
    query: gql`mutation {
        updateAudio(input: {rowId: 50000, newRowId: 60000}) {
            audio {
                rowId
            }
        }
    }`
}

let submit = {
    query: gql`mutation {
        submitAudio (input: {
            file: "1",
            speaker: "Guy",
            item: 15
        }) {
            output
        }
    }`
}
// see http://dev.apollodata.com/core/ ...
// ... but remember we have the old version ...
// they probably have some function that makes GraphQL mutations...
// also, the instantiated ApolloClient object is passed to react-apollo's ApolloProvider...
// is it a bad idea to instantiate a new ApolloClient?
// http://dev.apollodata.com/react/mutations.html

function mapQueriesToProps({ ownProps, state }) {
    return {
        data: getUser
        //data: login
    }
}

// Wrap the class according to the function
// export default connect({mapQueriesToProps})(MyClass)
// hello from Gergo