//**********************
var mongoose = require("mongoose");

var Connection = function (uri) {
	var that = this;

	// console.log();
	mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/vgdl", {
		useMongoClient: true,
	});
	var db = mongoose.connection;
	db.on("error", console.error.bind(console, "connection error: "));
	db.once("open", function (callback) {
		console.log("database connected");
	});

	// that.games = require('./game-schema.js');
	// that.experiments = require('./experiment-schema.js');

	Object.freeze(that);
	return that;
};

module.exports = Connection();
