// Post requests
var load_time = Date.now();

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
			 	   index: index,
			 	   score: score,
			 	   win: win,
			 	   steps: steps,
			 	   frames: game.time,
			 	   data: data, 
			 	   time: (Date.now()-load_time) + time},
			success: function (status) {
				if (!status.success) {
					console.log('could not put experiment');
				}
			},
		})
		index ++;	
	}
}


var next_experiment = function (exp_id, callback) {
	
	console.log(exp_id)
	if (exp_id == '0') {
		callback();
		return;
	}
	$('body').addClass('loading')
	$.ajax({
		type: 'POST', 
		url: '/experiment/'+exp_id+'/next',
		data: data,
		success: function (status) {
			if (status.success) {
				callback();
			}
		}
	})
	// post_experiment(exp_id, game, parser, data, 'next', callback);
}

var retry_experiment = function (exp_id, callback) {
	
	if (exp_id == '0') {
		callback();
		return;
	}
	$('body').addClass('loading')
	$.ajax({
		type: 'POST', 
		url: '/experiment/'+exp_id+'/retry',
		success: function (status) {
			if (status.success) {
				callback();
			}
		}
	})
}

var forfeit_experiment = function (exp_id, callback) {
	
	if (exp_id == '0') {
		callback();
		return;
	}
	$('body').addClass('loading')
	$.ajax({
		type: 'POST', 
		url: '/experiment/'+exp_id+'/forfeit',
		success: function (status) {
			if (status.success) {
				callback();
			}
		}
	})
}



/**
 * @fileoverview
 * Draw lines, polygons, circles, etc on the screen.
 * Render text in a certain font to the screen.
 */

var gamejs = require('gamejs');;
var vgdl_parser = VGDLParser(gamejs);
var game = vgdl_parser.playGame(vgdl_game.game, vgdl_game.level, color_scheme);
// var on_game_end = function () {
// }
// game.paused = false;
// gamejs.ready(game.run(on_game_end));
// console.log('game started');

var interval;
var parser;
var button_press = false;

var forfeit_game = function () {
	game.paused = true;
	button_press = true;
	forfeit_experiment(exp_id, function () {
		location.reload();
	})
}

var retry_game = function () {
	game.paused = true;
	button_press = true;
	retry_experiment(exp_id, function () {
		location.reload();
	})
}

var continue_game = function () {
	game.paused = true;
	button_press = true;
	next_experiment(exp_id, function () {
		location.reload();
	});
}

var page_refresh = function () {
	game.paused = true
	if (!button_press) {
		game.paused = true;
		retry_experiment(exp_id, function () {
			console.log('game refreshed');
		})
	}
}

$(document).on('click', '#forfeit', forfeit_game);

$(document).on('click', '#continue', continue_game);

$(document).on('click', '#return', function () {
	window.location.href = '/admin';	
})
$(document).on('click', '#retry', retry_game);

$(document).on('click', '#pause', function () {
	game.paused = !game.paused;
})
$(window).bind('beforeunload', page_refresh);


$(document).ready(function () {

	var cont_button = $('<button id="continue">Continue</button>');
	var return_button = $('<button id="return">Return</button>');

	var forfeit_div = $('<div id="forfeit-div" class="Flex-Container"></div>')
	var forfeit_text = $(`<p id="forfeit-text">If you want to forfeit the entire game and try a new one, press "Forfeit". 
		If you forfeit this game you’ll still get your bonus for the levels you won so far.</p>`);
	var forfeit_button = $('<button id="forfeit">Forfeit</button>');

	var retry_container = $('<div id="retry-div" class="Flex-Container"></div>');
	var retry_text = $('<p id="retry-text">If you get stuck, you can press "Retry" to reset this level.</p>')
	var retry_button = $('<button id="retry">Retry</button>')
	retry_container.append(retry_text)
	retry_container.append(retry_button)

	var overtime_container = $('<div id="overtime" class="Flex-Container"></div>');
	var overtime_text = $(`<p id="overtime_text">You’ve now been playing for 25 minutes. 
		If you want to play more games you can; we’ll pay you 75 cents for each game you win.</p>`);
	overtime_container.append(overtime_text);

	forfeit_div.append(forfeit_text);
	forfeit_div.append(forfeit_button);

	var end_game_delay = 1000;
	var retry_delay = 1000*data.retry_delay;
	var forfeit_delay = 1000*data.forfeit_delay-data.time;
	var ended = false;

	var on_game_end = function () {
		clearInterval(interval);
		game.paused = true;
		ended = true
		$('#retry-div').remove()
		var show_status = function () {
			var status_text = '';
			if (game.win) {
				var container = $('<div></div>');
				if (exp_id != '0') {
					var button = cont_button;
				} else {
					var button = return_button;
				}
			}
			else {
				var container = retry_container;
				var button = retry_button;
			}
			
			container.append('<br>')
			container.append(button);
			// $('#message').empty();
			$('#message').append(container)
			$('#forfeit-div').remove();
			$('#retry-text').remove();
		}	

		if (game.win) {
			$('#title').text('Game Won!')
			show_status()
			
		} else {
			$('#title').text('Game Lost!')
			window.setTimeout(show_status, end_game_delay);
		}

		if (exp_id != '0'){
			parser.time_stamp.end_time = Date.now();
			parser.post_partial(exp_id, game, data);
		}
	}

	var begin_game = function () {
		parser = new json_parser();
		interval = window.setInterval(function(){
			if (exp_id != '0') {
				parser.post_partial(exp_id, game, data)
			} else {
				return;
			}
		}, 200);

		$('#start-div').remove();
		game.paused = false;
		window.setTimeout(function () {
			console.log('timeout')
			console.log(ended);
			if (!ended) {
				console.log($('#message'));
				$('#message').empty();
				$('#message').append(retry_container);
			}
		}, retry_delay);
		// if (data.round >= 3) {
		// 	$('body').append(forfeit_div);
		// }
		window.setTimeout(function () {
			if (!ended)
				$('body').append(forfeit_div);
		}, forfeit_delay);
	}



	$('#gjs-canvas').focus();
	$('#start').click(begin_game)

	// start_modal.style.display = 'none';
	// game.paused = true;
	gamejs.ready(game.run(on_game_end));

	begin_game();
	
});

// // gamejs.ready will call your main function
// // once all components and resources are ready.
// gamejs.ready(main);
