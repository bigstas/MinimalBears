/*
// Ideally we would DRY this but I don't know if Meteor allows that
Meteor.publish('beardata', function() {
	var cursor = Bears
		.select("*")
		.from("bearcubs");
    return cursor;
});

Meteor.publish('langdata', function() {
    var cursor = Languages
        .select("*")
        .from("Languages");
    return cursor;
});

Meteor.publish('contrastdata', function() {
    var cursor = Contrasts
        .select("*")
        .from("Contrasts");
    return cursor;
});


Meteor.methods({
	'getFerocity': function(age) {return "angry"},
	'doNothing': function(nothing) {return null}
});
*/

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

/*
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

*/