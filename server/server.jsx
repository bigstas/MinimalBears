// Access the data under www.minimalbears.com/graphql

import postgraphql from 'postgraphile' //'postgraphql'
import secret from './jwt_secret'

// PostGraphQL provides 'connect'-style middleware to process queries
// We can add this using Meteor's WebApp.connectHandlers
// See http://meteorpedia.com/read/REST_API#WebApp.connectHandlers%20and%20connect
// Note that we can't use Picker here, because we only want this middleware for one route
WebApp.connectHandlers.use(
    postgraphql('postgres://admin@localhost:5432/minimal_bears', 'public', {  // Specify database, role, schema
        graphiql: true,
        graphqlRoute: '/graphql',
        graphiqlRoute: '/graphiql',
        bodySizeLimit: '5MB',
        jwtSecret: secret,  // Used to sign tokens and verify tokens in the Authorization header
        jwtPgTypeIdentifier: 'public.json_web_token',  // Postgres type to be signed as a JWT
        pgDefaultRole: 'guest',  // If no role is provided in a JWT, this role will be used
        disableDefaultMutations: true
    })
)
