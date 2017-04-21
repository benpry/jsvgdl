var exp_id = exp_id || undefined;

var load_experiment = function (data) {
	if (data.exp_id) {
		window.location.replace('/experiment/'+data.exp_id);
	} else {
		window.location.replace('/admin');
	}
}

var create_new_experiment = function () {
	console.log('creating new experiment');
	$.ajax({
		type: "POST",
		url: "/experiment",
		success: load_experiment,
	});
}

var continue_experiment = function (exp_id, game) {

	return function () {
		console.log('continuing experiment');
		$.ajax({
			type: 'PUT',
			url: "/experiment/"+exp_id,
			data: JSON.stringify(game.getFullState()),
			success: load_experiment
		})		
	}
}

$(document).ready(function () {
	console.log('page finished');
	$('#begin').click(create_new_experiment);

})


