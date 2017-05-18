var exp_id = exp_id || undefined;

var load_experiment = function (data) {
	console.log('loading experimeent, I suppose')
	if (data.exp_id) {
		window.location.href = '/experiment/'+data.exp_id;
	} else {
		window.location.href = '/admin';
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
			data: game.getFullState(),
			success: load_experiment
		})		
	}
}

$(document).ready(function () {
	console.log(exp_id);
	if (exp_id == 0) {
		$('#continue').attr('id', 'return')
	}
	console.log('page finished');
	$('#begin').click(create_new_experiment);
	$('#return').click(function (e) {
		window.location.href = '/admin';
	})

})


