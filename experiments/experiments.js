var shortid = require('shortid');


// An experiment has a set of games, which level, 
// and how many round. The experiment can play randomly 
var Experiment = function () {
	var that = Object.create(Experiment.prototype);
	var random = random;

	// [game_name, level, trials]

	that.add_game = function () {

	}


	Object.freeze(that);
	return that;
}


module.exports = Experiment;

