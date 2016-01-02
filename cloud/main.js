// Return all languages
Parse.Cloud.define("fetchLanguages", function(request, response) {
    var query = new Parse.Query('Language');
    query.ascending('Name');
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
    var contrastPointer = new Parse.Object('Contrast', {id: request.params.contrastId});
    // Variables that should be available in wider scope:
    var pair = null;
    var items = [];
    var correctIndex = null;
    contrastPointer.fetch().then(function(contrast) {
        // Choose a pair, fetch it, and fetch the items
        var pairIndex = Math.floor(Math.random() * contrast.get('Pairs').length);
        return contrast.get('Pairs')[pairIndex].fetch()
    }).then(function(_pair) {
        pair = _pair;
        return pair.get('First').fetch()
    }).then(function(first) {
        items.push(first);
        return pair.get('Second').fetch()
    }).then(function(second) {
        items.push(second);
        // Choose the correct item, choose a file and fetch it
        correctIndex = Math.floor(Math.random() * 2);
        var audioArray = items[correctIndex].get('Audio');
        var audioIndex = Math.floor(Math.random() * audioArray.length);
        return audioArray[audioIndex].fetch()
    }).then(function(audio) {
        // Package the response
        var url = audio.get('File')._url;
        var answers = [0,1].map(function(i) {
            return {text: items[i].get('Homophones')[0], correct: correctIndex===i ? true : false}
        });
        var result = {items: answers,
                      url: url};
        response.success(JSON.stringify(result));
    });
});