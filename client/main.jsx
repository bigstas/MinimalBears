// Meteor startup script. Runs reactRoutes, and puts the result in the 'content' div in index.html.

import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'
import Routes from './routes'
import React from 'react'
import ApolloClient from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'

// Connect to the database using Apollo
// Add middleware that adds a Json Web Token (JWT) to the request header

const httpLink = new HttpLink({ uri: '/graphql' })

const authMiddleware = setContext((request, old_context) => {
    // add authorization to the headers
    const token = localStorage.getItem('token')
    const new_context = {
        ...old_context,
        headers: {
            ...old_context.headers,
            authorization: 'Bearer ' + token || null
        }
    }
    console.log('middleware')
    console.log(new_context)
    return new_context
})

const client = new ApolloClient({
    link: authMiddleware.concat(httpLink),
    cache: new InMemoryCache()
})

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
