// Post requests

/**
 * @fileoverview
 * Draw lines, polygons, circles, etc on the screen.
 * Render text in a certain font to the screen.
 */
var gamejs = require('gamejs');;
var vgdl_parser = VGDLParser(gamejs);


var retry_game = function () {
	// $('body').addClass('loading')
	location.reload();

}

var go_back = function () {
	window.location.href = '/games';
}


var continue_game = function () {
	game.paused = true;
	// window.location.href = `/games/${}`
}


var next_level = function () {
	window.location.href = `/games/${data.real}/${data.pair+1}`
}

var prev_level = function () {
	window.location.href = `/games/${data.real}/${data.pair-1}`
}

$(document).on('click', '#return', go_back);
$(document).on('click', '#retry', retry_game);
$(document).on('click', '#continue', continue_game);

$(document).on('click', '#next', next_level);
$(document).on('click', '#prev', prev_level);


$(document).on('click', '#pause', function () {
	game.paused = !game.paused;
})



$(document).ready(function () {
	var game = vgdl_parser.playGame(vgdl_game.game, vgdl_game.level, 0);

	var return_button = $('<button id="return">Return to Games List</button>');
	var next_button = $('<button id="next">Next Level</button>');

	var retry_container = $('<div id="retry-div" class="Flex-Container"></div>');
	var retry_text = $('<p id="retry-text">If you get stuck, you can press "Retry" to reset this level.</p>')
	var retry_button = $('<button id="retry">Retry</button>')
	retry_container.append(retry_text)
	retry_container.append(retry_button)

	var end_game_delay = 1000
	var ended = false;

	var on_game_end = function () {
		game.paused = true;
		ended = true
		$('#retry-div').remove()
		var show_status = function () {
			var status_text = '';
			if (game.win) {
				var container = $('<div></div>');
				if (!data.next) {
					var button = return_button;
				} else {
					var button = next_button;
				}
			}
			else {
				var container = retry_container;
				var button = retry_button;
			}
			
			container.append('<br>')
			container.append(button)

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

		$('#start').remove();
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
