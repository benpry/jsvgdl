var DB = function () {
	var that = Object.create(DB.prototype);
	var pg = require('pg');
	// console.log(process.env)

	// create a config to configure both pooling behavior 
	// and client options 
	// note: all config is optional and the environment variables 
	// will be read if the config is not present 
	var config = {
	  user: 'smcgqgjzpgenik',  
	  database: 'd9ahikn1rs4equ', 
	  password: 'mlKsdNWIVGgGEbO9-VwQ1S74c_', 
	  host: 'ec2-54-235-85-65.compute-1.amazonaws.com', 
	  port: 5432, 
	  ssl: true, // needs to be true for some reason
	  max: 10, // max number of clients in the pool 
	  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed 
	};

	//this initializes a connection pool 
	//it will keep idle connections open for 30 seconds 
	//and set a limit of maximum 10 idle clients 

	var pool = new pg.Pool(config);

	pool.on('error', function (err, client) {
	  // if an error is encountered by a client while it sits idle in the pool 
	  // the pool itself will emit an error event with both the error and 
	  // the client which emitted the original error 
	  // this is a rare occurrence but can happen if there is a network partition 
	  // between your application and the database, the database restarts, etc. 
	  // and so you might want to handle it and at least log it out 
	  console.error('idle client error', err.message, err.stack)
	})

	// games (name, game, levels)
	// experiments (id, experiment)

	var games = {}
	// populate games field
	pool.query('select * from games', function (err, result) {
		if (err) {
			return console.error('error loading games db', err);
		}

		result.rows.forEach(row => {
			games[row.name] = {game: row.game, levels: row.levels.slice()}
		})
		
	})


	that.get_experiments = function (callback) {
		pool.query('select * from experiments', function (err, result) {
			if (err) {
				return console.error('could not get experiments', err)
			}

			result.rows.map(row => {
				row.data = JSON.parse(row.data);
				return row
			})
			callback(result.rows);
		})
	}

	that.post_experiment = function (id, data) {
		pool.query(`insert into experiments values 
					('${id}', '${data}')`, function (err, result) {
						if (err) 
							return console.error('could not update experiment', err);
						console.log(result);
					});
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
		var game_obj = games[name];
		game_obj.name = name;
		game_obj.level = 0;
		return game_obj;
	}

	that.get_game = function (name, level) {
		if (!(level)) level = 0;

        var return_game = {};
        return_game.game = games[name].game;
        return_game.level = games[name].levels[level];
        return_game.name = name;
        return_game.round = 0;
        return return_game;
	}

	that.update_game = function (name, game, levels) {
		games[name] = {game: game, levels: levels};
		pool.query(`update games set game='${game}', levels='{"${levels.toString().replace(/,/g, '","')}"}'
						where name = '${name}'`, function (err) {
							if (err) {
								console.error('could not update game', err);
							}
							console.log('successfully saved');
						})
	}

	that.add_game = function (name, game, levels) {
		games[name] = {game: game, levels: levels};
		pool.query(`insert into games values
					('${name}', '${game}', 
					'{"${levels.toString().replace(/,/g, '","')}"}')`, 
			function (err) {
				if (err) {
					return console.error('could not add game to DB - only local copy exists', err)
				}

				console.log('successfully added game');
			})
	}	

	that.delete_game = function (name) {
		if (!(name in games)) {
			return console.error('game does not exist');
		}
		delete games[name]
		pool.query(`delete from games where name = '${name}'`, function (err, result) {
			if (err) {
				return console.error('could not delete', err)
			}

			console.log(result);
		})
	}

	that.select_all = function (table) {

		pool.query(`select * from ${table}`, function (err, result) {
			if (err) {
				return console.error('error with query', err);
			}

			console.log(result.rows.slice());
		})
	}

	Object.freeze(that);
	return that;
}

module.exports = DB;