/* getTasksForm group*/

//Meteor.subscribe("todotasks");

Template.getTasksForm.onRendered(function() {
		$("form").hide();
	});

	/// routing
  Router.configure({
	 layoutTemplate: 'ApplicationLayout' 
  });
  
  Router.route('/', function () {
   this.render('navigation',{
		to:"navbar"
	});
	this.render('welcomePage',{
		to:"main"
	});
  });
  
  Router.route('/task_list', function () {
	this.render('navigation',{
		to:"navbar"
	});
	
	this.render('getTasksForm',{
		to:"inputform"
	});
    
	this.render('taskWindow',{
		to:"main"
	});
  });

	
Meteor.subscribe('tasks');
	
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
	 },
	"getUser": function() {
		//return Meteor.call("getUserName");
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
		
		if(newTaskTitle.length !== 0 && newTaskDetail.length) {
			Meteor.call('insertTasks', newTaskTitle, newTaskDetail, formatedTime);
		}
		else {
		
			/*////// MODAL confirm remove//*/ 
			var modalTitle = document.getElementById("modal-alert");
			var modalText = document.getElementById("modal-text-alert");
			modalTitle.innerHTML = "doTask inserting task data"
			modalText.innerHTML = "You have to fill out all fields!";
		
			$('#modalAlertWindow').modal('show');
			
			var confirm_ok = document.getElementById("ok_thanks");
		
		
		
			
			return false;
			//alert("one field missing to fill out");
			return false;
		}

		
		$("form").toggle('slow');
			$(".js-change-add-task-status").html("<span class='added-task'>New Task Added!</span>");
			setTimeout(function() {$(".js-change-add-task-status").html("<span>Add New Task!</span>").show();}, 2000);
			
		// Reseting input text fields
		event.target.taskTitle.value = "";
		event.target.taskDetail.value = "";
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
					//Tasks.remove({_id: itemId});
					Meteor.call('removeTask', itemId);
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
			
			Meteor.call("updateStartDate", taskId, selectedStartDate);
		},
		"change input[type=date].endDate": function(event) {
			var taskId = this._id;
			var selectedEndDate = event.target.value;
			console.log("Ending date preview = "+selectedEndDate);
			
			Meteor.call("updateEndDate", taskId, selectedEndDate);
		},
		"change input[type=time].startTime": function(event) {
			var taskId = this._id;
			var selectedStartTime = event.target.value;
			
			Meteor.call("updateStartTime", taskId, selectedStartTime);
		},
		"change input[type=time].endTime": function(event) {
			var taskId = this._id;
			var selectedEndTime = event.target.value;
			
			Meteor.call("updateEndTime", taskId, selectedEndTime);
		},
		"click .js-task-priority": function() {
			console.log("You clicked on me!");
			var taskId = this._id;
			
			Meteor.call("updateTaskPriority", taskId); 
		},
		"click .checkbox": function() {
			console.log("You clicked on a checkbox!");
			console.log("ID"+this._id);
			var taskId = this._id;
			
			Meteor.call("updateCheckboxSatus", taskId);	
		}	
});


Template.navigation.events({
	"click li.tasks-window": function() {
		$("li.active").removeClass('active');
		$("li.tasks-window").addClass('active');		
	},
	"click li.home": function() {
		$("li.tasks-window").removeClass('active');
		$("li.home").addClass('active');		
	}
});

