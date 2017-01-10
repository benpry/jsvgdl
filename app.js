var express = require('express');
var gamejs = require('gamejs');

var app = express();

app.use(express.static('public'))

app.get('/', function (req, res) {
	res.send('index.html');
});

app.listen(3000, function () {
	console.log("LISTENING ON PORT 3000");
});