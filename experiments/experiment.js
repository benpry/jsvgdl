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

// Returns a random integer given the parameters:
//  if no params: returns [0, 1]
//  if r: returns [0, r]
//  if r, m: returns [r, m]
//  if r, m, s: returns [r, m] such that it is divisible by s
var randint = function (r, m, s) {
    if (s) {
        var max = m / s;
        var rand = Math.floor(Math.random()*(max-r+1))+r
        return rand*s

    } else if (m) {
        return Math.floor(Math.random()*(m-r+1))+r
    } else if (r) {
        return Math.floor(Math.random()*(r+1))
    } else {
        return Math.round(Math.random())
    }
}

// [name, [[desc_num, level_num], ]]
var experiments = {
    exp0: [
        ['expt_exploration_exploitation', 
            [[0, 0], [1, 1], [2, 2], [3, 3]], false, 
            ''], // never gets shown
        ['expt_push_boulders', 
            [[0, 0], [0, 1], [0, 2], [0, 3]], false,
            ''],
        ['expt_preconditions', 
            [[0, 0], [0, 1], [0, 2], [0, 3]], false,
            ''],
        ['expt_relational',
            [[0, 0], [0, 1], [0, 2], [1, 3]], false,
            ''],
        ['expt_physics_sharpshooter',
            [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
            'On this game you can also use the spacebar!'],
        ['expt_helper',
            [[0, 0], [0, 1], [0, 2], [0, 3]], false,
            ''],
        ['expt_antagonist',
            [[0, 0], [0, 1], [0, 2], [0, 3]], false,
            '']
    ],
    exp1 : [
        ['expt_antagonist', [[0, 3]], true]
    ], 

    exp2 : [
        ['aliens', [[0, 0]], false],
        ['simpleGame4', [[0, 0], [0, 2], [0, 3]], true]
    ],

    exp3: [['aliens', [[0, 0]], false]],

    exp4: [['expt_preconditions', [[0, 0]], false],
           ['expt_relational', [[0, 0]], false]]
}
// An object that updates what game its on
// by calling next
var Experiment = function (exp_name, cookie) {
    var experiment = Object.create(Experiment.prototype);



    if (exp_name == undefined) {
        exp_name = 'exp0'
    }
    var cookie = cookie;
    var timeout = Date.now()+30*60*1000;
    var games_ordered = [];
    game_number = 0;
    var mipoints = {};

    experiments[exp_name].forEach(settings => {
        game_number ++;
        var game_name = settings[0];
        var game_levels = settings[1];
        mipoints[game_number] = settings[3];
        if (settings[2])
            game_levels = shuffle(game_levels);
        var color_scheme = 0//randint(100)
        game_levels.forEach(game_level => {
            games_ordered.push({name: game_name, 
                             desc: game_level[0], 
                             level: game_level[1], 
                             number: game_number, 
                             round: 1,
                             color_scheme: color_scheme})
            
        })
    })

    var started = true;
    var current_trial = 0;
    var current_game_number = 1;
    var max_trials = games_ordered.length

    experiment.get_saves = function () {
        return {
            exp_name: exp_name,
            cookie: cookie,
            started: started,
            current_trial: current_trial
        }
    }

    experiment.load_saves = function (saves) {
        started = saves.started;
        current_trial = saves.current_trial;
    }

    experiment.validate = function (validation_id) {
        return validation_id == cookie;
    }

    experiment.started = function () {
        if (started) {
            started = false
            return true;
        }
        return false
    }

    experiment.retry = function (callback) {
        var current_game = games_ordered[current_trial]
        if (current_game) 
            current_game.round ++;
        callback()
        // console.log('retrying experiment', current_game[3])
    }


    experiment.current_game = function () {
        if (current_trial == max_trials)
            return false;
        var current_game = games_ordered[current_trial]
        game_obj = {};
        game_obj.name = current_game.name;
        game_obj.desc = current_game.desc;
        game_obj.level = current_game.level;
        game_obj.number = current_game.number;
        return game_obj;
    }

    experiment.midpoint_text = function () {
        current_game_number = games_ordered[current_trial].number;
        return mipoints[current_game_number];
    }

    experiment.current_round = function () {
        var current_game = games_ordered[current_trial]
        round_obj = {};
        round_obj.number = current_game.number;
        return round_obj;
    }

    experiment.mid_point = function () {
        
        if (current_game_number == games_ordered[current_trial].number) 
            return false;
        current_game_number ++;
        return true;
    }


    experiment.next = function (callback) {
        current_trial += 1;
        callback()
    }

    experiment.is_done = function  () {
        if (current_trial >= games_ordered.length) {
            return true;
        }
        return false;
    }

    experiment.get_data = function () {
        return games_ordered[current_trial];
    }

    experiment.timeout = function () {
        if (Date.now() > timeout)
            return true;
        return false
    }

    Object.freeze(experiment);

    return experiment;
}


Experiment.experiments = {
    exp0: [
        ['expt_exploration_exploitation', 
            [[0, 0], [1, 1], [2, 2], [3, 3]], false, 
            ''], // never gets shown
        ['expt_push_boulders', 
            [[0, 0], [0, 1], [0, 2], [0, 3]], false,
            ''],
        ['expt_preconditions', 
            [[0, 0], [0, 1], [0, 2], [0, 3]], false,
            ''],
        ['expt_relational',
            [[0, 0], [0, 1], [0, 2], [1, 3]], false,
            ''],
        ['expt_physics_sharpshooter',
            [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
            'On this game you can also use the spacebar!'],
        ['expt_helper',
            [[0, 0], [0, 1], [0, 2], [0, 3]], false,
            ''],
        ['expt_antagonist',
            [[0, 0], [0, 1], [0, 2], [0, 3]], false,
            '']
    ],
    exp1 : [
        ['dodge', [[0, 0]], true], 
        ['chase', [[0, 0]], true]
    ], 

    exp2 : [
        ['aliens', [[0, 0]], false],
        ['simpleGame4', [[0, 0], [0, 2], [0, 3]], true]
    ],

    exp3: [['aliens', [[0, 0]], false]],

    exp4: [['expt_preconditions', [[0, 0]], false],
           ['expt_relational', [[0, 0]], false]]
}

module.exports = Experiment;