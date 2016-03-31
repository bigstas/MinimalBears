Meteor.publish('beardata', function() {
	var bearCursor = Bears
		.select("*")
		.from("bearcubs");
		
    return bearCursor;
});

Meteor.publish('langdata', function() {
    var langCursor = Languages
        .select("*")
        .from("languages");
    
    return langCursor;
});


Meteor.methods({
	'getFerocity': function(age) {return "angry"},
	'doNothing': function(nothing) {return null}
});

/* Meteor.publishTransformed('beardata', function() {
	return Bears
		.select("*")
		.from("bearcubs")
		.fetch()
		.serverTransform({
			ferocity: function(bear) {
				return "angry";
			}
		});
}); */

console.log(Bears.fetch()); 


Meteor.methods({
    // we will actually do this with URLs, not getBinary
    'sendSound': function() {
        var testSound = Assets.getBinary('wozza wreck.wav');
        return testSound;
    },
    'saveMyBear': function(bear) {
        Bears.insert({
            age: bear.age,
            colour: bear.colour
        }).run();
        console.log("I am inserting a bear");
        console.log(bear.age);
        console.log(bear.colour);
    }
});

/*
if (Meteor.isServer) {
    console.log('hello');
    var stuff = JSON.parse(Assets.getText('test.json'));
    console.log(stuff);
    
    var testSound = Assets.getBinary('wozza wreck.wav');
}
*/