var express = require('express');

var app = express();

app.use(express.static('examples'))

// app.get('/', function (req, res) {
// 	res.send('index.html');
// });

app.listen(3000, function () {
	console.log("LISTENING ON PORT 3000");
});