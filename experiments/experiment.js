//http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array, static) {
    if (!static) static = [];
    // console.log(array);
    var currentIndex = array.length
    var temporaryValue = 0
    var randomIndex = 0;
    var array = array.slice();

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

    // Pick a remaining element...
    if (static.indexOf(currentIndex) == -1) randomIndex = Math.floor(Math.random() * currentIndex);
    else randomIndex = currentIndex;
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

// seconds
var retry_default = 30;
var forfeit_default = 4*60;
var num_per_participant = 10;
// [name, [[desc_num, level_num], ], random_flag, help_string, retry_delay, forfeit_delay]

// var experiments = [
//     ['expt_push_boulders',
//         [[0, 0], [0, 1], [0, 2], [0, 3]], false, 
//         '', retry_default, forfeit_default],
//     ['expt_relational',
//         [[0, 0], [0, 1], [0, 2], [1, 3]], false, 
//         '', retry_default, forfeit_default],
//     ['expt_preconditions',
//         [[0, 0], [0, 1], [0, 2], [0, 3]], false, 
//         '', retry_default, forfeit_default],
//     ['expt_antagonist',
//         [[0, 0], [0, 1], [0, 2], [0, 3]], false, 
//         '', retry_default, forfeit_default],
//     ['gvgai_boulderdash', 
//         [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
//         'On this game you can also use the spacebar.', 45, 6*60],
//     ['gvgai_butterflies', 
//         [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
//         '', retry_default, forfeit_default],
//     ['gvgai_portals',
//         [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
//         '', retry_default, forfeit_default]
// ]

