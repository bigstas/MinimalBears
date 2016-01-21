// Objects for creating new database entries
var Item = Parse.Object.extend('Item');
var Pair = Parse.Object.extend('Pair');
var Audio = Parse.Object.extend('Audio');

// Find an item matching a word, or create one if none exists
var getItem = function(word, language) {
    // Find items for the given language
    var query = new Parse.Query('Item');
    console.log("language: " + language);
    //var language = new Parse.Object('Language', {id: languageId});
    query.equalTo('Language', language);
    // Only return items containing the homophone (equalTo checks if the array contains the word)
    query.equalTo('Homophones', word);
    return query.find().then(function(results) {
        // If there is a match, return it (as a promise)
        if (results.length) {
            return Parse.Promise.as(results[0]);
        } else {
            // Otherwise create a new item and return it
            var item = new Item();
            item.set('Homophones', [word]);
            item.set('Language', language);
            item.set('Audio', []);
            return item.save();
        }
    });
};

// Save a pair, given words
Parse.Cloud.define("savePair", function(request, response) {
    // Variables available in wider scope:
    var language = null;
    var first = null;
    var second = null;
    // Get the language from the contrast
    console.log("contrastId: " + request.params.contrastId);
    var contrastPointer = new Parse.Object('Contrast', {id: request.params.contrastId});
    contrastPointer.fetch().then(function(contrast) {
        var languagePointer = contrast.get('Language');
        console.log("languagePointer: " + languagePointer);
        return languagePointer.fetch();
    }).then(function(languageResult) {
        console.log("language before: " + language);
        language = languageResult;
        console.log("language after: " + language);
        // Find the items
        return getItem(request.params.first, language);
    }).then(function(firstResult) {
        first = firstResult;
        return getItem(request.params.second, language);
    }).then(function(secondResult) {
        second = secondResult;
        // Save the pair
        var pair = new Pair();
        pair.set('Contrast', contrastPointer);
        pair.set('First', first);
        pair.set('Second', second);
        return pair.save();
    }).then(function(newPair) {
        response.success("new pair saved with ID " + newPair.id);
    }, function(error) {
        response.error(error);
    });
});

// Save an audio file, given a word
Parse.Cloud.define("saveAudio", function(request, response) {
    // 
});

// We may want functions to add or modify homophones of an item, to merge items, etc.
// This is a low priority, since we can use the Parse dashboard instead.
// But we may want this kind of functionality for moderators.