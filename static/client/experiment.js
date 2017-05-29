var exp_id = exp_id || undefined;
console.log(exp_id)
var load_experiment = function (data) {
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


var post_experiment = function (exp_id, game, time_stamp, callback) {
	if (exp_id != '0') {
		$.ajax({
			type: 'POST',
			url: "/experiment/"+exp_id,
			data: {timeStamp: JSON.stringify(time_stamp),
			 	   gameStates: JSON.stringify(game.gameStates)},
			success: callback,
		})		
	} else {
		callback();
	}
}

var retry_experiment = function (exp_id, game, time_stamp, callback) {
	if (exp_id != '0') {
		$.ajax({
			type: 'PUT',
			url: '/experiment/'+exp_id,
			data: {timeStamp: JSON.stringify(time_stamp),
					gameStates: JSON.stringify(game.gameStates)},
			success: callback
		})
	} else {
		callback();
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


