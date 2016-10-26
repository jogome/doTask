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
			taskDetail: newTaskDetail
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