var experiments = [
    //['gvgai_clusters',
    //    [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
    //    '', 20, forfeit_default],
    ['gvgai_angelsdemons',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_avoidgeorge',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_bait',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_boulderchase',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_camelRace',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_chopper',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_clusters',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_cookmepasta',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_infection',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_jaws',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_lemmings',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_modality',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_watergame',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_myAliens',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_overload',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_plants',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_plaqueattack',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_shipwreck',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_superman',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_tercio',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_thesnowman',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_watergame',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_waves',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_wildgunman',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_sokoban',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_sokoban',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 20, forfeit_default],
    ['gvgai_butterflies', 
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', retry_default, forfeit_default],
    ['gvgai_aliens', 
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false, 
        'On this game you can also use the spacebar.', 10*60, forfeit_default], // never gets shown
    ['gvgai_chase',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', retry_default, forfeit_default],
    ['gvgai_frogs',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', retry_default, forfeit_default],
    ['gvgai_missilecommand',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        'On this game you can also use the spacebar.', retry_default, forfeit_default],
    ['gvgai_portals',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', retry_default, forfeit_default],
    ['gvgai_zelda', 
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        'On this game you can also use the spacebar.', retry_default, forfeit_default],
    ['gvgai_boulderdash', 
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        'On this game you can also use the spacebar.', 45, 6*60],
    ['gvgai_survivezombies',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '', 10*60, forfeit_default]
]
// var experiments = [

//     ['gvgai_sokoban',
//         [[0, 0]], false,
//         '', retry_default, forfeit_default],
//     ['gvgai_butterflies', 
//         [[0, 0]], false,
//         '', retry_default, forfeit_default],
//     ['gvgai_aliens', 
//         [[0, 0]], false, 
//         'On this game you can also use the spacebar.', retry_default, forfeit_default], // never gets shown
//     ['gvgai_chase',
//         [[0, 0]], false,
//         '', retry_default, forfeit_default],
//     ['gvgai_frogs',
//         [[0, 0]], false,
//         '', retry_default, 3],
//     ['gvgai_missilecommand',
//         [[0, 0]], false,
//         'On this game you can also use the spacebar.', retry_default, forfeit_default],
//     ['gvgai_portals',
//         [[0, 0]], false,
//         '', retry_default, forfeit_default],
//     ['gvgai_zelda', 
//         [[0, 0]], false,
//         'On this game you can also use the spacebar.', retry_default, forfeit_default],
//     ['gvgai_boulderdash', 
//         [[0, 0]], false,
//         'On this game you can also use the spacebar.', retry_default, forfeit_default],
//     ['gvgai_survivezombies',
//         [[0, 0]], false,
//         '', retry_default, forfeit_default]
// ]
// 
// var experiments = experiments_normal.concat(experiments_hard);

var overtime_limit = 25*60*1000;

var get_exp = function (randomize) {
    if (randomize) {
        return shuffle(experiments)[:num_per_participants];
    } else {
        return experiments[:num_per_participants]
    }
}

// console.log(get_exp());

// experiments = experiments.map(experiment => {
//     if (experiment[0] == boulder_dash[0]) {
//         return shuffle(getRandomSubarray(experiments_normal, 4).push(experiment));
//     } else if (experiments[0] == zombies[0]) {
//         return shuffle(getRandomSubarray(experiments_normal, 4)).push(experiment);
//     }
// })

// console.log(experiments);

// An object that updates what game its on
// by calling next
var Experiment = function (exp_name, cookie, randomize_exp=false, static_exps=[], randomize_color=false) {


    if (exp_name == undefined) {
        exp_name = 'exp0'
    }
    var experiment = {};

    experiment.cookie = cookie;
    experiment.expiration = 60*60*1000
    experiment.timeout = Date.now()+experiment.expiration;
    experiment.games_ordered = [];
    experiment.midpoints = {};
    
    var game_number = 0;

    var exp = get_exp(randomize_exp);
    // console.log(exp);
    if (randomize_exp === true) {
        exp = shuffle(exp, static_exps);// [exp[0]].concat(shuffle(exp.slice(1, exp.length), static_exps));
    }
    console.log(exp)
    exp.forEach(settings => {
        game_number ++;
        var game_name = settings[0];
        var game_levels = settings[1];
        experiment.midpoints[game_number] = settings[3];
        var retry_delay = settings[4];
        var forfeit_delay = settings[5];
        if (settings[2])
            game_levels = shuffle(game_levels);
        var color_scheme = 0;
        if (randomize_color) color_scheme = randint(1307674368000);
        game_levels.forEach(game_level => {
            experiment.games_ordered.push({name: game_name, 
                             desc: game_level[0], 
                             level: game_level[1], 
                             number: game_number, 
                             round: 1,
                             color_scheme: color_scheme,
                             retry_delay: retry_delay,
                             forfeit_delay: forfeit_delay,
                             time: 0})
            
        })
    })



    
    experiment.started = true;
    experiment.current_trial = 0;
    experiment.current_game_number = 1;
    experiment.max_trials = experiment.games_ordered.length;
    experiment.start_time = Date.now();
    experiment.init_time = Date.now();
    experiment.overtime_check = true;
    experiment.ended = false;
    experiment.continued = false;

    return experiment


}

Experiment.update_timeout = function (experiment) {
        experiment.timeout = Date.now()+experiment.expiration;
    }

Experiment.validate = function (experiment, validation_id) {
    return validation_id == experiment.cookie;
}

Experiment.started = function (experiment) {
    if (experiment.started) {
        experiment.started = false
        return true;
    }
    return false
}

Experiment.retry = function (experiment) {
    Experiment.update_timeout(experiment);
    var current_game = experiment.games_ordered[experiment.current_trial]
    // console.log(current_game);
    if (current_game) {
        current_game.round ++;
    }
    // console.log('retrying experiment', current_game[3])
}


Experiment.current_game = function (experiment) {
    Experiment.update_timeout(experiment);
    if (experiment.current_trial == experiment.max_trials)
        return false;
    var current_game = experiment.games_ordered[experiment.current_trial]
    var game_obj = {};
    game_obj.name = current_game.name;
    game_obj.desc = current_game.desc;
    game_obj.level = current_game.level;
    game_obj.number = current_game.number;
    game_obj.color_scheme = current_game.color_scheme;
    game_obj.retry_delay = current_game.retry_delay;
    game_obj.forfeit_delay = current_game.forfeit_delay;
    game_obj.time = Date.now() - experiment.start_time;
    game_obj.round = current_game.round;
    // console.log(current_game)
    // console.log(game_obj)
    return game_obj;
}

Experiment.remaining_games = function (experiment) {
    return experiments.length - experiment.current_game_number;
}

Experiment.midpoint_text = function (experiment) {
    experiment.init_time = Date.now();
    experiment.current_game_number = experiment.games_ordered[experiment.current_trial].number;
    return experiment.midpoints[experiment.current_game_number];
}

Experiment.current_round = function (experiment) {
    return {
        number: experiment.games_ordered[experiment.current_trial].round
    };
}


Experiment.mid_point_pure = function (experiment) {
    if (experiment.current_game_number == experiment.games_ordered[experiment.current_trial].number) 
        return false;
    return true;      
}

Experiment.mid_point = function (experiment) {
    if (Experiment.mid_point_pure(experiment)) {
        experiment.current_game_number ++;
        return true
    }
    return false;
}


Experiment.next = function (experiment) {
    Experiment.update_timeout(experiment);
    experiment.current_trial += 1;
}

Experiment.is_done = function  (experiment) {
    if (experiment.current_trial >= experiment.games_ordered.length || experiment.ended) {
        return true;
    }
    return false;
}

Experiment.get_data = function (experiment) {
    var data = experiment.games_ordered[experiment.current_trial];
    data.time = Date.now() - experiment.init_time;
    return experiment.games_ordered[experiment.current_trial];
}

Experiment.forfeit = function (experiment) {
    while (experiment.games_ordered[experiment.current_trial].number == experiment.current_game_number) {
        experiment.current_trial = experiment.current_trial + 1;
    }
    // current_trial --;
}

Experiment.end = function (experiment) {
    experiment.ended = true;
}

Experiment.overtime = function (experiment) {
    if (Date.now() - experiment.start_time > overtime_limit) {
        if (experiment.overtime_check) {
            experiment.overtime_check = false;
            return true
        } else {
            experiment.continued = true;
        }
    }
    return false;
}

Experiment.overtime_continued = function (experiment) {
    if (Experiment.mid_point_pure(experiment) && experiment.continued) {
        experiment.continued = false;
        return !experiment.overtime_check;
    }
    return false;
}

Experiment.timeout = function (experiment) {
    if (Date.now() > experiment.timeout)
        return true;
    return false
}

Experiment.experiments = experiments;

module.exports = Experiment;
