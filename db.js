var DB = function () {
	var that = Object.create(DB.prototype);
	var pg = require('pg');
	var errors = [];
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
	  ssl: true, // needs to be true to connect (secure connections are good)
	  max: 10, // max number of clients in the pool 
	  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed 
	};

	//this initializes a connection pool 
	//it will keep idle connections open for 30 seconds 
	//and set a limit of maximum 10 idle clients 

	var pool = new pg.Pool(config);

	// Converts a JS array to a Postgres Array string to be stored in the DB
	var array2db = function (array) {
		var db_string = '{'
		array.forEach(string => {
			db_string = db_string + '"'+string+'",';
		})
		db_string = db_string.slice(0, -1)
		return db_string + '}'
	}

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
	pool.query('select * from multigames', function (err, result) {
		if (err) {
			return console.error('error loading games db', err);
		}

		result.rows.forEach(row => {
			games[row.name] = {descs: row.descs.slice(), levels: row.levels.slice()}
		})
	})

	// Logs a specific error for when inserting into the DB that might need to be saved.
	var log_error = function (id, time, message) {
		errors.push({id: id, time: time, message: message})
	} 

	that.get_error_log = function () {
		return errors;
	}

	// Deletes all the experiments from the database.
	var reset_experiments = function (callback) {
		console.log('\ndeleting experiments...\n')
		pool.query('drop table experiments', function (err, result) {
			if (err) {
				console.error('no table to delete')
			}
			console.log('creating new experiments')
			pool.query(`create table experiments(
				id 			text 	not null,
				val_id  	text    not null,
				time_stamp	text	not null,
				data 		text	not null,
				states 		text	not null)	`, function (err, result) {
					if (err) {
						console.error(err)
					}
					callback('\n...experiments deleted\n')
				})
		})
	}

	// Uncomment this line and restart server to clear reset_experiments
	// reset_experiments(console.log)

	// subjectID, game, level of game, star_timestamp, end_timestamp, score, win, fullGameStateSeries
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

	/* Returns a parseable array of experiments and their
	 *	id, time_stamp, and game data {Number, round, decription, level}
	 *
	 **/
	that.get_experiment_info = function (callback) {
		console.log('loading experiments')
		pool.query('select id, time_stamp, data from experiments', function (err, result) {
			if (err) {
				callback([], {success: false})
				return console.error('could not get experiments')
			}
			result.rows = result.rows.map(exp_obj => {
				exp_obj.data = JSON.parse(exp_obj.data);
				// console.log(exp_obj.data)
				return exp_obj
			})
			callback(result.rows, {success: true})
		})
	}
	// that.get_experiment_info(console.log);

	/* Inserts a experiment's fully played game into the DB
	 *
	 *
	 **/ 
	that.post_experiment = function (id, val_id, time_stamp, game_states, data) {
		pool.query(`insert into experiments values 
					('${id}', '${val_id}', '${time_stamp}', '${data}', '${game_states}')`, function (err, result) {
						if (err) {
							log_error(id, Date.now(), 'could not update experiment: '+err);
							return console.error('could not update experiment: '+err)
						}
					});
	}

	/** A list of all the game names
	 */
	that.get_games_list = function () {
		return Object.keys(games).sort();
	}

	that.get_full_games = function () {
		return that.get_games_list().map(game => {
			return that.get_full_game(game);
		})
	}

	that.get_full_game = function (name) {
		// console.log(name);
		if (!(name in games)) {
			console.log(name, ' not in game')
			return {descs: [], levels: [], name: '', level: 0};
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
		games[name] = {descs: descs, levels: levels};
		pool.query(`update multigames set 
						descs='${array2db(descs)}',
						levels='${array2db(levels)}'
						where name = '${name}'`, function (err) {
							if (err) {
								console.error(err, 'could not update game');
							} else {
								console.log('successfully saved game');
							}
						})
	}

	that.add_game = function (name, descs, levels) {
		if (name in games) 
			return false;
		games[name] = {descs: descs, levels: levels};
		pool.query(`insert into multigames values
					('${name}', 
					'${array2db(descs)}',
					'${array2db(levels)}')`, 
			function (err) {
				if (err) {
					return console.error('could not add game to DB - only local copy exists', err)
				} else {
					console.log('successfully added game');
				}
			})
		return true;
	}		

	that.delete_game = function (name) {
		if (!(name in games)) {
			return console.error('game does not exist');
		}
		delete games[name]
		pool.query(`delete from multigames where name = '${name}'`, function (err, result) {
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

	that.print_size_usage = function (table_name) {
		pool.query(`SELECT *, pg_size_pretty(total_bytes) AS total
	    , pg_size_pretty(index_bytes) AS INDEX
	    , pg_size_pretty(toast_bytes) AS toast
	    , pg_size_pretty(table_bytes) AS TABLE
	  FROM (
	  SELECT *, total_bytes-index_bytes-COALESCE(toast_bytes,0) AS table_bytes FROM (
	      SELECT c.oid,nspname AS table_schema, relname AS TABLE_NAME
	              , c.reltuples AS row_estimate
	              , pg_total_relation_size(c.oid) AS total_bytes
	              , pg_indexes_size(c.oid) AS index_bytes
	              , pg_total_relation_size(reltoastrelid) AS toast_bytes
	          FROM pg_class c
	          LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
	          WHERE relkind = 'r'
	  ) a
	) a;`, function (err, result) {
			if (err) {
				return console.error('error with query', err);
			}

			console.log(result.rows.filter(row => {
				return row.table_name == table_name;
			}).map(row => {
				return `${row.table_name}: total size ${row.total}`
			})[0]);
		})
	}

	that.print_size_usage('experiments');

	that.print_connections = function () {
		pool.query('SELECT sum(numbackends) FROM pg_stat_database;', function (err, result) {
			if (err) console.error(err);
			console.log(result)
		})
	}

	// that.print_connections()

	Object.freeze(that);
	return that;
}

module.exports = DB;