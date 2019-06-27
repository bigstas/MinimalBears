// Meteor startup script.
// <ApolloProvider> allows React to connect to Apollo
// <BrowserRouter> allows client-side routing
// The rendered page inserted into index.html under 'content'

import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { BrowserRouter } from 'react-router-dom'

import { AppBodyWithRefresh } from './app'
import { client } from './middleware'

Meteor.startup(() => {
    render(
        <ApolloProvider client={client}>
            <BrowserRouter>
                <AppBodyWithRefresh/>
            </BrowserRouter>
        </ApolloProvider>,
        document.getElementById('content')
    )
})
