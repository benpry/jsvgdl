// Post requests
var load_time = Date.now();

var json_parser = function () {
	this.time_stamp = {
		start_time: Date.now(),
		end_time: 0
	}
	var frame_init = 0;
	var index = 0;
	this.post_partial = async function (exp_id, game, data, callback) {
		callback({success: true});
		return;
		if (exp_id == '0') return;
		var frame_last = game.time;
		var partial = JSON.stringify(game.gameStates.slice(frame_init, frame_last));
		frame_init = frame_last;

		var steps = game.steps
		var last_state = game.gameStates.length;
		var win = game.gameStates[last_state-1].win;
		var score = game.gameStates[last_state-1].score;
		// $.ajax({
		// 	type: 'PUT',
		// 	url: "/experiment/"+exp_id,
		// 	data: {timeStamp: JSON.stringify(this.time_stamp),
		// 	 	   gameStates: partial,
		// 	 	   index: index,
		// 	 	   score: score,
		// 	 	   win: win,
		// 	 	   steps: steps,
		// 	 	   frames: game.time,
		// 	 	   data: data, 
		// 	 	   time: (Date.now()-load_time) + time},
		// 	success: callback,
		// })
		index ++;	
	}
}


var next_experiment = function (exp_id, callback) {
	
	console.log(exp_id)
	if (exp_id == '0') {
		callback();
		return;
	}
	callback();
	// post_experiment(exp_id, game, parser, data, 'next', callback);
}

var retry_experiment = function (exp_id, callback) {
	
	if (exp_id == '0') {
		callback();
		return;
	}
	callback();
}



/**
 * @fileoverview
 * Draw lines, polygons, circles, etc on the screen.
 * Render text in a certain font to the screen.
 */
var gamejs = require('gamejs');;
var vgdl_parser = VGDLParser(gamejs);


// var on_game_end = function () {
// }
// game.paused = false;
// gamejs.ready(game.run(on_game_end));
// console.log('game started');

var interval;
var parser;
var button_press = false;

var retry_game = function () {
	// $('body').addClass('loading')
	game.paused = true;
	button_press = true;
	location.reload();
	// parser.post_partial(exp_id, game, data, function () {
	// 	retry_experiment(exp_id, function () {
	// 		location.reload();
	// 	})
	// });
}

var page_refresh = function () {
	// $('body').addClass('loading')
	game.paused = true
	location.reload();
}

var go_back = function () {
	window.location.href = '/games';
}

$(document).on('click', '#return', go_back);
$(document).on('click', '#retry', retry_game);

$(document).on('click', '#pause', function () {
	game.paused = !game.paused;
})



$(document).ready(function () {
	var game = vgdl_parser.playGame(vgdl_game.game, vgdl_game.level, color_scheme);

	var cont_button = $('<button id="continue">Continue</button>');
	var return_button = $('<button id="return">Return</button>');

	var retry_container = $('<div id="retry-div" class="Flex-Container"></div>');
	var retry_text = $('<p id="retry-text">If you get stuck, you can press "Retry" to reset this level.</p>')
	var retry_button = $('<button id="retry">Retry</button>')
	retry_container.append(retry_text)
	retry_container.append(retry_button)

	var end_game_delay = 1000;
	var retry_delay = 1000*data.retry_delay;
	var ended = false;

	var on_game_end = function () {
		// clearInterval(interval);
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

			$('#message').append(container)
			$('#retry-text').remove();
		}	

		if (game.win) {
			$('#title').text('Game Won!')
			show_status()
			
		} else {
			$('#title').text('Game Lost!')
			window.setTimeout(show_status, end_game_delay);
		}
	}

	var begin_game = function () {
		console.log('starting game');

		$('#start-div').remove();
		game.paused = false;

	}



	$('#gjs-canvas').focus();
	$('#start').click(begin_game)

	game.paused = true;
	gamejs.ready(game.run(on_game_end));
	
});

// // gamejs.ready will call your main function
// // once all components and resources are ready.
// gamejs.ready(main);
