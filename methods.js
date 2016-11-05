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
		//var taskPriorityLevel = Tasks.findOne({_id: taskId}).priority;
		//console.log("The priority of this task is:" + taskPriorityLevel);
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
	}
	
});
