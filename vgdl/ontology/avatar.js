var VGDLSprite = require('./vgdl-sprite.js').VGDLSprite;
var tools_module = require('../tools.js');
var constants = require('./constants.js');

var Avatar = function () {
	this.actions = that.declare_possible_actions();
	this.shrinkfactor = 0.15;
}

var MovingAvatar = function () {
	Avatar.call(this, arguments);
	this.color = constants.WHITE;
	this.speed = 1;
	this.is_avatar = true;
	this.alternate_keys = false;

}
MovingAvatar.prototype.extend(Object.create(VGDLSprite.prototype), Object.create(Avatar.prototype));

MovingAvatar.prototype.declare_possible_actions = function () {
	var event = require('../../src/gamejs').event;
	var actions = {};
    actions["UP"] = event.K_UP;
    actions["DOWN"] = event.K_DOWN;
    actions["LEFT"] = event.K_LEFT;
    actions["RIGHT"] = event.K_RIGHT;
    return actions;
}

MovingAvatar.prototype._readMultiActions = function (game) {
	var event = require('../../src/gamejs').event;
	// ORDER MATTERS
	var [UP, LEFT, DOWN, RIGHT] = constants.BASEDIRS;
	res = [];

	if (this.alternate_keys) {
		if (game.keystate[event.K_d]) res.push(RIGHT);
		else if (game.keystate[event.K_a]) res.push(LEFT);
		if (game.keystate[event.K_w]) res.push(UP);
		else if (game.keystate[event.K_s]) res.push(DOWN);
	} else {
		if (game.keystate[event.K_RIGHT]) res.push(RIGHT);
		else if (game.keystate[event.K_LEFT]) res.push(LEFT);
		if (game.keystate[event.K_UP]) res.push(UP);
		else if (game.keystate[event.K_DOWN]) res.push(DOWN);
	}

	return res;
}

MovingAvatar.prototype._readAction = function (game) {
	var actions = this._readMultiActions(game);
	if (actions)
		return actions[0];
	else
		return null;
}

MovingAvatar.prototype.update = function (game) {
	VGDLSprite.prototype.update.call(this, game);
	var action = this._readAction(game);
	if (action)
		this.physics.activeMovement(action);
}


var HorizontalAvatar = function () {
	MovingAvatar.call(this, arguments);
}
HorizontalAvatar.prototype = Object.create(MovingAvatar.prototype);

HorizontalAvatar.prototype.declare_possible_actions = function () {
	var event = require('../../src/gamejs').event;
	var actions = {};
	actions['LEFT'] = event.K_LEFT;
	actions['RIGHT'] = event.K_RIGHT;
	return actions;
}

HorizontalAvatar.prototype.update = function (game) {
	VGDLSprite.prototype.update.call(this, game);
	var action = this._readAction(game);
	if (action in [constants.RIGHT, constants.LEFT])
		this.physics.activeMovement(this, action);
}

var VerticalAvatar = function () {
	MovingAvatar.call(this, arguments);
}
VerticalAvatar.prototype = Object.create(MovingAvatar.prototype);

VerticalAvatar.prototype.declare_possible_actions = function () {
	var event = require('../../src/gamejs').event;
    actions = {}
    actions["UP"] = event.K_UP
    actions["DOWN"] = event.K_DOWN
    return actions
}

VerticalAvatar.prototype.update = function () {
	VGDLSprite.prototype.update.call(this, game);
	var action = this._readAction(game);
	if (action in [constants.UP, constants.DOWN])
		this.physics.activeMovement(this, action)
}
module.exports = {Avatar : Avatar,
				  MovingAvatar : MovingAvatar};