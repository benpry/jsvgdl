var express = require('express');
var bodyParser = require('body-parser')
var shortid = require('shortid');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs')


var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/static'));

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());


/**
 * Middle ware for session data
 */
app.set('trust proxy', 1) // trust first proxy 
app.use(session({
  secret: 'cocosciiscool',
  resave: true,
  saveUninitialized: true
}))
var login_password = 'cocosciiscool';

function require_login (req, res, next) {
	if (req.session.logged_in) 
		next();
	else
		res.redirect('/admin/login');
}

// DB, sort of.
var games = require('./experiments/games.js')();
var experiments = {};
var new_exp = games.new_experiment('exp2');

app.get('/', function (req, res) {
	res.render('home');
});

app.get('/play/:game_name', require_login, function (req, res) {
	var data = {};
	data.exp_id = 0;
	data.game_obj = games.get_game(req.params.game_name);
	res.render('game', data);
});

app.get('/admin', require_login, function (req, res) {
	var data = {};
	data.games = games.get_games_list();
	res.render('dashboard', data);
});

app.get('/admin/login', function (req, res) {
	console.log(req.query);
	res.render('login');
});

// Sends the current game to be played for the given experiment id
app.get('/experiment/:exp_id', function (req, res) {	
	var data = {};
	data.exp_id = req.params.exp_id;
	data.game_obj = experiments[data.exp_id].current_game_obj();
	if (data.game_obj) 
		res.render('game', data);
	else
		res.render('home');
})

app.put('/experiment/:exp_id', function (req, res) {
	console.log(req.body);
	var exp_id = req.params.exp_id;
	if (exp_id == 0) {
		res.send();
	} else {
		experiments[req.params.exp_id].next();
		res.send({exp_id: exp_id});
	}	
})

app.post('/experiment/', function (req, res) {
	var new_exp_id = shortid.generate();
	experiments[new_exp_id] = games.new_experiment('exp1');
	res.send({exp_id: new_exp_id});
});

app.post('/admin/login', function (req, res) {
	if (req.body.password == login_password){
		console.log('user logged in');
		req.session.logged_in = true;
		req.session.save();

		res.redirect('/admin');
	} else {
		res.redirect('/admin/login');
	}

});


app.get('*', function(req, res){
  res.send('what???', 404);
});


var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
	console.log("LISTENING ON PORT ", PORT);
});