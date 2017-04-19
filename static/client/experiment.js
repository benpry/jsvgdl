var exp_id = exp_id || undefined;

var reload_experiment = function (data) {
	window.location.replace('/experiment/'+data.exp_id);
}

var create_new_experiment = function () {
	console.log('creating new experiment');
	$.ajax({
		type: "POST",
		url: "/experiment",
		success: reload_experiment,
	});
}

var continue_experiment = function (exp_id) {

	return function () {
		console.log('continuing experiment');
		$.ajax({
			type: 'PUT',
			url: "/experiment/"+exp_id,
			success: reload_experiment
		})		
	}
}

$(document).ready(function () {
	console.log('page finished');
	$('#begin').click(create_new_experiment);
	$('#continue').click(continue_experiment(exp_id));

})


