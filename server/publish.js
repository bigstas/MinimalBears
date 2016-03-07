// Bears = new PG.Table('bearcubs');

Meteor.publish('beardata', function() {
    return Bears
        .select("*")
        .from("bearcubs")
});

console.log(Bears.fetch());