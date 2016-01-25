require('cloud/jobs.js'); // Background jobs
require('cloud/fetch.js'); // Functions to fetch from database
require('cloud/save.js'); // Functions to save to database

// Return all items
// Here for the time being, but ultimately we don't want to do this.
Parse.Cloud.define("fetchItems", function(request, response) {
    var query = new Parse.Query('Item');
    query.ascending('Homophones');  // this may not work as sorting arrays, not strings ints or floats
    query.limit(500);      // default limit is 100 but we have over 200 items now (max limit is 1000, you need tricks to get around that) 
    query.find({
        success: function(results) {
            response.success(results.map(function(c) {
                return JSON.stringify(c)
            }))
        },
        error: function() {
            response.error("Item query failed")
        }
    });
});