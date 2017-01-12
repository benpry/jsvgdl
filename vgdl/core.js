console.log('hello from core');
var Core = function () {
	console.log('hello from within core');
	var that = Object.create(Core.prototype);

	var gamejs = require('gamejs');
	var tools = require('/tools.js');
	var ontology = require('/ontology.js')



	var disableContinuousKeyPress = true;
	var actionToKeyPress = {};
	actionToKeyPress[(-1, 0)] = gamejs.event.K_LEFT;
	actionToKeyPress[(1, 0)] = gamejs.event.K_RIGHT;
	actionToKeyPress[(0, 1)] = gamejs.event.K_DOWN;
	actionToKeyPress[(0, -1)] = gamejs.event.K_UP;

	var keyPresses = {273: 'up', 274: 'down', 276: 'left', 275: 'right', 32: 'spacebar'};
	var emptyKeyState = new Array(323).fill(0);
	var colorDict = {'[0, 200, 0]': 'GREEN',
'[0, 0, 200]': 'BLUE',
'[200, 0, 0]': 'RED',
'[90, 90, 90]': 'GRAY',
'[250, 250, 250]': 'WHITE',
'[0, 0, 0]': 'BLACK',
'[250, 160, 0]': 'ORANGE',
'[250, 250, 0]': 'YELLOW',
'[250, 200, 200]': 'PINK',
'[250, 212, 0]': 'GOLD',
'[250, 50, 50]': 'LIGHTRED',
'[250, 200, 100]': 'LIGHTORANGE',
'[50, 100, 250]': 'LIGHTBLUE',
'[50, 250, 50]': 'LIGHTGREEN',
'[150, 150, 150]': 'LIGHTGRAY',
'[30, 30, 30]': 'DARKGRAY',
'[20, 20, 100]': 'DARKBLUE',
'[140, 20, 140]': 'PURPLE'};

	that.VGDLParser = function () {
		var that = Object.create(VGDLParser.prototype);
		var verbose = false;

		/**
		 * @param  {[type]}
		 * @return {[type]}
		 */
		that.parseGame = function (tree) {

			if (!tree instanceof tools.Node())
				tree = tools.indentTreeParser(tree).children[0];

			[sclass, args] = that._parseArgs(tree.content);
			that.game = sclass(args)
			tree.children.forEach(function (child) {
				parse[child.content](child.children);
			});

			return that.game;
		}

		var _eval(estr) {
			return eval(estr);
		}

		var parse = {
			// parseInteractions
			'InteractionSet' : function (inodes) {
				inodes.forEach(function (inode) {
					if (inode.content.indexOf('>') != -1) {
						var [pair, edef] = inode.content.split('>').map(function (s) {
							return s.trim();
						});
						var [eclass, args] = that._parseArgs(edef);
						that.game.collision_eff.push(
							pair.split(' ').map(function (s) {
								return s.trim();
							}).concat([eclass, args])
						);
						if (verbose) {
							console.log('Collision', pair, 'has effect:', edef);
						}
					}
				});

			},
			//parseSprites
			'SpriteSet' : function (snodes, parentClass = null, parentargs = {}, parenttypes = []) {
				snodes.forEach(function (snode) {
					console.assert(snode.content.indexOf('>') != -1);
					var [key, sdef] = snode.content.split('>').map(function (s) {
						return s.trim();
					});
					var [sclass, args] = that._parseArgs(sdef, parentclass, parentargs.copy());
					var stypes = parenttypes.concat(keys);

					if (args.indexOf('singleton') != -1) {
						if (args['singleton'] == true) 
							that.game.singletons.push(key);
						args = tools.clone(args);
						delete args['singleton'];
					}

					if (snode.children.length == 0) {
						if (verbose) 
							console.log('Defining:', key, sclass, args, stypes);
						that.game.sprite_constr[key] = [sclass, args, stypes];
						if (that.game.sprite_order.indexOf(key) != -1) {
							var index = that.game.sprite_order.indexOf(key);
							that.game.sprite_order.splice(index, 1);
						}
						that.game.sprite_order.push(key);
					} else {
						parse['SpriteSet'](snode.children, sclass, args, stypes);
					}
				})
			},
			//parseTerminations
			'TerminationSet' : function (tnodes) {
				tnodes.forEach(function (tnode) {
					var [sclass, args] = self._parsArgs(tnode.content);
					if (verbose)
						console.log('Adding:', sclass, args);
					that.game.terminations.append(sclass(args));
				});
			},
			//parseConditions
			'ConditionalSet' : function (cnodes) {
				cnodes.forEach(function (cnode) {
					if (cnode.content.indexOf('>') != -1) {
						var [conditional, interaction] = cnode.content.split('>').map(function (s) {
							return s.trim();
						});

						var [cclass, cargs] = that._parseArgs(conditional);
						var [eclass, eargs] = that._parseArgs(interaction);

						that.game.conditions.push([cclass(cargs), [eclass, eargs]]);
					}
				});

			}
		}


		var parseMappings = function (mnodes) {
			mnodes.forEach(function (mnode) {
				var [c, val] = mnode.split('>').map(function (x) {
					return x.trim();
				});

				console.assert(c.length == 1, "Only single character mappings allowed");

				var keys = val.split(' ').map(function (x) {
					return x.trim();
				});

				if (verbose) 
					console.log("Mapping", c, keys);

				that.game.char_mapping[c] = keys;
			});

		}

		var _parseArgs = function (string, sclass=null, args=null) {
			if (args === null)
				args = {};

			var sparts = string.split(' ').map(function (s) {
				return s.trim();
			});

			var sclass;
			if (sparts.length == 0)
				return [sclass, args];	

			if (sparts[0].indexOf('=') == -1) {
				sclass = _eval(sparts[0]);
				sparts = sparts.slice(1);
			}

			sparts.forEach(function (spart) {
				var [k, val] = spart.split('=');

				try {
					args[k] = _eval(val);
				} catch  (e) {
					args[k] = val;
				}
			});

			return [sclass, args];
		}

		Object.freeze(that);
		return that;
	}

	/**
	 * params {**kwargs} any number of arguments which will be used in the game
	 */
	that.BasicGame = function () {
		var that = Object.create(BasicGame.prototype);

		var Immovable = ontology.Immovable;
		var DARKGRAY = ontology.DARKGRAY;
		var MovingAvatar = ontology.MovingAvatar;
		var GOLD = ontology.GOLD;

		var MAX_SPRITES = 10000;

		var default_mapping = {'w': ['wall'], 'A', ['avatar']};

		var block_size = 10;
		var frame_rate = 20;
		var load_save_enabled;

		//INIT

		//grab all arguments

		that.sprite_constr = {'wall': [Immovable, {'color': DARKGRAY}, ['wall']],
													'avatar': [MovingAvatar, {}, ['avatar']]};

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
			that.score = 0;
			that.time = 0;
			that.ended = false;
			that.num_sprites = 0;
			that.kill_list = [];
			that.all_killed = [];

		}

		that.buildLevel = function (lstr) {
			var stochastic_effects = ontology.stochastic_effects;

			var lines = lstr.split('\n').filter(function (l) {return l.length > 0});
			var lengths = lines.map(function (line) {return line.length});

			console.assert(Math.min(lengths) == Math.min(lengths), "Inconsistent line lengths");

			that.width = lengths[0];
			that.height = lines.length;

			console.assert(that.width > 1 and that.height > 1, 'Level too small');

			that.block_size = Math.max(2, Math.floor(800/Math.max(that.width, that.height)));
			that.screensize = [that.width*that.block_size, that.height*that.block_size];

			that.sprite_constr.forEach(function (item) {
				var [res_time, [sclass, args, _]] = item;
				if (sclass.prototype instanceof core.Resource) {
					if (args['res_type']) 
						res_type = args['res_type'];
					if (args['color'])
						that.resources_colors[res_type] = args['color'];
					if (args['limit'])
						that.resources_limits[res_type] = args['limit'];
				}
			});

			lines.forEach(function (line, row) {
				line.forEach(function (c, col) {
					if (that.char_mapping.indexOf(c) != -1) {
						var pos = [col*that.block_size, row*that.block_size];
						that._createSprite(that.char_mapping[c], pos);
					} else if (that.default_mapping.indexOf(c) != -1) {
						var pos = [col*that.block_size, row*that.block_size];
						that._createSprite(that.default_mapping[c], pos);
					}
				})
			});

			that.kill_list = [];

			that.collision_eff.forEach(function (item) {
				var [_, _, effect, _] = item;
				if (stochastic_effects.indexOf(effect) != -1)
					that.is_stochastic = true;
			})	
		}

		that.emptyBlocks = function () {
			var alls = //iterate over all the sprites
		}

		that.randomizeAvatar = function () {
			if (that.getAvatars().length == 0)
				that._createSprite(['avatar'], )
		}

		that._createSprite = function (keys, pos) {
			var res = [];
			keys.forEach(function (key) {
				if (that.num_sprites > MAX_SPRITES) {
					console.log('Sprite limit reached.');
					return;
				}
				var [sclass, args, stypes] = that.sprite_constr[key];

				var anyother = false;
				stypes.reverse().forEach(function (pk) {
					if (that.singletons.indexOf(pk) == -1){
						if (that.numSprites(pk) > 0) {
							anyother = true;
							break;
						}
					}
				});

				var s = sclass(pos, [that.block_size, that.block_size], key, args);
				s.stypes = stypes;
				that.sprite_groups[key].append(s);
				that.num_sprites += 1;
				if (s.is_stochastic)
					that.is_stochastic = true;
				res.push(s);
			});
			return res;

		}

		that._createSprite_cheap = function (key, pos) {

		}

		that._initScreen = function (size) {
			var LIGHTGRAY = ontology.LIGHTGRAY;
			that.screen = gamejs.display.setMode(size);
			that.background = gamejs.graphics.Surface(size);
			that.background.fill(LIGHTGRAY);
			that.scsreen.surface.blit(that.background, [0, 0]);
			
		}

		/**
		 * Seems mostly useless
		 * 
		 * @return {[type]}
		 */
		that.__iter__ = function () {

		}

		that.numSprites = function (key) {
			var deleted = that.kill_list.filter(function (s) {return s.stypes[key]}).length;
			if (that.sprite_groups[key]) 
				return that.sprite_groups[key].length-deleted;
			else
				return 0; // Should be __iter__ - deleted

		}

		that.getSprites = function (key) {
			if (that.sprite_groups[key])
				return that.sprite_groups[key].filter(function(s) {return that.kill_list.indexOf(s) == -1});
			else
				return s.stypes.filter(function(s) {return that.kill_list.indexOf(s) == -1});
		}

		that.getAvatars = function () {
			var res = [];
			that.sprite_groups.values().forEach(function (ss) {
				if (ss && ss[0] instanceof Avatar)
					res.concat(ss.filter(function(s) {return that.kill_list.indexOf(s) == -1}));
			});
			return res;
		}

    var ignoredattributes = ['stypes',
	                           'name',
	                           'lastmove',
	                           'color',
	                           'lastrect',
	                           'resources',
	                           'physicstype',
	                           'physics',
	                           'rect',
	                           'alternate_keys',
	                           'res_type',
	                           'stype',
	                           'ammo',
	                           'draw_arrow',
	                           'shrink_factor',
	                           'prob',
	                           'is_stochastic',
	                           'cooldown',
	                           'total',
	                           'is_static',
	                           'noiseLevel',
	                           'angle_diff',
	                           'only_active',
	                           'airsteering',
	                           'strength',
	                           ];

		that.getObjects = function () {
			var obj_list = {};
			var fs = that.getFullState();
			var obs = fs['objects'];

			obs.forEach(function (obj_type) {
				that.getSprites(obj_type).forEach(function (obj) {
					var features = {'color': colorDict[obj.color.toString()],
					                'row': [obj.rect.top]};
					var type_vector = {'color': colorDict[obj.color.toString()],
					                   'row': [obj.rect.top]};
					var sprite = ob;
					var obj_list[ob.ID] = {'sprite': sprite, 
																 'position': [ob.rect.left, ob.rect.top],
																 'features': features,
																 'type': type_vector};
				});
			});

			return obj_list;
		}

		that.getFullState = function (as_string = false) {
			ias = that.ignoredattributes;
			obs = {};
			that.sprite_groups.forEach(function (key) {
				var ss = {};
				var obs = {};
				that.getSprites(key).forEach(function (s) {
					var pos = [s.rect.left, s.rect.top];
					var attrs = {};
					while (ss[pos])
						pos = [pos, null];
					if (as_string)
						ss[pos.toString()] = attrs;
					else
						ss[pos] = attrs;
					Object.keys(s).forEach(function (a) {
						var val = s[a];
						if (ias.indexOf(a) == -1)
							attrs[a] = val;
					});
					if (s.resources)
						attrs['resources'] = s.resources; // Should be object
				}
			});
		}

		that.setFullState = function (fs, as_string = false) {
			that.reset();
			that.score = fs['score'];
			that.ended = fs['ended'];
			Object.keys(fs['objects']).forEach(function (key) {
				that.sprite_groups[key] = [];
				Object.keys(ss).forEach(function (pos) {
					var attrs = ss[pos];
					if (as_string) {
						var p = eval(pos);
					}
				})
			})
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

	// Static method of VGDLParser
	that.VGDLParser.prototype.playGame = function (game_str, map_str) {
		var game = that.VGDLParser().parseGame(game_str);

		game.buildLevel(map_str);
		// game.uiud;
		game.startGame();

		return game;
	}

	that.Avatar = function () {
		var that = Object.create(Avatar.prototype);

		that.shrinkfactor = 0.15;
		that.actions = that.declare_possible_actions();

		Object.freeze(that);
		return that;
	}


	that.VGDLSprite = function () {
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

	that.Resource = function () {
		var that = Object.create(Resource.prototype);

		that.value = 1;
		that.limit = 2;
		that.res_type = null;

		that.resourceType = function () {

		}

		Object.freeze(that);
		return that;
	}


	that.Termination = function () {
		var that = Object.create(Termination.prototype);

		that.isDone = function (game) {

		}

		Object.freeze(that);
		return that;
	}

	that.Conditional = function () {
		var that = Object.create(Conditional.prototype);

		Object.freeze(that);
		return that;
	}

Object.freeze(that);
return that;
}

module.exports = Core;
