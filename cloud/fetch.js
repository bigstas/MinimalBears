// Return image or sound effects
Parse.Cloud.define("fetchMedia", function(request, response) {
    var query = new Parse.Query(request.params.mediaType);
    query.equalTo('Name', request.params.Name);
    console.log('we are here');
    query.find({
        success: function(results) {
            // Stringify the results, so that we can return a flat object
            response.success(
                results[0].get('File')._url
            )
        },
        error: function() {
            response.error("Media query failed")
        }
    });
});


// Return all languages
Parse.Cloud.define("fetchLanguages", function(request, response) {
    var query = new Parse.Query('Language');
    query.ascending('Name');
    query.select('objectId', 'Name', 'ISO_639_3');
    query.find({
        success: function(results) {
            // Stringify the results, so that we can return a flat object
            response.success(results.map(function(c) {
                return JSON.stringify(c)
            }))
        },
        error: function() {
            response.error("Language query failed")
        }
    });
});

// Return all contrasts for a given language
Parse.Cloud.define("fetchContrasts", function(request, response) {
    var query = new Parse.Query('Contrast');
    query.equalTo('Language', new Parse.Object('Language', {id: request.params.languageId}));
    query.ascending('Name');
    query.find({
        success: function(results) {
            // Stringify the results, so that we can return a flat object
            response.success(results.map(function(c) {
                return JSON.stringify(c)
            }))
        },
        error: function() {
            response.error("Contrast query failed")
        }
    });
});

// Given a pointer to a contrast,
// return a pair of options, a correct option, and a url for a recording of the correct option
Parse.Cloud.define("fetchPair", function(request, response) {
    // Variables available in wider scope
    var pair = null;
    var items = [];
    var contrastPointer = new Parse.Object('Contrast', {id: request.params.contrastId});
    contrastPointer.fetch().then(function(contrast) {
        // Choose a pair and fetch the items
        var pairIndex = Math.floor(Math.random() * contrast.get('Pairs').length);
        pair = contrast.get('Pairs')[pairIndex];
        return pair[0].fetch();
    }).then(function(first) {
        items.push(first);
        return pair[1].fetch();
    }).then(function(second) {
        items.push(second)
        // Choose the correct item, and choose a file
        correctIndex = Math.floor(Math.random() * 2);
        var audioArray = items[correctIndex].get('Audio');
        var audioIndex = Math.floor(Math.random() * audioArray.length);
        // Package the response
        var url = audioArray[audioIndex];
        var answers = [0,1].map(function(i) {
            return {text: items[i].get('Homophones')[0], correct: correctIndex===i ? true : false}
        });
        var result = {items: answers,
                      url: url};
        response.success(JSON.stringify(result));
    });
});