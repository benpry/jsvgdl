/**
 * params {**kwargs} any number of arguments which will be used in the game
 */
var BasicGame = function () {
	var that = Object.create(null);

	// var Immovable = core.Immovable;
	// var DARKGRAY = ontology.DARKGRAY;
	// var MovingAvatar = ontology.MovingAvatar;
	// var GOLD = ontology.GOLD;

	var MAX_SPRITES = 10000;

	var default_mapping = {'w': ['wall'], 'A': ['avatar']};

	var block_size = 10;
	var frame_rate = 20;
	var load_save_enabled;

	that.reset = function () {
		that.score = 0;
		that.time = 0;
		that.ended = false;
		that.num_sprites = 0;
		that.kill_list = [];
		that.all_killed = [];

	}

			//INIT

	//grab all arguments

	that.sprite_constr = {'wall': [Immovable, {'color': DARKGRAY}, ['wall']],
												'avatar': [MovingAvatar, {}, ['avatar']]};

	that.sprite_order = ['wall', 'avatar'];

	that.singletons = [];

	that.collision_eff = [];

	that.char_mapping = {};

	that.terminations = [core.Termination()];

	that.conditions = [];

	that.resources_limits;
	that.resources_colors;

	that.is_stochastic = false;
	that._lastsaved = null;
	that.win = null;
	that.effectList = [];
	that.reset();

	that.buildLevel = function (lstr) {
		var stochastic_effects = ontology.stochastic_effects;

		var lines = lstr.split('\n').filter(function (l) {return l.length > 0});
		var lengths = lines.map(function (line) {return line.length});

		console.assert(Math.min(lengths) == Math.min(lengths), "Inconsistent line lengths");

		that.width = lengths[0];
		that.height = lines.length;

		console.assert(that.width > 1 && that.height > 1, 'Level too small');

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
		});
	}

	that.emptyBlocks = function () {
		var alls;//iterate over all the sprites
	}

	that.randomizeAvatar = function () {
		if (that.getAvatars().length == 0)
			that._createSprite(['avatar'], [0, 0]);
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

			for (var pk in stypes.reverse()) {
				if (that.singletons.indexOf(pk) == -1){
					if (that.numSprites(pk) > 0) {
						anyother = true;
						break;
					}
				}					
			}

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
				obj_list[ob.ID] = {'sprite': sprite, 
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
			});
		});
	}

	that.setFullState = function (fs, as_string = false) {
		that.reset();
		that.score = fs['score'];
		that.ended = fs['ended'];
		for (var key in fs['objects']) {
			that.sprite_groups[key] = [];
			for (var pos in ss) {
				var attrs = ss[pos];
				if (as_string) 
					var p = eval(pos);
				else
					var p = pos;

				var s = that._createSprite_cheap(key, p);
				for (var attrs in a) {
					var val = attrs[a];
					if (a == 'resources') {
						for (r in val) {
							s.resources[r] = val[r];
						}
					} else 
						s[a] = val;
				}
			}
		}
	}

	that.getFullStateColorized = function (as_string = false) {
		var fs = that.getFullState(as_string = as_string);
		var fs_colorized = deepcopy(fs);
		fs_colorized['objects'] = {};
		for (sprite_name in fs['objects']) {
			var [sclass, args, stypes] = that.sprite_constr[sprite_name];
			try {
				fs_colorized['objects'][colorDict[args['color'].toString()]] = fs['objects'][sprite_name];
			} catch (e) {
				var sprite_type = [];
				if (stypes[0] in that.sprite_groups) 
					sprite_type = that.sprite_groups[stypes[0]];
				
				if (sprite_type.length > 0) {
					var sprite_rep = sprite_type[0];
					fs_colorized['objects'][colorDict[sprite_rep.color.toString()]] = fs['objects'][sprite_name];
				}
			}
		}

		return fs_colorized;
	}

	that._clearAll = function (onscreen = true) {
		that.kill_list.forEach(function (s) {
			that.all_killed.push(s);
			if (onscreen)
				s._clear(that.screen, that.background, double = true);
			delete that.sprite_groups[s.name];
		});

		if (onscreen)
			for (s in that) 
				s._clear(that.screen, that.background);
		that.kill_list = [];
	}

	that._drawAll = function () {
		for (s in that)
			s._draw(that);
	}

	that._updateCollisionDict = function (changedsprite) {
		for (key in changedsprite.stypes) {
			if (key in that.lastcollisions)
				delete that.lastcollisions[key];
		}
	}

	that._eventHandling = function () {
		that.lastcollisions = {};
		var ss = that.lastcollisions;
		that.effectList = [];
		that.collision_eff.forEach(function (eff) {
			var [g1, g2, effect, kwargs] = eff;

			[g1, g2].forEach(function (g) {
				if (g not in ss) {
					if (g in that.sprite_groups) {
						var tmp = that.sprite_groups[g];
					} else {
						var tmp = [];
						that.sprite_groups.forEach(function (key) {
							var v = that.sprite_groups[key];
							if (v && g in v[0].stypes)
								tmp.concat(v);
						})
					}

					ss[g] = [tmp, tmp.length];
				}
			})

			if (g2 == 'EOS') {
				var [ss1, l1] = ss[g1];
				ss1.forEach(s1) {
					if (!(gamejs.Rect([0, 0], that.screensize).contains(s1.rect))) {
						var e = effect(s1, null, that, kwargs);
						if (e != null) {
							that.effectList.push(e);
						}
					}
				}

				continue;
			}

			var [ss1, l1] = ss[g1];
			var [ss2, l2] = ss[g2];

			if (l1 < l2)
				var [shartss, longss, switch] = [ss1, ss2, false];
			else
				var [shortss, longss, switch] = [ss2, ss1, true];

			var score = 0;
			if ('scoreChange' in kwargs) {
				kwargs = kwargs.copy();
				score = kwargs['scoreChange'];
				delete kwargs['scoreChange'];
			}

			var dim = null;
			if ('dim' in kwargs) {
				kwargs = kwargs.copy();
				dim = kwargs['dim'];
				delete kwargs['dim'];
			}

			shortss.forEach(function (s1) {
				collidelistall(longss).forEach(function (ci) {
					var s2 = longss[ci];
					if (s1 == s2)
						continue

					if (score > 0) 
						that.score += score;

					if ('applyto' in kwargs) {
						var stype = kwargs['applyto'];

						var kwargs_use = deepcopy(kwargs);
						delete kwargs_use['applyto'];
						that.getSprites(stype).forEach(function (sC) {
							var e = effect(sC, s1, self, kwargs_use);
						});
						that.effectList.push(e);
						continue;
					}
				})

				if (dim) {
					var sprites = that.getSprites(g1);
					var spritesFiltered = sprites.filter(function (sprite) {
						return sprite[dim] == s2[dim];
					});

					spritesFiltered.forEach(function (sC) {
						if (!(s1 in that.kill_list)) {
							if (switch) 
								var e = effect(sC, s1, that, kwargs);
							else
								var e = effect(s1, sC, that, kwargs);
						}

						that.effectList.push(e);
						continue;
					});

					if (switch)
						[s1, s2] = [s2, s1];

					if (!(s1 in that.kill_list)) {
						if (effect.__name__ == 'changeResource') {
							var resource = kwargs['resource'];
							var [sclass, args, stypes] = that.sprite_constr[resource];
							var resource_color = args['color'];
							var e = effect(s1, s2, resource_color, that, kwargs);
						} else {
							var e = effect(s1, s2, that, kwargs);
						}

						if (e != null) {
							that.effectList.append(e);
						}
					}
				}
			})
		});

		return that.effectList;
	}

	that.startGame = function () {
		that._initScreen(that.screensize);
		// gamejs.display.flip();
		
		that.reset();
		// var clock = gamejs.time.Clock();
		// if (that.playback_actions)
		// 		that.frame_rate = 5;
		
		var win = false;
		var i = 0;

		var lastKeyPress = [0, 0, 1];
		var lastKeyPressTime = 0;

		// var f = stypes
		// m = re.search('[A-Za-z0-9+)\.py', f)?
		
		var name = m.group(1);
		var gamelog = "";

		// -------------- Game-play ----------------
		// from ontology import Immovable, Passive, Resource, ResourcePack, RandomNPC, Chaser, AStarChaser, OrientedSprite, Missile
  		// from ontology import initializeDistribution, updateDistribution, updateOptions, sampleFromDistribution
		// import things
		var finalEventList = [];
		var agentStatePrev = [];
		var agentState = {};
		that.getAvatars()[0].resources.forEach(function (resource) {
			agentState[resource[0]] = resource[1];
		})
		var keyPressPrev = null;

		//Prep for Sprite Induction 
		var sprite_types = [Immovable, Passive, Resource, ResourcePack, RandomNPC, Chaser, AstarChaser, OrintedSprite, Missile];
		that.all_objects = that.getObjects(); // Save all objects, some which may be killed in game

		// figure out keypress type
		disableContinuousKeyPress = that.all_objects.keys().every(function (k) {
			return that.all_objects[k]['sprite'].physicstype.__name__ == 'GridPhysics';
		});

		var objects = that.getObjects();
		that.spriteDistribution = {};
		that.movement_options = {};

		objects.forEach(function (sprite) {
			that.spriteDitribution[sprite] = initializeDistribution(sprite_types);
			that.movement_options[sprite] = {"OTHER": {}};
			sprite_types.forEach(function (sprite_type) {
				that.movement_options[sprite][sprite_type] = {};
			})
		});

		// This should actually be in a game loop function, or something.
		while (!(that.ended)) {
			that.time ++;

			that._clearAll();

			var objects = that.getObjects();
			objects.forEach(function (sprite) {
				if (!(that.spriteDistribution in sprite)) {
					that.all_objects[sprite] = objects[sprite];
					that.spriteDistribution[sprite] = initializeDistribution(sprite_types);
					that.movement_options[sprite] = {"OTHER": {}};
					sprite_types.forEach(function (sprite_type) {
						that.movement_options[sprite][sprite_type] = {};
					})
				}
			})
		}
	}

	that.getPossibleActions = function () {
		that.getAvatars()[0].declare_possible_actions();
	}

	that.tick = function (action) {

	}

	Object.freeze(that);
	return that;
}

module.exports = BasicGame;