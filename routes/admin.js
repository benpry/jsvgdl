var express = require('express');
var require_login = require('./middleware').require_login;
var router = express.Router();

var login_password = 'cocosciiscool';

// Admin home
router.get('/', require_login, function (req, res) {
	var data = {};
	data.games = DB.get_games_list();
	res.render('editor', data);
});

router.get('/login', function (req, res) {
	res.render('login');
})

router.post('/login', function (req, res) {
	if (req.body.password == login_password){
		req.session.logged_in = true;
		req.session.save();

		res.redirect('/admin');
	} else {
		res.redirect('/admin/login');
	}

});


module.exports = router;