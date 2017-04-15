var express = require('express');

var app = express();

app.get('/admin', function (req, res) {
	res.send('hello');
});

app.listen(3000, function () {
	console.log("LISTENING ON PORT 3000");
});