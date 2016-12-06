/* doTask Methods */
Meteor.methods({
	'insertTasks': function (newTaskTitle, newTaskDetail, formatedTime, user) {
		// Testing the type of data inputed in the text fields
		check(newTaskTitle, String);
		check(newTaskDetail, String);
		check(formatedTime, String);
		// User logged in
		var currentUserId = Meteor.userId();
		
		// Inserts the task title and the task detail in the database
		if(currentUserId) {
			Tasks.insert({
				taskTitle: newTaskTitle,
				taskDetail: newTaskDetail,
				createdBy: currentUserId,
				userFirtName: user,
				boxChecked: false,
				priority: "normal",
				time: formatedTime,
				startDate: "",
				startTime: "",
				endDate: "",
				endTime: "",
				share: false
			});
			
		}
		
	},
	"removeTask": function(itemId) {
		check(itemId, String);
		var currentUserId = Meteor.userId();
		
		if(currentUserId) {
			Tasks.remove({_id: itemId, createdBy: currentUserId});
		}
	},
	"updateStartDate": function(taskId, selectedStartEndDateTime) {
		Tasks.update({_id: taskId}, {$set:{startDate: selectedStartEndDateTime}});     
	},
	"updateEndDate": function(taskId, selectedStartEndDateTime) {
		Tasks.update({_id: taskId}, {$set:{endDate: selectedStartEndDateTime}});
	},
	"updateStartTime": function(taskId, selectedStartEndDateTime) {
		Tasks.update({_id: taskId}, {$set:{startTime: selectedStartEndDateTime}});
	},
	"updateEndTime": function(taskId, selectedStartEndDateTime) {
		Tasks.update({_id: taskId}, {$set:{endTime: selectedStartEndDateTime}});
	},
	"updateTaskPriority": function(taskId, taskPriorityLevel) {
		if (taskPriorityLevel === "high") {
			console.log("YES!");
			Tasks.update({_id: taskId}, {$set: {priority: 'normal'}});
			//var highPriority = "high";
			//Session.set("priority", highPriority);
		}
		else if((taskPriorityLevel === "normal")){
			Tasks.update({_id: taskId}, {$set: {priority: 'high'}});
			//var normalPriority = "Normal";
			//Session.set("priority", normalPriority);
		}	
	},
	"updateCheckboxSatus": function(taskId) {
		var checkBoxValue = Tasks.findOne({_id: taskId}).boxChecked;
		if (checkBoxValue == false) {
			Tasks.update({_id: taskId}, {$set: {boxChecked: true}});
		}
		else {
			Tasks.update({_id: taskId}, {$set: {boxChecked: false}});
		}
	},
	"shareStatus": function(taskId, checkBoxValue) {
		// update the share status by getting the checkbox value
		Tasks.update({_id: taskId}, {$set: {share: checkBoxValue} })
	},
	"checkIfFriendExist": function(friendOriginalId) {
		//return (Meteor.Friends.findOne({originalFriendId: friendOriginalId})) ? true : false;
		var currentUserId = Meteor.userId();
		var friendAdded = Friends.findOne({originalFriendId: friendOriginalId});
		if (currentUserId) {
			if (friendAdded) {
				console.log("This user already exist!");
			}
			else {
				console.log("This user does not exist yet!");
			}
		}
	},
	"addFriend": function(friendUserId, firstName, lastName) {
		// Filtering parameters
		check(friendUserId, String);
		check(firstName, String);
		check(lastName, String);
		
		// current user
		var currentUserId = Meteor.userId();
		console.log("Current user ID: "+currentUserId);
		// Search if the user already exist
		var friendAdded = Friends.findOne({originalFriendId: friendUserId});
		
		// counts the number of elements in the collection for further use
		var numberOfElementsInCollection = Friends.find().count(); 
		
		if (currentUserId) { // check if user is logged in
				var i = 0;
				var searchForComparisonPurpose;
			    var searchCreatedByForComparisonPurpose;
			    
			    // Comparing values to prevent duplicates
				for (i; i<numberOfElementsInCollection; i++) {
					searchCreatedByForComparisonPurpose = Friends.find().fetch()[i].createdBy;
					searchOriginalFriendIdForComparisonPurpose = Friends.find().fetch()[i].originalFriendId;
					
					if (searchCreatedByForComparisonPurpose === currentUserId && searchOriginalFriendIdForComparisonPurpose === friendUserId) {
						console.log("This friend is already added!");
						return;
					}
				} // END for loop to compare values
			
				// If the friend does not exist yet, the friend is inserted
				console.log("This user does not exist yet!");
				console.log("inserting friend...");
				Friends.insert({
					createdBy: currentUserId,//this.userId,
					originalFriendId: friendUserId,
					friendFirstName: firstName,
					frienLastName: lastName
				});
				console.log("New friend inserted!");
		  
		} // END if Meteor.userId() to check if user is logged in;	
	},
	"removeFriendFromList": function(itemId) {
		check(itemId, String);
		var currentUserId = Meteor.userId();
		
		if(currentUserId) {
			Friends.remove({_id: itemId, createdBy: currentUserId});
		}
		console.log("Removed friend: "+itemId);
	},
	
});
