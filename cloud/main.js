// Given a pointer to a contrast,
// return a pair of options, a correct option, and a url for a recording of the correct option
Parse.Cloud.define("fetchPair", function(request, response) {
    var contrast = request.params.pointer.fetch();
    
    // Choose a pair, fetch it, and fetch the items
    var pairIndex = Math.floor(Math.random() * contrast.Pairs.length);
    var pair = contrast.Pairs[pairIndex].fetch();
    var first = pair.First.fetch();
    var second = pair.Second.fetch();
    
    // Choose the correct item, choose a file and fetch it
    var correctIndex = Math.floor(Math.random() * 2);
    var audioIndex = Math.floor(Math.random() * items[correctIndex].Audio.length);
    var audio = items[correct].Audio[audioIndex].fetch();
    var url = audio.File._url;
    
    // Package the items
    var items = [{text: first.Homophones[0], correct: correctIndex===0 ? true : false},
                {text: second.Homophones[0], correct: correctIndex===1 ? true : false}];
    
    response.success({items: items,
                      url: url});
});

Parse.Cloud.define("fetchLanguages", function(request, response) {
    var query = new Parse.Query('Language');
    query.ascending('Name');
    query.find({
        success: function(results) {
            response.success(results);
        },
        error: function() {
            response.error("Language query failed");
        }
    });
});

Parse.Cloud.define("fetchContrasts", function(request, response) {
    var query new Parse.Query('Contrast');
    query.equalTo('Language', request.params.pointer);
    query.ascending('Name');
    query.find({
        success: function(results) {
            response.success(results);
        },
        error: function() {
            response.error("Contrast query failed")
        }
    });
});