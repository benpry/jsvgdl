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
// [name, [[desc_num, level_num], ]]
var experiments = [

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

var overtime_limit = 2*60*1000;

var get_exp = function () {
    return shuffle(experiments);
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
var Experiment = function (exp_name, cookie, randomize_exp=true, static_exps=[], randomize_color=true) {
    var experiment = Object.create(Experiment.prototype);



    if (exp_name == undefined) {
        exp_name = 'exp0'
    }
    var cookie = cookie;
    var expiration = 60*60*1000
    var timeout = Date.now()+expiration;
    var games_ordered = [];
    game_number = 0;
    var mipoints = {};

    var exp = get_exp();
    console.log(exp);
    if (randomize_exp) {
        exp = shuffle(exp, static_exps);// [exp[0]].concat(shuffle(exp.slice(1, exp.length), static_exps));
    }
    exp.forEach(settings => {
        game_number ++;
        var game_name = settings[0];
        var game_levels = settings[1];
        mipoints[game_number] = settings[3];
        var retry_delay = settings[4];
        var forfeit_delay = settings[5];
        if (settings[2])
            game_levels = shuffle(game_levels);
        var color_scheme = 0;
        if (randomize_color) color_scheme = randint(1307674368000);
        game_levels.forEach(game_level => {
            games_ordered.push({name: game_name, 
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

    var started = true;
    var current_trial = 0;
    var current_game_number = 1;
    var max_trials = games_ordered.length;
    var start_time = Date.now();
    var init_time = Date.now();
    var overtime_check = true;
    var ended = false;
    var continued = false;
    var update_timeout = function () {
        timeout = Date.now()+expiration;
    }

    experiment.get_saves = function () {
        return {
            exp_name: exp_name,
            cookie: cookie,
            started: started,
            current_trial: current_trial,
            randomize_color: randomize_color,
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

    experiment.retry = function () {
        update_timeout();
        var current_game = games_ordered[current_trial]
        // console.log(current_game);
        if (current_game) {
            current_game.round ++;
        }
        // console.log('retrying experiment', current_game[3])
    }


    experiment.current_game = function () {
        update_timeout();
        if (current_trial == max_trials)
            return false;
        var current_game = games_ordered[current_trial]
        game_obj = {};
        game_obj.name = current_game.name;
        game_obj.desc = current_game.desc;
        game_obj.level = current_game.level;
        game_obj.number = current_game.number;
        game_obj.randomize_color = current_game.randomize_color;
        game_obj.retry_delay = current_game.retry_delay;
        game_obj.forfeit_delay = current_game.forfeit_delay;
        game_obj.time = Date.now() - start_time;
        return game_obj;
    }

    experiment.remaining_games = function () {
        return experiments.length - current_game_number;
    }

    experiment.midpoint_text = function () {
        init_time = Date.now();
        current_game_number = games_ordered[current_trial].number;
        return mipoints[current_game_number];
    }

    experiment.current_round = function () {
        var current_game = games_ordered[current_trial]
        round_obj = {};
        round_obj.number = current_game.number;
        return round_obj;
    }


    experiment.mid_point_pure = function () {
        if (current_game_number == games_ordered[current_trial].number) 
            return false;
        return true;      
    }

    experiment.mid_point = function () {
        if (experiment.mid_point_pure()) {
            current_game_number ++;
            return true
        }
        return false;
    }


    experiment.next = function () {
        update_timeout();
        current_trial += 1;
    }

    experiment.is_done = function  () {
        if (current_trial >= games_ordered.length || ended) {
            return true;
        }
        return false;
    }

    experiment.get_data = function () {
        var data = games_ordered[current_trial];
        data.time = Date.now() - init_time;
        return games_ordered[current_trial];
    }

    experiment.forfeit = function () {
        while (!experiment.mid_point_pure()) {
            current_trial ++;
        }
        // current_trial --;
    }

    experiment.end = function () {
        ended = true;
    }

    experiment.overtime = function () {
        if (Date.now() - start_time > overtime_limit) {
            if (overtime_check) {
                overtime_check = false;
                return true
            } else {
                continued = true;
            }
        }
        return false;
    }

    experiment.overtime_continued = function () {
        if (experiment.mid_point_pure() && continued) {
            continued = false;
            return !overtime_check;
        }
        return false;
    }

    experiment.timeout = function () {
        if (Date.now() > timeout)
            return true;
        return false
    }

    Object.freeze(experiment);

    return experiment;
}


Experiment.experiments = experiments;

module.exports = Experiment;