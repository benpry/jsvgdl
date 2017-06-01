var express = require('express');
var bodyParser = require('body-parser');
var shortid = require('shortid');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var multer = require('multer');
var fs = require('fs');

var storage = multer.diskStorage({
	destination: 'static/images/',
	filename: function (req, file, callback) {
		callback(null, file.originalname)
	}
})
var upload = multer({
	dest : 'images/',
	storage: storage
	});

var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/static'));

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
	limit: '5000mb',
	extended: true
}));


/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
// app.use(bodyParser.json({limit: '5000mb'}));

// PostgreSQL DB 
var DB = require('./db.js')()
var Experiment = require('./experiments/experiment.js');
var experiments = {};

/** Every 30 minutes,
 *	this deletes an experiment 
 *	that has been alive for more than 30 minutes
 */
// var intervalID = setInterval(function () {
// 	Object.keys(experiments).forEach(exp_id => {
// 		if (experiments[exp_id].timeout()){
// 			console.log(exp_id, 'experiment timed out')
// 			delete experiments[exp_id];
// 		}
// 	})
// }, 30*60*1000)

// var intervalID = setInterval(function () {
// 	console.log(experiments);
// }, 5000)

var exp = 'exp0';

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
var logged_in = {};

function require_login (req, res, next) {
	if (logged_in[req.session.id]) 
		next();
	else
		res.redirect('/admin/login');
}

function validate_exp (req, res, next) {
	var exp_id = req.session.exp_id
	var val_id = req.session.val_id
	if (experiments[exp_id] && experiments[exp_id].validate(val_id)) {
		next();
	} else {
		res.status(404).render('404');
	}
}

app.get('/', function (req, res) {
	res.render('home');
});

// Images
app.get('/images', require_login, function(req, res) {
	fs.readdir('./static/images', function (err, images) {
		if (err) {
			res.render('images');
			return console.error(err);
		}
		res.render('images', {images: images});

	})
})

app.post('/images/upload', require_login, upload.any(), function(req, res) {
	var photoUpload = upload.single('userPhoto')
	photoUpload(req, res, function (err) {
		if (err) {
			res.send(err);
		}
		res.redirect('/images');
	})
})

// Experiments
app.get('/experiments', require_login, function (req, res) {
	// var setup = Experiment.experiments[exp].slice();
	// setup = setup.map(game => {
	// 	new_game = game.slice();
	// 	new_game.push(DB.get_full_game(game[0]).levels.length)
	// 	return new_game
	// })
	// res.render('experiments', {exp: setup, games: DB.get_games_list()})
	DB.get_experiment_info(function (result, status) {
		if (status.success)
			res.render('db', {experiments: result});
		else
			res.send('internal server error');
	})
	
})

app.put('/experiments', require_login, function (req, res) {
	var setup = Experiment.experiments[exp].slice();
	setup = setup.map(game => {
		new_game = game.slice();
		new_game.push(DB.get_full_game(game[0]).levels.length)
		return new_game
	})
	res.send({levels: DB.get_full_game(req.body.name).levels.length})
})


app.post('/experiments', require_login, function (req, res) {
	var setup = Experiment.experiments[exp].slice();
	setup = setup.map(game => {
		new_game = game.slice();
		new_game.push(DB.get_full_game(game[0]).levels.length)
		return new_game
	})
	res.send({setup: setup, games: DB.get_full_games()})
})

// Editor
app.get('/edit/:game_name', require_login, function (req, res) {
	res.send(DB.get_full_game(req.params.game_name))
})

app.post('/edit/:game_name', require_login, function (req, res) {
	success = DB.add_game(req.body.name, req.body.descs, req.body.levels) 
	res.send({success: success});
})

app.put('/edit/:game_name', require_login, function (req, res) {
	DB.update_game(req.body.name, req.body.descs, req.body.levels)
	res.send({success: true})
	// console.log(req.body);
})

app.delete('/edit/:game_name', require_login, function (req, res) {
	console.log('deleting game')
	console.log(req.params.game_name);
	DB.delete_game(req.params.game_name);
	res.send({success: true})
})

app.get('/play/:game_name/level/:level/desc/:desc', require_login, function (req, res) {
	var level = parseInt(req.params.level);
	var desc = parseInt(req.params.desc)
	var data = {};
	data.exp_id = 0;
	data.game_obj = DB.get_game(req.params.game_name, level, desc);
	data.first = false; //Take this out later.
	res.render('game', data);
});

// Administrative
app.get('/admin', require_login, function (req, res) {
	var data = {};
	data.games = DB.get_games_list();
	res.render('editor', data);
});

app.get('/admin/login', function (req, res) {

	res.render('login');

});

app.post('/admin/login', function (req, res) {
	if (req.body.password == login_password){
		req.session.id = shortid.generate();
		logged_in[req.session.id] = true;
		req.session.save();

		res.redirect('/admin');
	} else {
		res.redirect('/admin/login');
	}

});



// Sends the current game to be played for the given experiment id
app.get('/experiment/:exp_id', validate_exp, function (req, res, next) {	
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
	} else if (current_exp.mid_point()) {
		res.render('midpoint', {text: current_exp.midpoint_text()})
	} else {
		current_game = current_exp.current_game();
		data.game_obj = DB.get_game(current_game.name, current_game.level, current_game.desc);
		var round = current_exp.current_round()
		data.game_obj.name = round.number;
		data.game_obj.level_num = current_game.level + 1
		data.game_obj.round = round.round;
		data.first = current_game.first
		res.render('game', data);
	}

})

app.post('/experiment/:exp_id/next', validate_exp, function (req, res) {
	var current_exp = experiments[req.params.exp_id]
	current_exp.next(function () {res.send({success: true})})
})

app.post('/experiment/:exp_id/retry', validate_exp, function (req, res) {
	var current_exp = experiments[req.params.exp_id];
	current_exp.retry(function () {res.send({success:true})});
	
})

app.post('/experiment/:exp_id', validate_exp, function (req, res) {
	var exp_id = req.params.exp_id;
	var val_id = req.session.val_id;
	var game_states = req.body.gameStates;
	var time_stamp = req.body.timeStamp;
	var current_exp = experiments[req.params.exp_id];
	var data = current_exp.get_data();
	data.steps = req.body.steps;
	data.score = req.body.score;
	data.win = req.body.win;
	data = JSON.stringify(data);
	DB.post_experiment(exp_id, val_id, time_stamp, game_states, data)
	res.send({success: true})
})

app.post('/experiment/', function (req, res) {
	var new_exp_id = shortid.generate();
	var validation_id = shortid.generate();
	experiments[new_exp_id] = new Experiment(exp, validation_id);
	req.session.exp_id = new_exp_id;
	req.session.val_id = validation_id;
	res.send({exp_id: new_exp_id});
});

app.get('*', function(req, res){
  res.status(404).render('404');
});


var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
	console.log("listening on port", PORT);
});