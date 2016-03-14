Meteor.publish('beardata', function() {
	var cursor = Bears
		.select("*")
		.from("bearcubs");
		
	return cursor;
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
    'sendSound': function(){
        var testSound = Assets.getBinary('wozza wreck.wav');
        return testSound;
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