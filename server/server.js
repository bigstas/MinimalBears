// Access the data under www.minimalbears.com/graphql

import postgraphql from 'postgraphql';

// PostGraphQL provides 'connect'-style middleware to process queries
// We can add this using Meteor's WebApp.connectHandlers
// See http://meteorpedia.com/read/REST_API#WebApp.connectHandlers%20and%20connect
// Note that we can't use Picker here, because we only want this middleware for one route
WebApp.connectHandlers
    .use('/graphql', postgraphql('postgres://localhost:5432/postgres', options={development: false}))
