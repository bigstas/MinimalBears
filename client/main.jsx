// Meteor startup script.
// <ApolloProvider> allows React to connect to Apollo
// <Routes> allows client-side routing
// The rendered page inserted into index.html under 'content'

import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'
import React from 'react'
import { ApolloProvider } from 'react-apollo'

import Routes from './routes'
import { client } from './middleware'

Meteor.startup(() => {
    render(
        <ApolloProvider client={client}>
            <Routes/>
        </ApolloProvider>,
        document.getElementById('content')
    )
})
