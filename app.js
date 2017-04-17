var express = require('express');
var bodyParser = require('body-parser')


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
var experiments = require('./experiments/experiments.js')();

app.get('/', function (req, res) {
	res.render('home');
});

app.get('/play/:game_name', function (req, res) {
	res.render('game', games.get_game(req.params.game_name));
});

app.get('/admin/login', function (req, res) {
	res.render('login');
});

app.get('/experiment/:exp_id', function (req, res) {	
	res.render('game', games.get_game('dodge'));
})


app.post('/experiment/new', function (req, res) {
	console.log('creating new experiment');
	res.send({exp_id: exp_id});
});

app.post('/admin/login', function (req, res) {
	console.log(req.body.password);
});


app.get('*', function(req, res){
  res.send('what???', 404);
});

app.listen(3000, function () {
	console.log("LISTENING ON PORT 3000");
});