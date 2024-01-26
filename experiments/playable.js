var pairs = {
  JRNL_avoidGeorge_v1: [[0, 0]],
  JRNL_beesAndBirds_v1: [[0, 0]],
  JRNL_boulderDash_v1: [[0, 0]],
  JRNL_plaqueAttack_v1: [[0, 0]],
  JRNL_portals_v1: [[0, 0]],
  JRNL_preconditions_v1: [[0, 0]],
  JRNL_pushBoulders_v1: [[0, 0]],
  JRNL_relational_v1: [[0, 0]],
  JRNL_watergame_v1: [[0, 0]],
};

var Playable = function () {
  var that = this;

  that.get_pair = function (game_name, pair) {
    if (pairs[game_name] && pair >= 0 && pair < pairs[game_name].length) {
      var [desc, level] = pairs[game_name][pair];
      return { level: level, desc: desc };
    }

    return undefined;
  };

  Object.freeze(that);

  return that;
};

module.exports = Playable;
