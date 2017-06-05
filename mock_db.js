var Mock = function () {
	var that = Object.create(Mock.prototype);
	var jsonfile = require('jsonfile')
	var file = './local_db.json'
	jsonfile.spaces = 2;

	var games = {};
	var experiments = [];
	var states = []
	var session = {};
	var logs = [];

	// async write
	var write_all = function () {
		var saves = {games: games, experiments: experiments, states: states, logs: logs}
		jsonfile.writeFileSync(file, saves);
	}

	var obj = jsonfile.readFileSync(file)
	experiments = obj.experiments;
	states = obj.states;
	session = obj.session;
	logs = obj.logs;
	games = obj.games;
	// populate games field

	// {id, val_id, time_stamp, data, game_states}


	var reset_experiments =  function () {
		experiments = [];
		write_all();
	}
	reset_experiments();
	that.save_state = function (state, callback) {
		states = []
		states.push(state);
		write_all();
		callback()
	}

	that.load_state = function (callback) {
		var loads = states[0]
		callback(loads)
	}

	that.get_experiments = function (callback) {
		callback(experiments)
	}

	that.get_experiment_info = function (callback) {
		callback(experiments.map(exp => {
			return {id: exp.id,
					time_stamp: exp.time_stamp,
					data: exp.data}
		}), {success: true})
	}

	that.post_experiment = function (id, val_id, time_stamp, game_states, data) {
		experiments.push({
			id: id,
			val_id: val_id,
			time_stamp: JSON.parse(time_stamp),
			data: JSON.parse(data),
			// game_states: JSON.parse(game_states) (data too large to store locally. O-o)
		})
		write_all();
	}

	that.get_games_list = function () {
		return Object.keys(games).sort();
	}

	that.get_full_games = function () {
		return that.get_games_list().map(game => {
			return that.get_full_game(game);
		})
	}

	that.get_full_game = function (name) {
		if (!(name in games)) {
			console.log(name, ' not in game');
			return {descs: [], levels: [], name: '', level: 0}
		}
		var game_obj = games[name];
		game_obj.name = name;
		game_obj.level = 0;
		game_obj.desc = 0;
		return game_obj;
	}

	that.get_game = function (name, level, desc) {
		if (!(level)) level = 0;
		if (!(desc)) desc = 0;

        var return_game = {};
        return_game.game = games[name].descs[desc];
        return_game.level = games[name].levels[level];
        return_game.name = name;
        return_game.round = 0;
        return return_game;
	}

	that.update_game = function (name, descs, levels) {
		games[name] = {descs: descs, levels: levels}
		write_all();
	}

	that.add_game = function (name, descs, levels) {
		if (name in game) {
			console.log('game already exists');
			return false
		}
		games[name] = {descs: descs, levels: levels}
		write_all();
	}

	that.delete_game = function (name) {
		if (!(name in game)) {
			console.log('game does not exist')
			return false
		}
		delete games[name]
		write_all();
	}

	Object.freeze(that)
	return that
}

module.exports = Mock;