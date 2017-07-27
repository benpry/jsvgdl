var mongoose = require('mongoose');

var ExperimentSchema = mongoose.Schema({
	name : {type: String, unique: true},
	games : [{
		game : {type: String, ref: "Game", required: true},
		levels : [{
			level: {type: Number, required: true},
			desc : {type: Number, required: true}
		}],
		randomize_levels: {type: Boolean, default : false},
		delay_retry: {type: Number, default: 30},
		delay_forfeit: {type: Number, default: 240}
	}]
})

ExperimentSchema.statics.create_experiment(exp_name, games, callback) = function {
	var games = games || [];
	this.create({name: exp_name, games: games}, callback);
}

ExperimentSchema.methods.add_game(game_name, levels, callback) = function {
	levels = levels || [];
	this.findOne({name: exp_name}, (err, experiment) => {
		experiment.games.push({
			game : game_name,
			levels : levels
		})
	})
}

module.exports = mongoose.model('Experiment', ExperimentSchema);