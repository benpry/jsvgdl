/**
 * @fileoverview
 * Draw lines, polygons, circles, etc on the screen.
 * Render text in a certain font to the screen.
 */


console.log('is this even running?')
var gamejs = require('gamejs');
console.log('gamejs loaded');
var vgdl_parser = VGDLParser(gamejs);
console.log('game parsed');
var game = vgdl_parser.	playGame(vgdl_game.game, vgdl_game.level);
// var on_game_end = function () {
// }
// game.paused = false;
// gamejs.ready(game.run(on_game_end));
// console.log('game started');

var time_stamp = {
	start_time: 0,
	end_time: 0
}

var retry_game = function () {
	game.paused = true;
	time_stamp.end_time = Date.now();
	retry_experiment(exp_id, game, time_stamp, function () {
		window.location.reload();
	})
}

$(document).on('click', '#continue', function () {
	window.location.href = `/experiment/${exp_id}`
})
$(document).on('click', '#return', function () {
	window.location.href = '/admin';	
})
$(document).on('click', '#retry', retry_game);

$(document).ready(function () {
	var retry_container = $('<div id="retry-div" class="Flex-Container"></div>');
	var retry_button = $('<button id="retry">Retry</button>')
	retry_container.append(retry_button)

	var end_game_delay = 1000;

	var on_game_end = function () {
		time_stamp.end_time = Date.now();
		game.paused = true;
		$('#retry-div').remove()
		var show_status = function () {
			var status_text = '';
			if (game.win) {
				status_text = 'game won';
				var container = $('<div id="end-div" class="Flex-Container"></div>');
				if (exp_id != '0') {
					var cont_button = $('<button id="continue">Continue</button>')
				} else {
					var cont_button = $('<button id="return">Return</button>')
				}
			}
			else {
				status_text = 'game lost';
				var container = retry_container;
				var cont_button = retry_button;
			}
			
			var status = $(`<p id="status">${status_text}</p>`);
			container.append(status);
			container.append(cont_button);
			$('body').append(container)
		}	

		if (game.win) {
			post_experiment(exp_id, game, time_stamp, function () {
				window.setTimeout(show_status, end_game_delay);
			})
		} else {
			window.setTimeout(show_status, end_game_delay);
		}
	}

	var begin_game = function () {
		$('#start-div').remove();
		game.paused = false;
		time_stamp.start_time = Date.now();
		$('body').append(retry_container)
	}



	$('#gjs-canvas').focus();
	$('#start').click(begin_game)

	// start_modal.style.display = 'none';
	game.paused = true;
	gamejs.ready(game.run(on_game_end));

	if (!(first) && exp_id != 0) {
		begin_game();
	}
});

// // gamejs.ready will call your main function
// // once all components and resources are ready.
// gamejs.ready(main);
