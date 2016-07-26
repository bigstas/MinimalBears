// Meteor startup script. Runs reactRoutes, and puts the result in the 'content' div in index.html.

import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from '../client/routes';
import React from 'react';

import ApolloClient from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
const client = new ApolloClient();

Meteor.startup(() => {
    render(
        <ApolloProvider client={client}>
            {renderRoutes()}
        </ApolloProvider>,
        document.getElementById('content'));
});
