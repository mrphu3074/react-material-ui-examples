Meteor.publish("Lists", function(){
    return Collection.Lists.find();
});
Meteor.publish("Tasks", function(conds){
    check(conds, Object);
    check(conds.listId, Number);
    return Collection.Tasks.find({
        listId: conds.listId
    });
});
