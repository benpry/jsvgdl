var exp_id = exp_id || undefined

var post_experiment = function (exp_id, game, time_stamp, data) {
	var steps = game.steps
	var last_state = game.gameStates.length;
	var win = game.gameStates[last_state-1].win;
	var score = game.gameStates[last_state-1].score;
	$.ajax({
		type: 'POST',
		url: "/experiment/"+exp_id,
		data: {timeStamp: JSON.stringify(time_stamp),
		 	   gameStates: JSON.stringify('[]'), //JSON.stringify(game.gameStates),
		 	   score: score,
		 	   win: win,
		 	   steps: steps,
		 	   data: data},
		success: function (status) {
			if (status.success) {

			} else {
				console.log('could not post experiment');
			}
		},
	})		
}

var next_experiment = function (exp_id, game, time_stamp, data, callback) {
	post_experiment(exp_id, game, time_stamp, data);
	$.ajax({
		type: 'POST',
		url: `/experiment/${exp_id}/next`,
		success: function (status) {
			if (status.success) {
				callback()
			} else {
				console.log('could not retry experiment')
			}
		}
	})
}

var retry_experiment = function (exp_id, game, time_stamp, data, callback) {
	post_experiment(exp_id, game, time_stamp, data);
	$.ajax({
		type: 'POST',
		url: `/experiment/${exp_id}/retry`,
		success: function (status) {
			if (status.success) {
				callback()
			} else {
				console.log('could not retry experiment')
			}
		}
	})
}

$(document).ready(function () {
	if (exp_id == 0) {
		$('#continue').attr('id', 'return')
	}
	$('#return').click(function (e) {
		window.location.href = '/admin';
	})

})


