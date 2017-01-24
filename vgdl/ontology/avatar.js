var Avatar = function () {
	var that = Object.create(Avatar.prototype);	
	that.actions = that.declare_possible_actions();

	Object.freeze(that);
	return that;
}

Avatar.prototype = {
	shrinkfactor : 0.15
}

module.exports = {Avatar : Avatar};