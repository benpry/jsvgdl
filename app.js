var express = require('express');

var app = express();

app.use(express.static('examples'));

var VGDLParser = require('./vgdl/core/vgdl-parser');
console.log(VGDLParser());

app.get('/', function (req, res) {
	res.send(VGDLParser);
});

app.listen(3000, function () {
	console.log("LISTENING ON PORT 3000");
});