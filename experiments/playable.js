var pairs = {'gvgai_sokoban': [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], 
		     'gvgai_butterflies': [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], 
		     'gvgai_aliens': [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
		     'gvgai_chase': [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
		     'gvgai_frogs': [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
		     'gvgai_portals': [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], 
		     'gvgai_zelda': [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
             'expt_push_boulders': [[0, 0], [0, 1], [0, 2], [0, 3]],
             'expt_relational': [[0, 0], [0, 1], [0, 2], [1, 3]], 
             'expt_preconditions': [[0, 0], [0, 1], [0, 2], [0, 3]], 
             'expt_antagonist': [[0, 0], [0, 1], [0, 2], [0, 3]],
             'expt_exploration_exploitation': [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5]],
             'expt_physics_sharpshooter': [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
             'expt_helper': [[0, 0], [0, 1], [0, 2], [0, 3]]}

var Playable = function () {
	var that = this;

	that.get_pair = function (game_name, pair) {
        if (pairs[game_name] && pair >= 0 && pair < pairs[game_name].length) {
            var [desc, level] = pairs[game_name][pair];
            return {level: level, desc: desc};
            
        }

        return undefined;
	}


	Object.freeze(that)

	return that;
}

module.exports = Playable;