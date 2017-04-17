var start_new_experiment = function (data) {
	window.location.replace('/experiment/'+data.exp_id);
}

var create_new_experiment = function () {
	console.log('creating new experiment');
	$.ajax({
		type: "POST",
		url: "/experiment/new",
		success: start_new_experiment,
	});
}

$(document).ready(function () {
	console.log('page finished');
	$(':button').click(create_new_experiment);

})


