import { createPostGraphileSchema } from 'postgraphile'
import { GraphQLSchema } from 'graphql'
import { validate } from 'graphql/validation'
import chai from 'chai'

import secret from '/server/jwt_secret'
import * as allQueries from '/lib/graphql'  // object of form {queryName: query}

describe('Queries valid according to GraphQL schema', function() {
    let schema
    before(function () {
        return createPostGraphileSchema('postgres://admin@localhost:5432/minimal_bears', 'public', {
            jwtSecret: secret,  // Used to sign tokens and verify tokens in the Authorization header
            jwtPgTypeIdentifier: 'public.json_web_token',  // Postgres type to be signed as a JWT
            pgDefaultRole: 'guest',  // If no role is provided in a JWT, this role will be used
            disableDefaultMutations: true
        }).then(newSchema => {
            schema = newSchema
        }).catch(error => {
            console.error(error)
        })
    })
    
    for (const queryName in allQueries) {
        it(`${queryName} is valid`, function() {
            // 'validate' returns a list of errors
            chai.assert.isEmpty(validate(schema, allQueries[queryName]))
        })
    }
})
