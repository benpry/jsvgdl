var express = require('express');
var router = express.Router();

// Play a game from the DB
router.get('/:game_name/level/:level/desc/:desc', function (req, res) {
	var level = parseInt(req.params.level);
	var desc = parseInt(req.params.desc)
	var data = {};
	data.exp_id = 0;
	data.game_obj = DB.get_game(req.params.game_name, level, desc);
	data.game_obj.time = 60*10*1000
	data.game_obj.data = {name: req.params.game_name, 
						  number: 0,
						  round: 0,
						  desc: desc,
						  level: level,
						  retry_delay: 60*10*1000,
						  color_scheme: 0,
						  forfeit_delay: 60*10*1000,
						  time: 60*10*1000};
	res.render('game', data);
});

module.exports = router;