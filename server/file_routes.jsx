// Make audio files accessible by a URL

// The following packages are built into NodeJS
import fs from 'fs'  // interact with the file system
import path from 'path'  // manipulate file paths
import process from 'process'  // get info about the running process

// The Picker atmosphere package allows us to define server-side routes
// :_id is passed to the function via params (the colon indicates it's a variable)
// res is an instance of NodeJS http.ServerResponse
Picker.route('/audio/:_id', function(params, req, res, next) {
    // Get the filepath
    // (only use the basename, to stop a user changing directory)
    // The current working directory should be .../default/bundle/programs/server/
    const filepath = path.join(process.cwd(), '../../../audio', path.basename(params._id))
    
    // Make an asynchronous call, which has a callback
    fs.readFile(filepath, function(err, data) {
        if (err) {
            // If there was an error reading the file, log the error and return an error message
            console.log(err.message)
            res.end(err.message)  // (TODO: we might want to do something better than this...?)
        } else {
            // If the file was read successfully, return the data
            res.end(data, null)  // null encoding
        }
    })
    
    // (TODO: we might want to handle errors in the request...?)
})


// Picker for PDF files -- documentation same as above. There is only one difference - 'articles' instead of 'audio' in two places.
Picker.route('/articles/:_id', function(params, req, res, next) {
    const filepath = path.join(process.cwd(), '../../../articles', path.basename(params._id))
    
    fs.readFile(filepath, function(err, data) {
        if (err) {
            console.log(err.message)
            res.end(err.message)
        } else {
            res.end(data, null)
        }
    })
})