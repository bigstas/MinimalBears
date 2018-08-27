// File system
import fs from 'fs'
import path from 'path'
import process from 'process'
// GraphQL
import gql from 'graphql-tag'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
// The PostGraphQL server defines an HTTP endpoint to access the database
// To access the database in this way, the web server needs to make HTTP requests
// (The web server sends an HTTP request to itself, then redirects this to PostGraphQL)
// (The alternative would require defining another way to access the database)
// The following package allows us to make HTTP requests
// It's 'isomorphic' because the fetch function looks the same for the server and client
import fetch from 'isomorphic-fetch'

// Meteor methods!
// https://coderwall.com/p/7tpa8w/file-upload-with-meteor-method
// one method to submit a recording
// one method to accept a recording
// one method to reject a recording
// these methods can use the GraphQL server:
// https://www.apollographql.com/docs/react/reference/index.html

// Create a database client
const networkInterface = createNetworkInterface({ uri: Meteor.absoluteUrl('graphql') })
const client = new ApolloClient({networkInterface})

// cwd:
// C:\Users\Guy\git\bigstas\MinimalBears\.meteor\local\build\programs\server

Meteor.methods({
    'func'() {
        fs.writeFile('foobarbaz2.txt', 'abcde')
        
        console.log('nowwhat')
        
        client.query({query: gql`
            query {
                allLanguages {
                    nodes {
                        id
                        name
                    }
                }
            }
        `}).then((res) => {
            console.log('success')
            console.log(res)
            
        }).catch((err) => {
            console.log('error')
            console.log(err)
        })
    }
})

// TODO wrap all of these for the client, so that the JWT is added automatically
// TODO add the JWT as a header to any requests
// or check if the header is already added when calling the Meteor Method?
Meteor.methods({
    'submitAudio'(file, itemId) {
        // create row in database, get submissionId
        // save file
    },
    
    'acceptAudio'(submissionId, startTime, endTime) {
        // 
    },
    
    'rejectAudio'(submissionId) {
        
    }
})

/*

Audio files entirely outside the database (path storage).
Would need to submit audio with a meteor method
-> createNetworkInterface with isomorphic 'fetch'...
or... https://www.npmjs.com/package/apollo-local-query

But we need the network interface, so that we can add a header for authentication?
Or can we do something similar for the local query? 

*/

