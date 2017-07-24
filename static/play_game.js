/**
 * @fileoverview
 * Draw lines, polygons, circles, etc on the screen.
 * Render text in a certain font to the screen.
 */



console.log(data);
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

var retry_game = function () {
	window.location.reload();
}

var continue_game = function () {
	next_experiment(exp_id, game, parser, data, function () {
		window.location.href = `/experiment/${exp_id}`
	});
}

var page_refresh = function () {
	game.paused = true;
	if (game.win === null) {
		retry_experiment(exp_id, game, parser, data, function () {
			console.log('game refreshed');
		})
	}
}

$(document).on('click', '#forfeit', function () {
	next_experiment(exp_id, game, parser, data, function () {
		location.reload();
	})
})

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
	var forfeit_text = $('<p id="forfeit-text">If you want to forfeit the entire level and try a new one, press "Forfeit".</p>');
	var forfeit_button = $('<button id="forfeit">Forfeit</button>');

	var retry_container = $('<div id="retry-div" class="Flex-Container"></div>');
	var retry_text = $('<p id="retry-text">If you get stuck, you can press "Retry" to reset this level.</p>')
	var retry_button = $('<button id="retry">Retry</button>')
	retry_container.append(retry_text)
	retry_container.append(retry_button)

	forfeit_div.append(forfeit_text);
	forfeit_div.append(forfeit_button);

	var end_game_delay = 1000;
	var retry_delay = 30000;
	var forfeit_delay = 60000*2;
	var ended = false;

	var on_game_end = function () {
		parser.post_partial(exp_id, game, data);
		clearInterval(interval);
		game.paused = true;
		ended = true
		$('#retry-div').remove()
		var show_status = function () {
			var status_text = '';
			if (game.win) {
				var container = $('<div id="end-div" class="Flex-Container"></div>');
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
			
			container.append(button);
			$('body').append(container)
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
	}

	var begin_game = function () {
		parser = new json_parser();
		interval = window.setInterval(function(){
		  parser.post_partial(exp_id, game, data)
		  console.log('parsing')
		}, 500);

		$('#start-div').remove();
		game.paused = false;
		window.setTimeout(function () {
			if (!ended)
				$('body').append(retry_container)	
		}, retry_delay);
		window.setTimeout(function () {
			if (!ended)
				$('#retry-div').append(forfeit_div);
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
