var exp_id = exp_id || undefined

var post_experiment = function (exp_id, game, parser, data, action, callback) {
	$('body').addClass('loading')
	var steps = game.steps
	var last_state = game.gameStates.length;
	var win = game.gameStates[last_state-1].win;
	var score = game.gameStates[last_state-1].score;
	parser.time_stamp.end_time = Date.now();
	$.ajax({
		type: 'POST',
		url: "/experiment/"+exp_id,
		data: {timeStamp: JSON.stringify(parser.time_stamp),
		 	   gameStates: 'end',
		 	   score: score,
		 	   win: win,
		 	   steps: steps,
		 	   data: data,
		 	   action: action},
		success: function (status) {
			if (status.success) {
				$('body').removeClass('loading')
				callback()
			} else {
				console.log('could not post experiment');
			}
		},
	})		
}

var json_parser = function () {
	this.parsed = [];
	this.time_stamp = {
		start_time: Date.now(),
		end_time: 0
	}
	var frame_init = 0;
	var index = 0;
	this.post_partial = async function (exp_id, game, data) {
		var frame_last = game.time;
		var partial = JSON.stringify(game.gameStates.slice(frame_init, frame_last));
		frame_init = frame_last;

		var steps = game.steps
		var last_state = game.gameStates.length;
		var win = game.gameStates[last_state-1].win;
		var score = game.gameStates[last_state-1].score;
		$.ajax({
			type: 'PUT',
			url: "/experiment/"+exp_id,
			data: {timeStamp: JSON.stringify(this.time_stamp),
			 	   gameStates: partial,
			 	   score: score,
			 	   win: win,
			 	   steps: steps,
			 	   data: data},
			success: function (status) {
				if (!status.success) {
					console.log('could not put experiment');
				}
			},
		})	
	}
}


var next_experiment = function (exp_id, game, parser, data, callback) {
	if (exp_id == '0') {
		callback();
		return;
	}
	post_experiment(exp_id, game, parser, data, 'next', callback);
}

var retry_experiment = function (exp_id, game, parser, data, callback) {
	if (exp_id == '0') {
		callback();
		return;
	}
	post_experiment(exp_id, game, parser, data, 'retry', callback);
}

$(document).ready(function () {
	if (exp_id == 0) {
		$('#continue').attr('id', 'return')
	}
	$('#return').click(function (e) {
		window.location.href = '/admin';
	})

})


