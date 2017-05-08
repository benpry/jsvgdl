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
var game = vgdl_parser.playGame(vgdl_game.game, vgdl_game.level);
// var on_game_end = function () {
// }
// game.paused = false;
// gamejs.ready(game.run(on_game_end));
// console.log('game started');


$(document).ready(function () {

	var button = $(':button');
	var end_modal = $('#end-modal')[0];
	var start_modal = $('#start-modal')[0];

	var on_game_end = function () {
		end_modal.style.display = 'block';
		if (game.win) {
			$('#status').text('game won');
		}
		else {
			$('#status').text('game lost');
		}

	var on_game_end = function () {}
		
		
	}

	start_modal.style.display = 'block';

	$('#gjs-canvas').focus();
	$('#start').click(function () {
		start_modal.style.display = 'none';
		game.paused = false
	})
	$('#continue').click(continue_experiment(exp_id, game));

	// start_modal.style.display = 'none';
	game.paused = true;
	gamejs.ready(game.run(on_game_end));
	console.log('game started')
});

// // gamejs.ready will call your main function
// // once all components and resources are ready.
// gamejs.ready(main);


