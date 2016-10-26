/* getTasksForm group*/
Template.getTasksForm.onRendered(function() {
		console.log("I rendered!");
		$("form").hide();
	});
	
Template.getTasksForm.events({
	"click .js-btn-add-task": function() {
		$("form").toggle('slow');
	} 
})
