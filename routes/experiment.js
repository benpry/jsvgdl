var express = require('express');
var router = express.Router();

// Sends the current game to be played for the given experiment id
router.get('/:exp_id', function (req, res, next) {	
	var data = {};
	data.exp_id = req.params.exp_id;
	var current_exp = experiments[data.exp_id];
	
	if (!(current_exp)) {
		next();
	} else if (current_exp.started()) {
		res.render('start')
	} else if (current_exp.is_done()) {
		res.render('thank_you', {val_id: req.session.val_id});
		delete experiments[data.exp_id];
	} else if (current_exp.overtime_continued()) {
		res.render('overtime_cont', {games: current_exp.remaining_games(), exp_id: data.exp_id});
	} else if (current_exp.overtime()) {
		res.render('overtime', {exp_id: data.exp_id});
	} else if (current_exp.mid_point()) {
		res.render('midpoint', {text: current_exp.midpoint_text()})
	} else {
		current_game = current_exp.current_game();
		data.game_obj = DB.get_game(current_game.name, current_game.level, current_game.desc);
		var round = current_exp.current_round()
		data.game_obj.name = round.number;
		data.game_obj.level_num = current_game.level + 1
		data.game_obj.round = round.round;
		data.game_obj.data = current_exp.get_data();
		data.game_obj.time = current_game.time;
		res.render('game', data);
	}

})

// // Updates the experiment to play the next game in the experiment
// router.post('/:exp_id/next', function (req, res) {

// })

// // Updates the experiment to retry the game in the experiment
// router.post('/:exp_id/retry', function (req, res) {

		
// })

// Actually uploads the data the the BD
// router.post('/:exp_id', function (req, res) {
// 	if (req.body.action == 'next') {
// 		// console.log('next experiment')
// 		var current_exp = experiments[req.params.exp_id]
// 		current_exp.next(function () {})
// 	} else if (req.body.action == 'retry') {
// 		// console.log('retrying experiment')
// 		var current_exp = experiments[req.params.exp_id];
// 		current_exp.retry(function () {});
// 	}
// 	console.log(req.body);
// 	var exp_id = req.params.exp_id;
// 	var val_id = req.session.val_id;
// 	var game_states = req.body.gameStates;
// 	var time_stamp = req.body.timeStamp;
// 	var current_exp = experiments[req.params.exp_id];
// 	var data = req.body.data;
// 	data.steps = req.body.steps;
// 	data.score = req.body.score;
// 	data.win = req.body.win;
// 	data = JSON.stringify(data);
// 	DB.post_experiment(exp_id, val_id, time_stamp, game_states, data)
// 	res.send({success: true})
// })

router.post('/:exp_id/next', function (req, res) {
	var current_exp = experiments[req.params.exp_id];
	current_exp.next()
	res.send({success: true})
})

router.post('/:exp_id/retry', function (req, res) {
	var current_exp = experiments[req.params.exp_id];
	current_exp.retry();
	res.send({success: true})
})

router.post('/:exp_id/forfeit', function (req, res) {
	var current_exp = experiments[req.params.exp_id];
	current_exp.forfeit();
	res.send({success: true});
})

router.post('/:exp_id/end', function (req, res) {
	var current_exp = experiments[req.params.exp_id];
	current_exp.end();
	res.send({success: true});
})

router.put('/:exp_id', function (req, res) {
	if (req.params.exp_id != 0) {
		var exp_id = req.params.exp_id;
		var val_id = req.session.val_id;
		var time_stamp = req.body.timeStamp;
		var game_states = req.body.gameStates;
		var data = req.body.data;
		data.steps = req.body.steps;
		data.score = req.body.score;
		data.win = req.body.win;
		data.index = req.body.index;
		data.frames = req.body.frames;
		data.time = req.body.time;
		// console.log('processing request')
		DB.post_experiment(exp_id, val_id, time_stamp, game_states, data)
	}
	res.send({success: true})
})

module.exports = router;