var express = require('express');
var router = express.Router();

// Play a game from the DB
router.get('/games', function (req, res) {
	res.render('games', data);
});

module.exports = router;