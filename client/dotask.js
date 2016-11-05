/* doTasak*/

Template.getTasksForm.onRendered(function() {
		$("form").hide();
	});
	

Meteor.subscribe('tasks');
Meteor.subscribe('shares'); 


/////////	
/////// ROUTING
////////////////
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
  
  Router.route('/task_windows', function () {
	this.render('navigation',{
		to:"navbar"
	});
	
	this.render('breadcrumbsTaskWindowActive',{
		to:"breadcrumbs"
	});
	
	this.render('getTasksForm',{
		to:"inputform"
	});
    
	this.render('taskWindow',{
		to:"main"
	});
  });
  
  Router.route('/task_title_list', function () {
	this.render('navigation',{
		to:"navbar"
	});
	
	this.render('getTasksForm',{
		to:"inputform"
	});
	
	this.render('taskTitleList',{
		to:"main"
	});
    
  });    

  
  Router.route('/task_help', function () {
	this.render('navigation',{
		to:"navbar"
	});
	
	this.render('helpPage',{
		to:"main"
	});
 
  });   

  
  Router.route('/detail/:_id',function(){
		this.render('navigation',{
			to:"navbar"
		});

		this.render('taskDetail',{
			to:"main",
			data:function(){
				console.log("This is a task detail window and id params is " + this.params._id);
				Session.set("detail_id", this.params._id);
				//The template will render with its data context, no helper needed
				return Tasks.findOne({_id:this.params._id});
			}
		});
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
		// Just for the sake of styling with css, to add a class
		var taskId = this._id;
		var taskPriorityLevel = Tasks.findOne({_id: taskId}).priority;
		if (taskPriorityLevel == 'normal') {
			return "normal-priority";
		}
		else {
			return  "high-priority";
		} 
	 },
	 "priority": function() {
		// to switch the text to "High Priority" and "Normal Priority"
		var taskId = this._id;
		var taskPriorityLevel = Tasks.findOne({_id: taskId}).priority;
		if (taskPriorityLevel == 'normal') {
			return true
		}
		else {
			Session.get("priority");
			return  false;
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
	 "getUser": function(user_id) {
		var user= Meteor.users.findOne({_id: user_id});
		if (user) {
			Session.set("user", user.username);
			return user.username;
		}
		else {
			return "unknown";
		}
		console.log("The user name is: "+user.username);
	},
	"shareStatus": function() { // VER O CODIGO
		var taskId = this._id;
		var status = Tasks.findOne({_id: taskId}).share;
		if (status === true) {
		   return "checked";
		}
	}
});


Template.taskTitleList.helpers({
	"titleList": function() {
		var tasks = Tasks.find({});
		return tasks;
	},
	"checkBox": function() {
		var taskId = this._id;
		//console.log("The value= "+Tasks.findOne({_id: taskId}).boxChecked);
		var checkBoxValue = Tasks.findOne({_id: taskId}).boxChecked;
		if (checkBoxValue == true) {
			console.log("Box value = "+checkBoxValue);
			Session.set("checkbox_status", checkBoxValue);
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
		
		// Get the user name
		var user = Meteor.user().profile;
		user[Object.keys(user)[0]];
		var names = user[Object.keys(user)[0]];
			
		if(newTaskTitle.length !== 0 && newTaskDetail.length !== 0) {
			// Inserts the task title and the task detail in the database
			Meteor.call('insertTasks', newTaskTitle, newTaskDetail, formatedTime, names);
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
			var taskPriorityLevel = Tasks.findOne({_id: taskId}).priority;
			console.log("NEW"+taskPriorityLevel);
			
			Meteor.call("updateTaskPriority", taskId, taskPriorityLevel); 
		},
		"click .checkbox": function() {
			console.log("You clicked on a checkbox!");
			console.log("ID"+this._id);
			var taskId = this._id;
			Meteor.call("updateCheckboxSatus", taskId);	
		},
		"click .js-share": function(event) {
			console.log("You clicked on share " + event.target.checked +"" +this._id);
			var taskId = this._id;
			var shareCheckboxStatus = event.target.checked;
			Meteor.call("shareStatus", taskId, shareCheckboxStatus);
		}	
});


Template.taskTitleList.events({
	"titleList": function() {
		var tasks = Tasks.find({});
		return tasks;
	},
	"click .checkbox": function() {
		console.log("You clicked on a checkbox!");
		console.log("ID"+this._id);
		var taskId = this._id;
		Meteor.call("updateCheckboxSatus", taskId);	
	},
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

// managing the active tab (MUST find a more elegant way)
Template.navigation.events({
	"click li.tasks-window": function() {
		$("li.active").removeClass('active');
		$("li.tasks-window").addClass('active');		
	},
	"click li.home": function() {
		$("li.home").addClass('active');
		$("li.tasks-window").removeClass('active');
		$("li.tasks-title-list").removeClass('active');
		$("li.tasks-help").removeClass('active');		
	},
	"click li.tasks-title-list": function() {
		$("li.tasks-window").removeClass('active');
		$("li.home").removeClass('active');
		$("li.tasks-help").removeClass('active');
		$("li.tasks-title-list").addClass('active');		
	},
	"click li.tasks-help": function() {
		$("li.tasks-window").removeClass('active');
		$("li.home").removeClass('active');
		$("li.tasks-title-list").removeClass('active');
		$("li.tasks-help").addClass('active');		
	},
	"click .navbar-brand":function() {
		$("li.home").addClass('active');
		$("li.tasks-window").removeClass('active');
		$("li.tasks-title-list").removeClass('active');
		$("li.tasks-help").removeClass('active');
	}
});



