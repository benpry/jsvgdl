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
	extended: true
}));


/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());


// PostgreSQL DB 
var DB = require('./db.js')()
var Experiment = require('./experiments/experiment.js');
var experiments = {};

// console.log(Experiment.experiments)

// DB.get_experiments(function (result) {
// 	console.log(result);
// })

var exp = 'exp2';

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

function validate_exp (req, res, next) {
	if (req.session.exp_id in experiments && req.session.exp_id == req.params.exp_id) {
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
	var setup = Experiment.experiments[exp].slice();
	setup = setup.map(game => {
		new_game = game.slice();
		new_game.push(DB.get_full_game(game[0]).levels.length)
		return new_game
	})
	res.render('experiments', {exp: setup, games: DB.get_games_list()})
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
	success = DB.add_game(req.body.name, req.body.game, req.body.levels) 
	res.send({success: success});
})

app.put('/edit/:game_name', require_login, function (req, res) {
	DB.update_game(req.body.name, req.body.game, req.body.levels)
	res.send({success: true})
	// console.log(req.body);
})

app.delete('/edit/:game_name', require_login, function (req, res) {
	console.log('deleting game')
	console.log(req.params.game_name);
	DB.delete_game(req.params.game_name);
	res.send({success: true})
})

app.get('/play/:game_name/level/:level', require_login, function (req, res) {
	var level = parseInt(req.params.level);
	var data = {};
	data.exp_id = 0;
	data.game_obj = DB.get_game(req.params.game_name, level);
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
		console.log('user logged in');
		req.session.logged_in = true;
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
	if (current_exp.refresh()) {
		delete experiments[data.exp_id]
		res.send("you weren't supposed to do that")
		return;
	}

	if (!(current_exp)) {
		next();
	} else if (current_exp.is_done()) {
		res.render('thank_you');
		delete experiments[data.exp_id];
	} else {
		current_game = current_exp.current_game();
		data.game_obj = DB.get_game(current_game.name, current_game.level);
		var round = current_exp.current_round()
		data.game_obj.name = round.number;
		data.game_obj.round = round.round;
		res.render('game', data);
	}

})

app.put('/experiment/:exp_id', validate_exp, function (req, res) {
	var exp_id = req.params.exp_id;
	var current_exp = experiments[req.params.exp_id];
	if (current_exp) {
		current_exp.next(req.body)
		if (current_exp.is_done()) {
			DB.post_experiment(exp_id, current_exp.get_data())
		}
		res.send({exp_id: exp_id});
	} else {
		res.send();
	}	
})

app.post('/experiment/', function (req, res) {
	var new_exp_id = shortid.generate();
	experiments[new_exp_id] = Experiment(exp);
	req.session.exp_id = new_exp_id;
	res.send({exp_id: new_exp_id});
});

app.get('*', function(req, res){
  res.status(404).render('404');
});


var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
	console.log("listening on port", PORT);
});