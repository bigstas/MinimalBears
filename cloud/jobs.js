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
