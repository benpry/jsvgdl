var exp_id = exp_id || undefined;


var post_experiment = function (exp_id, game, time_stamp) {
	var steps = game.gameStates.length;
	var win = game.gameStates[steps-1].win;
	var score = game.gameStates[steps-1].score;
	$.ajax({
		type: 'POST',
		url: "/experiment/"+exp_id,
		data: {timeStamp: JSON.stringify(time_stamp),
		 	   gameStates: JSON.stringify([]), //JSON.stringify(game.gameStates),
		 	   score: score,
		 	   win: win,
		 	   steps: steps},
		success: function (status) {
			console.log(status)
		},
	})		
}

var next_experiment = function (exp_id, game, time_stamp, callback) {
	post_experiment(exp_id, game, time_stamp);
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

var retry_experiment = function (exp_id, game, time_stamp, callback) {
	post_experiment(exp_id, game, time_stamp);
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


