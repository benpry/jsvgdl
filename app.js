var express = require('express');
var bodyParser = require('body-parser')
var shortid = require('shortid');


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


var games = require('./experiments/games.js')();
var experiments = {};
var new_exp = games.new_experiment('exp1');

app.get('/', function (req, res) {
	res.render('home');
});

app.get('/play/:game_name', function (req, res) {
	res.render('game', games.get_game(req.params.game_name));
});

app.get('/admin/login', function (req, res) {
	res.render('login');
});

// Sends the current game to be played for the given experiment id
app.get('/experiment/:exp_id', function (req, res) {	
	var data = {};
	data.game_obj = experiments[exp_id].current_game_obj();
	data.exp_id = req.params.exp_id;
	if (current_game) 
		res.render('game', data);
	else
		res.render('home');
})

app.put('/experiment/:exp_id', function (req, res) {
	// store req.body.data;
	var exp_id = req.params.exp_id;
	experiments[req.params.exp_id].next();
	res.send({exp_id: exp_id});
})

app.post('/experiment/', function (req, res) {
	var new_exp_id = shortid.generate();
	experiments[new_exp_id] = games.new_experiment('exp1');
	res.send({exp_id: new_exp_id});
});

app.post('/admin/login', function (req, res) {
	console.log(req.body.password);
});


app.get('*', function(req, res){
  res.send('what???', 404);
});


var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
	console.log("LISTENING ON PORT ", PORT);
});