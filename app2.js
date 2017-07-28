var express = require('express');
var bodyParser = require('body-parser');
var shortid = require('shortid');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');

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

/**
 * Middle ware for session data
 */
app.set('trust proxy', 1) // trust first proxy 
app.use(session({
	secret: 'cocosciiscool',
	resave: true,
	saveUninitialized: true
}))

logged_in = {};

// Login middleware
// validates session id with user login.
function require_login (req, res, next) {
	if (req.session.logged_in) 
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

var edit = require('./routes/edit');
edit.use(require_login);

var images = require('./routes/images');
images.use(require_login);

var play = require('./routes/play');
play.use(require_login);

var admin = require('./routes/admin');
admin.use(require_login);

var experiment = require('./routes/experiment');
experiment.use(validate_exp);

var experiments = require('./routes/experiments');
experiments.use(require_login);

app.use('/experiment', experiment);
app.use('/experiments', experiments);
app.use('/edit', edit);
app.use('/play', play);
app.use('/admin', admin);
app.use('/images', images);

// Home Page
app.get('/', function (req, res) {
	res.render('home');
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