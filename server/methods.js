// File system
import fs from 'fs'
import child from 'child_process'
// GraphQL
import ApolloClient from 'apollo-boost'
// The PostGraphQL server defines an HTTP endpoint to access the database
// To access the database in this way, the web server needs to make HTTP requests
// (The web server sends an HTTP request to itself, then redirects this to PostGraphQL)
// (The alternative would require defining another way to access the database)
// The following package allows us to make HTTP requests
// It's 'isomorphic' because the fetch function looks the same for the server and client
import fetch from 'isomorphic-fetch'

import { allLanguagesQuery, editAudioMutation } from '/lib/graphql'

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
        
        client.query({query: allLanguagesQuery}).then((res) => {
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

// call this like so: Meteor.call('trimAudio', volume, trim)
// TODO: could refactor this so it doesn't call both edits if it doesn't have to
Meteor.methods({
    'editAudio'(volume=1, trim={ start: 0, duration: null }) {
        // Note how these two options on how to spin off a child process differ in syntax:
        // child.execFile(file[, args][, options][, callback])
        // child.exec(command[, node options][, callback])
        const inputFile = "/Users/stanislawpstrokonski/Desktop/software/MinimalBears/public/finish.wav"
        const tmpFile = "/Users/stanislawpstrokonski/Desktop/tmpAudio.wav"
        const outputFile = "/Users/stanislawpstrokonski/Desktop/output0000.wav"
        let duration // total input file duration
        // FIRST, find out the file duration
        child.exec( `ffprobe -i ${inputFile} -show_entries format=duration -v quiet -of csv="p=0"`, (error, stdout, stderr) => {
            if(error) {
                // note that either or both of the stderr and error parameters may contain error messages
                console.log(`Minbears error while getting duration of ${inputFile}:`, stderr)
                console.log(error)
            } else {
                duration = stdout; // type is string
                console.log("duration:", duration);
                if(trim.duration === null || trim.duration === undefined) {
                    trim.duration = Infinity // ...is this sensible?
                }
                // TODO: also catch any other weird eventualities like negative durations
                // SECOND, trim the file, and save it as a temporary file
                child.exec( `ffmpeg -ss ${trim.start} -i ${inputFile} -t ${trim.duration} ${tmpFile}`, (error, stdout, stderr) => {
                    // callback -- after trimming, adjust volume, or log any errors
                    if(error) {
                        console.log(`MinBears error while trimming ${inputFile} with start ${trim.start} and duration ${trim.duration}:`, stderr)
                        console.log(error)
                    } else {
                        console.log("trim successful!")
                        // THIRD, adjust the volume
                        // see https://trac.ffmpeg.org/wiki/AudioVolume
                        // can also set volume by decibel level
                        // could also normalise the volume (see the same webpage above)
                        child.exec( `ffmpeg -i ${tmpFile} -filter:a "volume=${volume}" ${outputFile}`, (error, stdout, stderr) => {
                            if (error) {
                                console.log(`MinBears error while adjusting volume of ${inputFile} to ${volume}:`, stderr)
                                console.log(error)
                            } else {
                                console.log("volume adjustment successful!")
                                // FOURTH, update the editing table with the new information
                                // TODO: do this properly with the right parameters and everything
                                const fromEnd = duration - (trim.start + trim.duration)
                                console.log("fromStart, trim.duration, fromEnd")
                                console.log(trim.start, trim.duration, fromEnd)
                                // below gives permission denied unless you're logged in as moderator
                                // TODO: try this, logged in as moderator
                                /*client.query({
                                    query: editAudioMutation,
                                    variables: {
                                        input: {
                                            file: inputFile, // TODO: probably only want the name, not the path as this will give
                                            fromStart: {
                                                seconds: trim.start
                                            },
                                            fromEnd: {
                                                seconds: fromEnd
                                            },
                                            volume: volume
                                        }
                                    }
                                }).then((res) => {
                                    // FINALLY, callback (on the client??)
                                    // TODO: now send some sort of message to the front end to say that everything has been completed...
                                    console.log('success')
                                    console.log(res)  
                                }).catch((err) => {
                                    console.log('error')
                                    console.log(err)
                                })*/
                                console.log("closing child processes")
                            }
                        })
                    }
                })
            }
        })
    }
})