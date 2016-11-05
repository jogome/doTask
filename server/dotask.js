//console.log(Tasks.find().fetch());
Meteor.publish('tasks', function() {
	var currentUserId = this.userId;
	return Tasks.find({ createdBy: currentUserId }, {sort: {priority: 1}});
	//return allTasks;
});


Meteor.publish('shares', function() {
	var currentUserId = this.userId;
	return Tasks.find({ share: true });
});


