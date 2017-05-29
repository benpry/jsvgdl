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

var experiments = {
    exp1 : [
        ['dodge', [0], true], 
        ['chase', [0], true]
    ], 

    exp2 : [
        ['aliens', [0], false],
        ['simpleGame4', [0, 2, 3], true]
    ],

    exp3: [['aliens', [0], false]]
}
// An object that updates what game its on
// by calling next
var Experiment = function (exp_name, cookie) {
    var experiment = Object.create(Experiment.prototype);



    if (exp_name == undefined) {
        exp_name = 'exp1'
    }
    var cookie = cookie;
    var games_ordered = [];
    var game_number = 0;

    experiments[exp_name].forEach(settings => {
        game_number ++;
        var next_games = [];
        var game_name = settings[0];
        var game_levels = settings[1];
        if (settings[3])
            game_levels = shuffle(game_levels);

        game_levels.forEach(game_level => {
            next_games.push([game_name, game_level, game_number, 1])
            
        })
        games_ordered = games_ordered.concat(next_games);
    })

    var started = true;
    var current_trial = 0;
    var current_game_number = 1;
    var first = true;
    var max_trials = games_ordered.length

    experiment.validate = function (validation_id) {
        if (validation_id == cookie) {
            return true;
        }
        return false;
    }

    experiment.started = function () {
        if (started) {
            started = false
            return true;
        }
        return false
    }

    experiment.retry = function () {
        first = false;
        var current_game = games_ordered[current_trial]
        if (current_game) 
            current_game[3] ++;
        // console.log('retrying experiment', current_game[3])
    }


    experiment.current_game = function () {
        if (current_trial == max_trials)
            return false;
        var current_game = games_ordered[current_trial]
        game_obj = {};
        game_obj.name = current_game[0];
        game_obj.level = current_game[1];
        game_obj.number = current_game[2];
        game_obj.first = first;
        return game_obj;
    }

    experiment.current_round = function () {
        var current_game = games_ordered[current_trial]
        round_obj = {};
        round_obj.number = current_game[2];
        return round_obj;
    }

    experiment.mid_point = function () {
        
        if (current_game_number == games_ordered[current_trial][2]) 
            return false;
        current_game_number ++;
        first = true
        return true;
    }


    experiment.next = function (data) {
        first = false;
        current_trial += 1;
    }

    experiment.is_done = function  () {
        if (current_trial >= games_ordered.length) {
            return true;
        }
        return false;
    }

    experiment.get_data = function () {
        return JSON.stringify(games_ordered[current_trial])
    }

    Object.freeze(experiment);

    return experiment;
}

Experiment.experiments = {
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

module.exports = Experiment;