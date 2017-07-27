var express = require('express');
var bodyParser = require('body-parser');
var shortid = require('shortid');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var multer = require('multer');
var fs = require('fs');

var mongo_connection = require('./mongodb/connection.js');
var game_schema = require('./mongodb/game-schema.js');
var subject_schema = require('./mongodb/subject-schema.js');
var exp_schema = require('./mongodb/experiment-schema.js');

var storage = multer.diskStorage({
	destination: 'static/images/',
	filename: function (req, file, callback) {
		callback(null, file.originalname)
	}
})
// Used for uploading images to the website. No way to save images perminantly, though.
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
var reset = true;
if (process.env.PORT || reset) {
	var DB = require('./db.js')()
} else {
	var DB = require('./mock_db.js')()
	console.log('***\nUsing mock data base for testing. Changes will only be saved locally.\n')
}

setTimeout(function () {
	// console.log(DB.get_full_games());
	// game_schema.update_game('hello_world', ['one'], ['two', 'three'], err => {
	// 	if (err) console.log(err);	

	// })
	// game_schema.find({name: 'hello_world'}, (err, games) => {
	// 	console.log(games)
	// })
	// game_schema.remove_level('hello_world', 0, (err) => {
	// 	if (err) console.log(err);
	// })


}, 2000);
var Experiment = require('./experiments/experiment.js');
var experiments = {};
var exp = 0;

// Use once ready!
// DB.load_state(loads => {
// 	Object.keys(loads).forEach(exp_id => {
// 		var load = loads[exp_id]
// 		experiments[exp_id] = Experiment(exp, load.cookie, load.randomize_color)
// 		experiments[exp_id].load_saves(load);
// 	})
// })

/** Every 30 minutes,
 *	this deletes an experiment 
 *	that has been inactive for more than 1 hour
 */


// Use once ready!
// var save_state_periodically = setInterval(function () {
// 	// console.log(Object.keys(experiments));
// 	var saved_states = {}
// 	Object.keys(experiments).map(exp_id => {
// 		saved_states[exp_id] = experiments[exp_id].get_saves();
// 	})
// 	DB.save_state(saved_states, function () {
// 		// console.log()
// 	})
// }, 30*1000)

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


// Login middleware
// validates session id with user login.
function require_login (req, res, next) {
	if (logged_in[req.session.id]) 
		next();
	else
		res.redirect('/admin/login');
}


// Experiment middleware
// validates an experiment with its validation ID
// Use during experiments. Mostly just for extra precausion. 
function validate_exp (req, res, next) {	
	var exp_id = req.session.exp_id
	// console.log(req.session.cookie)
	var val_id = req.session.val_id
	// next()

	if (exp_id == '0') {
		res.end();
		return
	}
	if (experiments[exp_id] && experiments[exp_id].validate(val_id)) {
		next();
	} else {
		res.status(404).render('404');
	}
}


// Home Page
app.get('/', function (req, res) {
	res.render('home');
});

// Images Pages
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
// Displays the database
app.get('/experiments', require_login, function (req, res) {
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

app.get('/experiments/logs', require_login, function (req, res) {
	res.send({errors: DB.get_error_log()})
})

app.get('/experiments/desc', require_login, function (req, res) {
	res.send(Experiment.experiments[exp])
})
// Currently useless. Rewrite for use in making experiment structures.

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

// Editor pages
// Handles saving and loading games
app.get('/edit/:game_name', require_login, function (req, res) {
	res.send(DB.get_full_game(req.params.game_name))
})

// Adds a new game to the DB
app.post('/edit/:game_name', require_login, function (req, res) {
	success = DB.add_game(req.body.name, req.body.descs, req.body.levels) 
	res.send({success: success});
})

// Updates a game already in the DB
app.put('/edit/:game_name', require_login, function (req, res) {
	DB.update_game(req.body.name, req.body.descs, req.body.levels)
	res.send({success: true})
	// console.log(req.body);
})

// Removes a game from the DB
app.delete('/edit/:game_name', require_login, function (req, res) {
	console.log('deleting game')
	console.log(req.params.game_name);
	DB.delete_game(req.params.game_name);
	res.send({success: true})
})

// Play a game from the DB
app.get('/play/:game_name/level/:level/desc/:desc', require_login, function (req, res) {
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

// Administrative
app.get('/admin', require_login, function (req, res) {
	var data = {};
	data.games = DB.get_games_list();
	res.render('editor', data);
});

// Administrative login page.
app.get('/admin/login', function (req, res) {

	res.render('login');

});

// Send a login request with user credentials. 
// (should probably hash the password)
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
// app.post('/experiment/:exp_id/next', validate_exp, function (req, res) {

// })

// // Updates the experiment to retry the game in the experiment
// app.post('/experiment/:exp_id/retry', validate_exp, function (req, res) {

		
// })

// Actually uploads the data the the BD
// app.post('/experiment/:exp_id', validate_exp, function (req, res) {
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

app.post('/experiment/:exp_id/next', validate_exp, function (req, res) {
	var current_exp = experiments[req.params.exp_id];
	current_exp.next()
	res.send({success: true})
})

app.post('/experiment/:exp_id/retry', validate_exp, function (req, res) {
	var current_exp = experiments[req.params.exp_id];
	current_exp.retry();
	res.send({success: true})
})

app.post('/experiment/:exp_id/forfeit', validate_exp, function (req, res) {
	var current_exp = experiments[req.params.exp_id];
	current_exp.forfeit();
	res.send({success: true});
})

app.post('/experiment/:exp_id/end', validate_exp, function (req, res) {
	var current_exp = experiments[req.params.exp_id];
	current_exp.end();
	res.send({success: true});
})

app.put('/experiment/:exp_id', validate_exp, function (req, res) {
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

// Creates a new experiment to be run with a unique experiment ID
app.post('/experiment/', function (req, res) {
	var new_exp_id = shortid.generate();
	var validation_id = shortid.generate();
	experiments[new_exp_id] = new Experiment(exp, validation_id);
	req.session.exp_id = new_exp_id;
	req.session.val_id = validation_id;
	res.send({exp_id: new_exp_id, val_id: validation_id});
	exp ++;
});


// If a user types in an incorrect URL, they get redirected here.
app.get('*', function(req, res){
  res.status(404).render('404');
});


var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
	console.log("listening on port", PORT);
});