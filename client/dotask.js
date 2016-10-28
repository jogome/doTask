/* getTasksForm group*/
Template.getTasksForm.onRendered(function() {
		$("form").hide();
	});


/////////
//// HELPERS
/////////////////
Template.taskWindow.helpers({
	"displayTasks": function() {
		var tasks = Tasks.find({});
		return tasks;
	}
});


Template.dateAndTime_Starting_Ending.helpers({
	"priorityLevel": function() {
		var taskId = this._id;
		var taskPriorityLevel = Tasks.findOne({_id: taskId}).priority;
		if (taskPriorityLevel == 'normal') {
			return "high-priority";
		}
		else {
			return  "normal-priority";
		} 
	 },
	 "checkBox": function() {
		var taskId = this._id;
		//console.log("The value= "+Tasks.findOne({_id: taskId}).boxChecked);
		var checkBoxValue = Tasks.findOne({_id: taskId}).boxChecked;
		if (checkBoxValue == true) {
			console.log("Box value = "+checkBoxValue);
			return "checked";
		}
		else {
			return "";
		}
	 }
});
	
/////////
//// EVENTS
/////////////////

Template.getTasksForm.events({
	"click .js-btn-add-task": function() {
		// tottle the input tasks text fields
		$("form").toggle('slow');
	},
	"submit form": function(event) {
	   // prevents the form to refresh when submited the tasks
		event.preventDefault(); 
		// Getting the value entered in the task title and task details fields 
		var newTaskTitle = event.target.taskTitle.value;
		var newTaskDetail = event.target.taskDetail.value;
		// Inserts the task title and the task detail in the database
		Tasks.insert({
			taskTitle: newTaskTitle,
			taskDetail: newTaskDetail,
			boxChecked: false,
			priority: 'high',
			time: formatedTime,
			startDate: "",
			startTime: "",
			endDate: "",
			endTime: ""
		});
		
		$("form").toggle('slow');
			$(".js-change-add-task-status").html("<span class='added-task'>New Task Added!</span>");
			setTimeout(function() {$(".js-change-add-task-status").html("<span>Add New Task!</span>").show();}, 2000);
	}
	 
});

Template.taskWindow.events({
	"click .glyphicon-remove": function(event) {
		// To remove tasks
		// getting the id of the clicked task 
		var itemId = this._id;
		
		/*////// MODAL confirm remove//*/ 
		var modalTitle = document.getElementById("modal-header-delete");
		var modalText = document.getElementById("modal-text-delete");
		modalTitle.innerHTML = "Task manager - Delete task"
		modalText.innerHTML = "Are you sure you want to delete permanentely this task?";
		
		$('#modalDeletePost').modal('show');
		var confirm_cancel = document.getElementById("cancel_delete");
		var confirm_ok = document.getElementById("ok_delete");
		
		
		
		confirm_ok.onclick = function() {
			// add a hide effect and then remove the task
			$('#'+itemId).hide('slow', function() {
					Tasks.remove({_id: itemId});
				});
				return false; 
	  }
	}
	
});

/* Formating the date and time*/
var dateNow = new Date();
	// formating the date
	var yearMonthDay = dateNow.toLocaleDateString();
	var time = dateNow.toLocaleTimeString();
	var formatedTime = yearMonthDay + " at " + time;


Template.dateAndTime_Starting_Ending.events({
	"change input[type=date].startDate": function(event) {
			var taskId = this._id;
			var selectedStartDate = event.target.value;
			console.log("Starting date preview = "+selectedStartDate);
			//alert(selectedStartDate);
			Tasks.update({_id: taskId}, {$set:{startDate: selectedStartDate}});
		},
		"change input[type=date].endDate": function(event) {
			var taskId = this._id;
			// //Session.set("taskId_from_endDate", taskId);
			var selectedEndDate = event.target.value;
			console.log("Ending date preview = "+selectedEndDate);
			//alert(selectedStartDate);
			Tasks.update({_id: taskId}, {$set:{endDate: selectedEndDate}});
			// //Session.set("endDate_for_thisId", selectedEndDate);
		},
		"change input[type=time].startTime": function(event) {
			var taskId = this._id;
			var selectedStartTime = event.target.value;
			console.log("starting time = "+selectedStartTime);
			//alert(selectedStartDate);
			Tasks.update({_id: taskId}, {$set:{startTime: selectedStartTime}});
		},
		"change input[type=time].endTime": function(event) {
			var taskId = this._id;
			var selectedEndTime = event.target.value;
			console.log("ending time = "+selectedEndTime);
			//alert(selectedStartDate);
			Tasks.update({_id: taskId}, {$set:{endTime: selectedEndTime}});
		},
		"click .js-task-priority": function() {
			console.log("You clicked on me!");
			var taskId = this._id;
			//Session.set("actual_Id", taskId);
			console.log(taskId);
			var taskPriorityLevel = Tasks.findOne({_id: taskId}).priority;
			if (taskPriorityLevel == "normal") {
				Tasks.update({_id: taskId}, {$set: {priority: 'high'}});
			}
			else {
				Tasks.update({_id: taskId}, {$set: {priority: 'normal'}});
			}	
				 
		},
		"click .checkbox": function() {
			console.log("You clicked on a checkbox!");
			console.log("ID"+this._id);
			var taskId = this._id;
			var checkBoxValue = Tasks.findOne({_id: taskId}).boxChecked;
			if (checkBoxValue == false) {
				Tasks.update({_id: taskId}, {$set: {boxChecked: true}});
			}
			else {
				Tasks.update({_id: taskId}, {$set: {boxChecked: false}});
			}	
		}	
});
