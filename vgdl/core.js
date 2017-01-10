gamejs = require('gamejs');

var VGDLParser = function () {
	var that = Object.create(VGDLParser.prototype);

	var verbose = false;

	that.playGame = function (game_str, map_str) {
		var game = VGDLParser().parseGame(game_str);

		game.buildLevel(map_str);
		// game.uiud;
		game.startGame();

		return game;
	}

	that.parseGame = function (tree) {

		return;
	}

	that.parseIntersections = function (inodes) {

	}

	that.parseTerminations = function (tnodes) {

	}

	that.parseConditions = function (cnodes) {

	}

	that.parseSprites = function (snodes, parentClass = None, parentargs = {}, parenttypes = []) {

	}

	that.parseMappings = function (mnodes) {

	}

	that._parseArgs = function (s, sclass=None, args=None) {

	}
	Object.freeze(that);
	return that;
}

var BasicGame = function () {
	var that = Object.create(BasicGame.prototype);

	var MAX_SPRITES = 10000;

	var default_mapping = {'w': ['wall'], 'A', ['avatar']};

	var block_size = 10;
	var frame_rate = 20;
	var load_save_enabled;

	//INIT

	//grab all arguments

	that.sprite_constr = {};

	that.sprite_order = ['wall', 'avatar'];

	that.singletons = [];

	that.collision_eff = [];

	that.char_mapping = {};

	that.terminations = [Termination()];

	that.conditions = [];

	that.resources_limits;
	that.resources_colors;

	that.is_stochastic = false;
	that._lastsaved = null;
	that.win = null;
	that.effectList = [];
	that.reset();

	that.reset = function () {

	}

	that.buildLevel = function (lstr) {

	}

	that.emptyBlocks = function () {

	}

	that.randomizeAvatar = function () {

	}

	that._createSprite = function (keys, pos) {

	}

	that._createSprite_cheap = function (key, pos) {

	}

	that._initScreen = function (size) {
		that.screen = gamejs.display.setMode(size);
		
	}

	that.__iter__ = function () {

	}

	that.numSprites = function (key) {

	}

	that.getSprites = function (key) {

	}

	that.getAvatars = function () {

	}

	that.getObjects = function () {

	}

	that.getFullState = function (as_string = false) {

	}

	that.setFullState = function (fs, as_string = false) {

	}

	that.getFullStateColorized = function (as_string = false) {

	}

	that._clearAll = function (onscreen = true) {

	}

	that._drawAll = function () {

	}

	that._updateCollisionDict = function (changedsprite) {

	}

	that._eventHandling = function () {

	}

	that.startGame = function () {
		that._initScreen();
	}

	that.getPossibleActions = function () {

	}

	that.tick = function (action) {

	}
	
	Object.freeze(that);
	return that;
}

var Avatar = function () {
	var that = Object.create(Avatar.prototype);

	that.shrinkfactor = 0.15;
	that.actions = that.declare_possible_actions();

	Object.freeze(that);
	return that;
}


var VGDLSprite = function () {
	var that = Object.create(VGDLSprite.prototype);

	that.name = null;
	that.COLOR_DISC = [20, 80, 140, 200];
	that.dirtyrects = [];
	that.is_static = false;
	that.only_active = false;
	that.is_avatar = false;
	that.is_stochastic =false;
	that.color = null;
	that.cooldown = 0;
	that.speed = null;
	that.mass = 1;
	that.physicstype = null;
	that.shrinkfactor = 0;

	// INIT

	that.update = function (game) {

	}

	that._updatePos = function (orientation, speed=null) {

	}

	that._velocity = function () {

	}

	that.lastdirection = function () {

	}

	that._draw = function (game) {

	}

	that._drawResources = function (game, screen, rect) {

	}

	that._clear = function (screen, background, double=null) {

	}

	Object.freeze(that);
	return that;
}

var Resource = function () {
	var that = Object.create(Resource.prototype);

	that.value = 1;
	that.limit = 2;
	that.res_type = null;

	that.resourceType = function () {

	}

	Object.freeze(that);
	return that;
}


var Termination = function () {
	var that = Object.create(Termination.prototype);

	that.isDone = function (game) {

	}

	Object.freeze(that);
	return that;
}

var Conditional = function () {
	var that = Object.create(Conditional.prototype);

	Object.freeze(that);
	return that;
}
