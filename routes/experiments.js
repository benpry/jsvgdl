var express = require('express');
var router = express.Router();

// Experiments 
// Displays the database
router.get('/', function (req, res) {
	// var setup = Experiment.experiments[exp].slice();
	// setup = setup.map(game => {
	// 	new_game = game.slice();
	// 	new_game.push(DB.get_full_game(game[0]).levels.length)
	// 	return new_game
	// })
	// res.render('experiments', {exp: setup, games: DB.get_games_list()})
	DB.get_experiment_info(function (result, status) {
		if (status.success) {
			res.render('db', {experiments: result});
		}
		else {
			res.send('internal server error');
		}
	})
	// res.send("currently can't load experiments right now");
	
})

router.get('/logs', function (req, res) {
	res.send({errors: DB.get_error_log()})
})

router.get('/desc', function (req, res) {
	res.send(Experiment.experiments[exp])
})
// Currently useless. Rewrite for use in making experiment structures.

router.put('/', function (req, res) {
	var setup = Experiment.experiments[exp].slice();
	setup = setup.map(game => {
		new_game = game.slice();
		new_game.push(DB.get_full_game(game[0]).levels.length)
		return new_game
	})
	res.send({levels: DB.get_full_game(req.body.name).levels.length})
})

router.post('/', function (req, res) {
	var setup = Experiment.experiments[exp].slice();
	setup = setup.map(game => {
		new_game = game.slice();
		new_game.push(DB.get_full_game(game[0]).levels.length)
		return new_game
	})
	res.send({setup: setup, games: DB.get_full_games()})
})

module.exports = router;