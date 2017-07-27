var express = require('express');
var router = express.Router();

// Login middleware
// validates session id with user login.
function require_login (req, res, next) {
	if (logged_in[req.session.id]) 
		next();
	else
		res.redirect('/admin/login');
}

app.get('/admin', require_login, function (req, res) {
	var data = {};
	data.games = DB.get_games_list();
	res.render('editor', data);
});

app.get('/admin/login', function (req, res) {

	res.render('login');

});

module.exports = router;