//http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length
  var temporaryValue = 0
  var randomIndex = 0;
  var array = array.slice();

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// An object that updates what game its on
// by calling next
var Experiment = function (exp_name) {
    var experiment = Object.create(Experiment.prototype);

    var experiments = {
        exp1 : [
            ['dodge', [0], 3, true], 
            ['simpleGame1', [0], 1, true]
        ], 

        exp2 : [
            ['aliens', [0], 2, false],
            ['simpleGame4', [0, 2, 3], 2, true]
        ],

        exp3: [['aliens', [0], 1, false]]
    }

    if (exp_name == undefined) {
        exp_name = 'exp1'
    }
    var store = {}
    var games_ordered = [];
    var game_number = 0;
    experiments[exp_name].forEach(settings => {
        game_number ++;
        var next_games = [];
        var game_name = settings[0];
        var game_levels = settings[1];
        var level_rounds = settings[2];
        if (settings[3])
            game_levels = shuffle(game_levels);

        game_levels.forEach(game_level => {
            for (var i = 0; i < level_rounds ; i++) {
                next_games.push([game_name, game_level, game_number, i+1])
            }
        })
        games_ordered = games_ordered.concat(next_games);
    })


    var current_trial = 0;
    var max_trials = games_ordered.length

    experiment.current_game = function () {
        if (current_trial == max_trials)
            return false;
        var current_game = games_ordered[current_trial]
        game_obj = {};
        game_obj.name = current_game[0];
        game_obj.level = current_game[1];
        return game_obj;
    }

    experiment.current_round = function () {
        var current_game = games_ordered[current_trial]
        round_obj = {};
        round_obj.number = current_game[2];
        round_obj.round = current_game[3];
        return round_obj;
    }


    experiment.next = function (data) {
        var current_game = games_ordered[current_trial];
        store[current_trial] = {game: current_game, data: data}
        current_trial += 1;
    }

    experiment.is_done = function  () {
        if (current_trial >= games_ordered.length) {
            return true;
        }
        return false;
    }

    experiment.get_data = function () {
        return JSON.stringify(store);
    }

    Object.freeze(experiment);

    return experiment;
}

module.exports = Experiment;