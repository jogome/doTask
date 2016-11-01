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
				priority: 'high',
				time: formatedTime,
				startDate: "",
				startTime: "",
				endDate: "",
				endTime: ""
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
	"updateTaskPriority": function(taskId) {
		var taskPriorityLevel = Tasks.findOne({_id: taskId}).priority;
		if (taskPriorityLevel == "normal") {
			Tasks.update({_id: taskId}, {$set: {priority: 'high'}});
		}
		else {
			Tasks.update({_id: taskId}, {$set: {priority: 'normal'}});
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
	}
	
});
