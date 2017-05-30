var exp_id = exp_id || undefined;
var load_experiment = function (data) {
	if (data.exp_id) {
		window.location.href = '/experiment/'+data.exp_id;
	} else {
		window.location.href = '/admin';
	}
}

var create_new_experiment = function () {
	$.ajax({
		type: "POST",
		url: "/experiment",
		success: load_experiment,
	});
}

var ajax_experiment = function (action, exp_id, game, time_stamp, callback) {
	var steps = game.gameStates.length;
	var win = game.gameStates[steps-1].win;
	var score = game.gameStates[steps-1].score;
	if (exp_id != '0') {
		$.ajax({
			type: action,
			url: "/experiment/"+exp_id,
			data: {timeStamp: JSON.stringify(time_stamp),
			 	   gameStates: JSON.stringify(game.gameStates),
			 	   score: score,
			 	   win: win,
			 	   steps: steps},
			success: callback,
		})		
	} else {
		callback();
	}
}

var post_experiment = function (exp_id, game, time_stamp, callback) {
	ajax_experiment('POST', exp_id, game, time_stamp, callback);
}

var retry_experiment = function (exp_id, game, time_stamp, callback) {
	ajax_experiment('PUT', exp_id, game, time_stamp, callback);
}

$(document).ready(function () {
	if (exp_id == 0) {
		$('#continue').attr('id', 'return')
	}
	$('#begin').click(create_new_experiment);
	$('#return').click(function (e) {
		window.location.href = '/admin';
	})

})


