// Meteor startup script. Runs reactRoutes, and puts the result in the 'content' div in index.html.

import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'
import Routes from './routes'
import React from 'react'
import ApolloClient from 'apollo-boost'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink, from } from 'apollo-link'
import { ApolloProvider } from 'react-apollo'

// Connect to the database using Apollo
// Add middleware that adds a Json Web Token (JWT) to the request header

const httpLink = new HttpLink({ uri: '/graphql' });

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const token = localStorage.getItem('token')
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: 'Bearer ' + token || null,
    } 
  }));

  return forward(operation);
})

const client = new ApolloClient({
  link: from([
    authMiddleware,
    httpLink
  ]),
});

// <ApolloProvider> allows React to connect to Apollo
// <Routes> allows client-side routing
// The rendered page inserted into the HTML under 'content'
Meteor.startup(() => {
    render(
        <ApolloProvider client={client}>
            <Routes/>
        </ApolloProvider>,
        document.getElementById('content'))
})
