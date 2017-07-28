var express = require('express');
var router = express.Router();

// Editor pages
// Handles saving and loading games
router.get('/:game_name', function (req, res) {
	res.send(DB.get_full_game(req.params.game_name))
})

// Adds a new game to the DB
router.post('/:game_name', function (req, res) {
	success = DB.add_game(req.body.name, req.body.descs, req.body.levels) 
	res.send({success: success});
})

// Updates a game already in the DB
router.put('/:game_name', function (req, res) {
	DB.update_game(req.body.name, req.body.descs, req.body.levels)
	res.send({success: true})
	// console.log(req.body);
})

// Removes a game from the DB
router.delete('/:game_name', function (req, res) {
	console.log('deleting game')
	console.log(req.params.game_name);
	DB.delete_game(req.params.game_name);
	res.send({success: true})
})

module.exports = router;