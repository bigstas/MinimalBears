// Meteor startup script. Runs reactRoutes, and puts the result in the 'content' div in index.html.

import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'
import { renderRoutes } from './routes'
import React from 'react'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'

// Connect to the database using Apollo
// Add middleware that adds a Json Web Token (JWT) to the request header
const networkInterface = createNetworkInterface({ uri: '/graphql' })
networkInterface.use([{
    applyMiddleware(req, next) {
        if (!req.options.headers) {
            req.options.headers = {}  // Create the header object if needed.
        }
        let token = localStorage.getItem('token')
        if (token) {
            req.options.headers['authorization'] = 'Bearer ' + token
        }
        next()
    }
}])

// Create an Apollo client that will connect to the database
const client = new ApolloClient({
    networkInterface
})

Meteor.startup(() => {
    render(
        <ApolloProvider client={client}>  // allow React to connect to Apollo
            {renderRoutes()}  // client-side routing
        </ApolloProvider>,
        document.getElementById('content'))  // insert into the HTML
})
