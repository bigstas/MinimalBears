// File system
import fs from 'fs'
import child from 'child_process'
// GraphQL
import gql from 'graphql-tag'
import ApolloClient from 'apollo-boost'
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
const client = new ApolloClient({
    uri: Meteor.absoluteUrl('graphql')
})

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

// to call the below, use Meteor.call('moveFilesAround')
Meteor.methods({
    'moveFilesAround'() {
        // could use "spawn", "fork", "exec", or "execFile"
        // "fork" may be better for performance as it won't block other tasks
        // (Node is single-threaded)
        const passingFiles = ['goodfile.wav', 'nicefile.wav', 'correctfile.wav']
        for (let filename of passingFiles) {
            child.execFile('mv', ['/Users/stanislawpstrokonski/Desktop/_TEST/pending/' + filename, '/Users/stanislawpstrokonski/Desktop/_TEST/approved/'], (error, stdout, stderr) => {
                if (error) {
                    console.log("MinBears error:", stderr)
                } else {
                    console.log('MinBears stdout:', stdout)
                }
            })
        }
    }
})

// TODO: the below maybe doesn't need to work like the rest of the app because it's not throught react-apollo?
// INSERT INTO public.audio_edit (file, moderator, stamp, from_start, from_end, volume)
const moderationMutation = gql`mutation ($input: EditAudioInput!) {
    editAudio (input: $input) {
        clientMutaitonId
    }
}` // returns void, so follow what e.g. completeTutorialMutation does

const moderationMutationConfig = {
    name: 'moderationMutation',
    options: {
        variables: {
            input: {
                clientMutaitonId: "0" /* not used but gql appears to demand it */
            }
        }
    }
}

// call this like so: Meteor.call('trimAudio', start, duration)
Meteor.methods({
    'trimAudio'(start, duration) { // TODO: put parameters in here
        // Note how these two options on how to spin off a child process differ in syntax:
        // child.execFile(file[, args][, options][, callback])
        // child.exec(command[, node options][, callback])
        const inputFile = "/Users/stanislawpstrokonski/Desktop/software/MinimalBears/public/finish.wav"
        const outputFile = "/Users/stanislawpstrokonski/Desktop/output0000.wav"
        child.exec( `ffmpeg -ss ${start} -i ${inputFile} -t ${duration} ${outputFile}`,
            (error, stdout, stderr) => { // callback -- after trimming, call the SQL or log the error
                if(error) {
                    console.log("MinBears error:", stderr)
                    console.log(error)
                    //console.log("stdout:", stdout)
                } else {
                    console.log("MinBears Success! Successfully trimmed the file.")
                    // TODO: call the SQL!
                    // ... but how? Above is the react-apollo setup for it
                }
        })
    }
})