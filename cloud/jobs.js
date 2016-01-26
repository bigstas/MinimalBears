var Pairsdata = require('cloud/pairsdata.js'); // pairs are stored here

// looks for strings in arrays of strings
function matchSomewhere(sample, testArray) {
    for (i=0; i < testArray.length; i++) {
        if (testArray[i] === sample) { return true; }
    }
    return false;
}

// This is the most biggest chunk of code I have written without testing any of it.
// Recipe for disaster. Here goes!
// Produce pairs from pairsdata.js
Parse.Cloud.job("readPairs", function(request, status) {
    // *first, delete all existing pairs*
    // [TO DO]
    
    // *then, fill in all the pairs*
    var Pair = Parse.Object.extend("Pair");
    // iterate over all languages
    for (lang in Pairsdata.allPairs) {
        var currentLanguage = allPairs[lang];
        // iterate over all contrasts in the language
        for (x=0; x < currentLanguage; x++) {
            var currentContrast = currentLanguage[x];
            // iterate over all pairs in the contrast
            for (y=0; y < currentContrast.length; y++) {                
                var pair = new Pair();
                var currentPair = currentContrast[y];
                console.log(currentPair);
                
                // loop through all items to find items referred to by pairs, and extract the objectId
                var query = new Parse.Query("Item");
                var firstItemId = "";
                var secondItemId = "";
                
                query.each(function(item) {
                    var homophones = item.get("Homophones");
                    if ( matchSomewhere(currentPair[0], homophones) ) {
                        firstItemId = item.id;
                        console.log(firstItemId + " is a " + (typeof firstItemId));
                    } else if ( matchSomewhere(currentPair[1], homophones) ) {
                        secondItemId = item.id;
                        console.log(secondItemId + " is a " + (typeof secondItemId));
                    }
                }).then(function() {
                    status.success("No errors iterating over items");
                }, function(error) {
                    status.error(error);
                });
                
                // define the pointers, set them as pair properties, and save
                var Contrast = new Parse.Object("Contrast");
                var Item1 = new Parse.Object("Item");
                var Item2 = new Parse.Object("Item");
                Contrast.id = currentContrast.contrastId;
                Item1.id = firstItemId;
                Item2.id = secondItemId;
                pair.set("Contrast", Contrast);
                pair.set("First", Item1);
                pair.set("Second", Item2);
                
                pair.save(null, {
                    success: function(audio) {
                        console.log('Pair saved');
                    },
                    error: function(error) {
                        console.log('Failed to create new pair, with error code: ' + error.message);
                    }
                });
            }
        }
    }
});


// Cache pairs of items in contrasts
Parse.Cloud.job("contrastPairPointers", function(request, status) {
    // Iterate through all contrasts
    var query = new Parse.Query("Contrast");
    query.each(function(contrast) {
        // For each contrast, find all pairs pointing to it
        var pairPointers = [];
        var pairQuery = new Parse.Query("Pair");
        pairQuery.equalTo("Contrast", contrast);
        return pairQuery.each(function(pair) {
            // For each of these pairs, add the items to the list
            pairPointers.push([pair.get("First"), pair.get("Second")]);
        }).then(function() {
            // Once we've got all the items, update the contrast
            contrast.set("Pairs", pairPointers);
            return contrast.save();
        });
    }).then(function() {
        status.success("Pairs successfully cached in contrasts");
    }, function(error) {
        status.error(error);
    });
});

// Cache audio files in items
Parse.Cloud.job("itemAudioPointers", function(request, status) {
    // Iterate through all items
    var query = new Parse.Query("Item");
    query.each(function(item) {
        // For each item, find all audio files pointing to it
        var audioPointers = [];
        var audioQuery = new Parse.Query("Audio");
        audioQuery.equalTo("Item", item);
        return audioQuery.each(function(audio) {
            // For each audio file, add the url to the list
            audioPointers.push(audio.get("File")._url);
        }).then(function() {
            // Once we've got all the urls, update the item
            item.set("Audio", audioPointers);
            return item.save();
        });
    }).then(function() {
        status.success("Audio successfully cached in items");
    }, function(error) {
        status.error(error);
    })
});


// Database sanity:
// Should check that no two items in the same language share a homophone
// Should check that no pair has items that are the same
// Should check that no contrast has no pairs?  Or just don't show these...
// Should check that no item in a contrast's pairs has no files?  Or just don't add these pairs