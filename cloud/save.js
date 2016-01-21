// Objects for creating new database entries
var Item = Parse.Object.extend('Item');
var Pair = Parse.Object.extend('Pair');
var Audio = Parse.Object.extend('Audio');

// Find an item matching a word, or create one if none exists
var getItem = function(word, language) {
    // Find items for the given language
    var query = new Parse.Query('Item');
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

/*
Save a pair, given words.
request.params should include:
contrastId: the ID for the contrast, as a string
first: one homophone of the first item, as a string
second: one homophone of the second item, as a string
*/
Parse.Cloud.define("savePair", function(request, response) {
    // Variables available in wider scope:
    var language = null;
    var first = null;
    var second = null;
    // Get the language from the contrast
    var contrastPointer = new Parse.Object('Contrast', {id: request.params.contrastId});
    contrastPointer.fetch().then(function(contrast) {
        var languagePointer = contrast.get('Language');
        return languagePointer.fetch();
    }).then(function(languageResult) {
        language = languageResult;
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

/*
Save an audio file, given a word.
request.params should include:
file: the audio file, as a Parse.File object
languageId: the ID of the language, as a string
word: one homophone of the item, as a string
speaker: the name of the spaker, as a string
*/
Parse.Cloud.define("saveAudio", function(request, response) {
    // Get the item
    languagePointer = new Parse.Object('Language', {id: request.params.languageId});
    getItem(request.params.word, languagePointer).then(function(item) {
        // Save the audio
        var audio = new Audio();
        audio.set('File', request.params.file);
        audio.set('Item', item);
        audio.set('speaker', request.params.speaker);
        return audio.save();
    }).then(function(newAudio) {
        response.success("new audio saved with ID " + newAudio.id);
    }, function(error) {
        response.error(error);
    });
});


// We may want functions to add or modify homophones of an item, to merge items, etc.
// This is a low priority, since we can use the Parse dashboard instead.
// But we may want this kind of functionality for moderators.