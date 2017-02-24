// Access the data under www.minimalbears.com/graphql

import postgraphql from 'postgraphql'
import secret from './jwt_secret'

// PostGraphQL provides 'connect'-style middleware to process queries
// We can add this using Meteor's WebApp.connectHandlers
// See http://meteorpedia.com/read/REST_API#WebApp.connectHandlers%20and%20connect
// Note that we can't use Picker here, because we only want this middleware for one route
WebApp.connectHandlers.use(//'/graphql',
    // Specify database and role, and use 'public' schema (by default)
    postgraphql('postgres://admin@localhost:5432/minimal_bears', 'public', {
        graphiql: true,
        graphqlRoute: '/graphql',
        graphiqlRoute: '/graphiql',
        //jwtSecret: secret,  // This will be used to verify tokens in the Authorization header, and signing JWT tokens you return in procedures.
        //jwtPgTypeIdentifier: 'jwt_token',  // Postgres type identifier for the compound type which will be signed as a JWT token if ever found as the return type of a procedure. Can be of the form: my_schema.my_type. You may use quotes as needed: "my-special-schema".my_type.
        //pgDefaultRole: 'guest',  // If no role was provided in a provided JWT token, this role will be used
        //dynamicJson: true,  // Setting this to true enables dynamic JSON which will allow you to use any JSON as input and get any arbitrary JSON as output. By default JSON types are just a JSON string
        //disableDefaultMutations: true,
        //disableQueryLog: true
    })
)
