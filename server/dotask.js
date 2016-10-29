//console.log(Tasks.find().fetch());
Meteor.publish('tasks', function() {
	var currentUserId = this.userId;
	// Return only the tasks that belong to the currentUser
	return Tasks.find({ createdBy: currentUserId });
});

