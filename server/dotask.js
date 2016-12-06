/* doTask. Publishing tasks content */
Meteor.publish('tasks', function() {
	/*TRYING TO SORT IT OTHER WAY*/
	var priorityLevel = Tasks.find({priority: "high"});
	console.log("The priority level is: " + priorityLevel);
    /* / */ 
	var currentUserId = this.userId;
	return Tasks.find({ createdBy: currentUserId }, {sort: [["priority", "asc"]]}); // The same as {sort: {priority: 1}}
});

/* Sharing content */
Meteor.publish('shares', function() {
	var currentUserId = this.userId;
	return Tasks.find({ share: true });
});

/* Publish all users of the system */
Meteor.publish("userList", function () {
           return Meteor.users.find({}, {sort: {"profile.firstName": 1}});
});
    
/* Publish list of personal friends */
Meteor.publish("personalFriendList", function () {
		   //var actualUser = Meteor.user();
		   var currentUserId = this.userId; 
           return Friends.find({createdBy: currentUserId}, {sort: {friendFirstName: -1}});
});
