//console.log(Tasks.find().fetch());
Meteor.publish('tasks', function() {
	var currentUserId = this.userId;
	// Return only the tasks that belong to the currentUser
	var allTasks = Tasks.find({ createdBy: currentUserId }, {sort:{priority: -1}});
	return allTasks;
});

