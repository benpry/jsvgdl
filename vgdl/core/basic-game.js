/**
 * params {**kwargs} any number of arguments which will be used in the game
 */
var BasicGame = function (gamejs, args) {
	var that = Object.create(BasicGame.prototype);
	var MAX_SPRITES = 10000;

	that.default_mapping = {'w': ['wall'], 'A': ['avatar']};

	var block_size = 10;
	var frame_rate = 20;
	var load_save_enabled = true;
	var disableContinuousKeyPress = true;

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

	for (arg in args) {
		if (arg in that)
			that[arg] = args[arg];
		else
			console.log(`WARNING: undefined parameters ${arg} for game!`);
	}

	// contains mappings to constructor (just a few defaults are known)
	that.sprite_constr = {'wall': [Immovable, {'color': DARKGRAY}, ['wall']],
						  'avatar': [MovingAvatar, {}, ['avatar']]};

	// z-level of sprite types (in case of overlap)
	that.sprite_order = ['wall'];

	// contains instance lists
	that.sprite_groups = {};
	// which sprite types (abstract or not) are singletons?
	that.singletons = [];	
	// collision effects (ordered by execution order)
	that.collision_eff = [];

	that.playback_actions = [];
	that.playbacx_index = 0;
	// for reading levels
	that.char_mapping = {};
	// temination criteria
	that.terminations = [new Termination()];
	// conditional criteria
	that.conditions = [];
	// resource properties
	that.resources_limits = new defaultDict(2);
	that.resources_colors = new defaultDict(GOLD);

	that.is_stochastic = false;
	that._lastsaved = null;
	that.win = null;
	that.effectList = []; // list of effects that happened this current time step
	that.spriteDistribution = {};
	that.movement_options = {};
	that.all_objects = null;

	that.lastcollisions = {};

	that.reset();

	that.buildLevel = function (lstr) {
		var lines = lstr.split('\n').map(l => {return l.trimRight()}).filter(l => {return l.length > 0});
		var lengths = lines.map(function (line) {return line.length});

		console.assert(Math.min.apply(null, lengths) == Math.max.apply(null, lengths), "Inconsistent line lengths");

		that.width = lengths[0];
		that.height = lines.length;
		console.assert(that.width > 1 && that.height > 1, 'Level too small');

		// rescale pixels per block to adapt to the level
		that.block_size = Math.max(2, Math.floor(800/Math.max(that.width, that.height)));
		that.screensize = [that.width*that.block_size, that.height*that.block_size];

		//Set up resources
		for (var res_type in that.sprite_constr) {
		    if (!(that.sprite_constr.hasOwnProperty(res_type))) continue;
		    console.log(res_type, that.sprite_constr[res_type]);
			var [sclass, args, _] = that.sprite_constr[res_type];
			console.log(sclass);
			if (sclass.prototype instanceof Resource) {
				console.log('resource');
				if (args['res_type']) 
					res_type = args['res_type'];
				if (args['color'])
					that.resources_colors[res_type] = args['color'];
				if (args['limit'])
					that.resources_limits[res_type] = args['limit'];
			}
		};

		// create sprites
		lines.forEach(function (line, row) {
			for (var col in line) {
				var c = line[col];
				if (c in that.char_mapping) {
					var pos = [col*that.block_size, row*that.block_size];
					that._createSprite(that.char_mapping[c], pos);
				} else if (c in that.default_mapping) {
					var pos = [col*that.block_size, row*that.block_size];
					that._createSprite(that.default_mapping[c], pos);
				}
			}
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
			// console.log(key);
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
			if (anyother) return;
			args.key = key;
			var s = new sclass(gamejs, pos, [that.block_size, that.block_size], args);
			s.stypes = stypes;
			// console.log('adding', s, 'to', key);
			if (that.sprite_groups[key])
				that.sprite_groups[key].push(s);
			else 
				that.sprite_groups[key] = [s];
			that.num_sprites += 1;
			if (s.is_stochastic)
				that.is_stochastic = true;
			res.push(s);
		});

		return res;

	}

	that._createSprite_cheap = function (key, pos) {
		var [sclass, args, stypes] = that.sprite_constr[key];
		var s = sclass(gamejs, pos, [that.block_size, that.block_size], args);
		s.stypes = stypes;
		that.sprite_groups[key].push(s);
		that.num_sprites += 1;
		return s;
	}

	that._initScreen = function (size) {
		that.screen = gamejs.display.getSurface();
		that.background = new gamejs.graphics.Surface(size);
		that.background.fill(LIGHTGRAY);
		that.screen.blit(that.background, [0, 0]);
	}

	that._iterAll = function () {
		return that.sprite_order.reduce((base, key) => {
			if (that.sprite_groups[key] == undefined)
				return base;
			return base.concat(that.sprite_groups[key]);
		}, []);
	}

	that.numSprites = function (key) {
		var deleted = that.kill_list.filter(function (s) {return s.stypes[key]}).length;
		if (that.sprite_groups[key]) 
			return that.sprite_groups[key].length-deleted;
		else
			return 0; // Should be __iter__ - deleted

	}

	that.getSprites = function (key) {
		if (that.sprite_groups[key] instanceof Array){
			return that.sprite_groups[key].filter(function(s) {return that.kill_list.indexOf(s) == -1});
		}
		else
			return that._iterAll().filter(function(s) {return that.kill_list.indexOf(s) == -1});
	}

	that.getAvatars = function () {
		var res = [];
		for (var key in that.sprite_groups) {
		    if (Object.prototype.hasOwnProperty.call(that.sprite_groups, key)) {

		        var ss = that.sprite_groups[key];
		        if (ss && ss[0] instanceof Avatar)
					res.concat(ss.filter(function(s) {return that.kill_list.indexOf(s) == -1}));
		    }
		}

		return res;
	}

	that.ignoredattributes = ['stypes',
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

		for (obj_type in obs) {
			console.log(obj_type);
			console.log(that.getSprites(obj_type));
			that.getSprites(obj_type).forEach(function (obj) {
				var features = {'color': colorDict[obj.color.toString()],
				                'row': [obj.rect.top]};
				var type_vector = {'color': colorDict[obj.color.toString()],
				                   'row': [obj.rect.top]};
				var sprite = obj;
				obj_list[obj.ID] = {'sprite': sprite, 
									   'position': [obj.rect.left, obj.rect.top],
									   'features': features,
									   'type': type_vector};
			});
		};

		return obj_list;
	}

	that.getFullState = function (as_string = false) {
		var ias = that.ignoredattributes;
		var obs = {};
		for (key in that.sprite_groups) {
			if (!(that.sprite_groups.hasOwnProperty(key))) break;
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
		};

		return {'score': that.score,
				'ended': that.ended,
				'win'  : that.win,
				'objects': obs
		};
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
		// console.log('not implemented');
		// return ;

		that.kill_list.forEach(function (s) {
			that.all_killed.push(s);
			if (onscreen)
				s._clear(that.screen, that.background, double = true);
			// delete that.sprite_groups[s.name][s];
			that.sprite_groups[s.name].remove(s);
			// console.log(that.sprite_groups[s.name]);
		});

		if (onscreen)
			that._iterAll().forEach(s =>  {
				// s._clear(that.screen, that.background);
			})
		that.kill_list = [];
	}


	that._drawAll = function () {

		that._iterAll().forEach(s => {
			try {
				if (s) {
					s._draw(that);
				}
			} catch (err) {
				console.log('cannot draw', s);
			}
		})
	}

	that._updateCollisionDict = function (changedsprite) {
		for (key in changedsprite.stypes) {
			if (key in that.lastcollisions)
				delete that.lastcollisions[key];
		}
	}

	that._terminationHandling = function () {
		that.terminations.forEach(t => {
			var [ended, win] = t.isDone(that);
			that.ended = ended;
			if (that.ended) {
				if (win) {
					if (that.score <= 0)
						that.score = 1;

					that.win = true;
					// console.log(`Game won, with score ${that.score}`);
				} else {
					that.win = false;
					// console.log(`Game lost. score ${that.score}`);
				}
				// console.log('should end everything here');
				return;
			}
		});
	}


	that._eventHandling = function () {
		that.lastcollisions = {};
		var ss = that.lastcollisions;
		that.effectList = [];
		that.collision_eff.forEach(function (eff) {
			var [g1, g2, effect, kwargs] = eff;
			// console.log(eff);	
			[g1, g2].forEach(function (g) {
				if (!(g in ss)) {
					if (g in that.sprite_groups) {
						var tmp = that.sprite_groups[g];
					} else {
						var tmp = [];
						for (key in that.sprite_groups) {
							var v = that.sprite_groups[key];
							// console.log(v);	
							if (v instanceof Array && v.length) {
								if (v.length && v[0].stypes.contains(g)) {
									// console.log(v);
									tmp.concat(v);
								}
							}
						}
					}

					ss[g] = tmp;
				}
			})



			if (g2 == 'EOS') {
				var ss1 = ss[g1];
				ss1.forEach(function (s1) {
					if (!(new gamejs.Rect([0, 0], that.screensize).collideRect(s1.rect))) {
						var e = effect(s1, null, that, kwargs);
						if (e != null) {
							that.effectList.push(e);
						}
					}
				});

				return;
			}

			// console.log(ss);
			var ss1 = ss[g1];
			var ss2 = ss[g2];

			var [shortss, longss, switch_vars] = [ss1, ss2];


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

			// console.log(longss);
			shortss.forEach(function (s1) {
				var rects = longss.map(os => {return os.rect});
				// if (longss.length)
				// 	console.log(s1.name, longss[0].name);
				if (s1.rect.collidelistall(rects) == -1) return ;
				s1.rect.collidelistall(rects).forEach(function (ci) {
					var s2 = longss[ci];
					if (s1 == s2)
						return;

					console.log(s1.name, s2.name);

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
						return;
					}
				

					if (dim) {
						var sprites = that.getSprites(g1);
						var spritesFiltered = sprites.filter(function (sprite) {
							return sprite[dim] == s2[dim];
						});

						spritesFiltered.forEach(function (sC) {
							if (!(s1 in that.kill_list)) {

								var e = effect(s1, sC, that, kwargs);
							}
							// console.log(e);
							that.effectList.push(e);
							return;
						});
					}


					if (!(s1 in that.kill_list)) {
						// console.log(s1);
						if (effect.__name__ == 'changeResource') {
							var resource = kwargs['resource'];
							var [sclass, args, stypes] = that.sprite_constr[resource];
							var resource_color = args['color'];
							var e = effect(s1, s2, resource_color, that, kwargs);
						} else {
							// console.log('apply effect', effect); 	  	
							// why are all the effects happeening
							var e = effect(s1, s2, that, kwargs);
						}
						if (e != null) {
							that.effectList.push(e);
						}
					}
				});
			});
		});
		// console.log(that.effectList);
		return that.effectList;
	}


	

	that._eventHandlingWorking = function () {
		// console.log(that.lastcollisions)
		that.effectList = [];
		that.lastcollisions = {};

		var push_effect = 'bounceForward';
		var back_effect = 'stepBack';

		var force_collisions = [];
		var dead = that.kill_list.slice();


		var collision_set = {}
		var spritesActedOn = new Set([]);
		var new_collisions = {place_holder: true};
		var new_effects = [];
		var iterations = 0;
		while (Object.keys(new_collisions).length > 0 && iterations < 5) {
			new_collisions = {};
			new_effects = [];
			iterations ++;

			// Build the current sprite list (if not yet availale)
			that.collision_eff.forEach(col_eff => {
				var [class1, class2, effect, kwargs] = col_eff;
				[class1, class2].forEach(sprite_class => {
					var sprites = [];
					if (!(sprite_class in that.lastcollisions)) {
						// console.log(that.sprite_groups);
						if (sprite_class in that.sprite_groups) {
							sprites = that.sprite_groups[sprite_class];

						} else {
							sprites = [];
							Object.keys(that.sprite_groups).forEach(key => {
								// console.log(key);
								var sprite_array = that.sprite_groups[key];
								
								if (sprite_array.length && sprite_array[0].stypes.contains(sprite_class)) {
									sprites = sprites.concat(sprite_array);
									// console.log('updated', sprites);
								}
							})
						}
						// console.log(that.lastcollisions)
						that.lastcollisions[sprite_class] = sprites;
					}
					
				})
				// console.log(Object.keys(that.lastcollisions));
			})

			// console.log(that.lastcollisions);

			that.collision_eff.forEach(col_eff => {
				var [class1, class2, effect, kwargs] = col_eff;
			
				// end build
				if (class2 == 'EOS') {
					// console.log(effect, 'effect with eos as arg');
					var sprites1 = that.lastcollisions[class1];
					sprites1.forEach(sprite1 => {
						if (!(new gamejs.Rect([0, 0], that.screensize).contains(sprite1.rect)) &&
							!(collision_set[sprite1] && collision_set[sprite1].contains('EOS'))) {

							if (new_collisions[sprite1]) new_collisions[sprite1].push['EOS'];
							else new_collisions[sprite1] = ['EOS'];

							var e = effect(sprite1, null, that, kwargs);
							if (e) that.effectList.push(e);
							spritesActedOn.add(sprite1);
						}
					})
					return;
				}

				var score = 0;
				if (kwargs.scoreChange) {
					kwargs = Object.copy(kwargs);
					score = kwargs.scoreChange;
					delete kwargs.scoreChange;
				}

				var dim = null;
				if (kwargs.dim) {
					kwargs = Object.copy(kwargs);
					dim = kwargs.dim;
					delete kwargs.dim
				}

				var sprites1 = that.lastcollisions[class1];
				var sprites2 = that.lastcollisions[class2];


				sprites1.forEach(sprite1 => {

					sprite1.rect.collidelistall(sprites2).forEach(collision_index => {
						var sprite2 = sprites2[collision_index];

						if (sprite1 == sprite2 ||
							(collision_set[sprite1] && 
							 collision_set[sprite1].contains(sprite2)) ||
							dead.contains(sprite1) ||
							dead.contains(sprite2))
							return
						if (new_collisions[sprite1] instanceof Array) {
							new_collisions[sprite1].push(sprite2);
						}
						else {
							new_collisions[sprite1] = [sprite2];	
						}

						if (score) that.score += score;

						if ('applyto' in kwargs) {
							// deal with later
							// var stype = kwargs['applyto'];
						}

						if (dim) {
							// deal with later
						}

						if (effect.name == 'changeResource') {
							var resource = kwargs['resource'];
							var [sclass, args, stypes] = that.sprite_constr[resource];
							var resource_color = args['color'];
							new_effects.push(effect(sprite1, sprite2, resource_color, that, kwargs));
						}

						else if (effect.name == push_effect) {
							var sprite_in_collision = false;
							force_collisions.forEach(collision => {
								if (collision.has(sprite2)) {
									collision.add(sprite1);
									sprite_in_collision = true;
								}
							})

							if (!(sprite_in_collision))
								force_collisions.push(new Set([sprite1, sprite2]));

							new_effects.push(effect(sprite1, sprite2, that, kwargs));
						}

						else if (effect.name == back_effect) {
							var sprite_in_collision = false;
							force_collisions.forEach(collision => {
								if (collision.has(sprite1)) {
									collision.forEach(sprite => {
										new_effects.push(effect(sprite, sprite2, that, kwargs));
									})
								}
							})

							if (!(sprite_in_collision)) 
								new_effects.push(effect(sprite1, sprite2, that, kwargs))
						}

						else {
							new_effects.push(effect(sprite1, sprite2, that, kwargs));
						}
					}) 
				})

			})

			that.effectList.concat(new_effects.filter(new_effect => {
				return new_effect != null;
			}));
			Object.assign(collision_set, new_collisions);

		}
		// console.log(iterations);
		// console.log(that.effectList);
		// if (that.effectList.length) 
		// 	console.log('effectList', that.effectList);
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
		
		// var name = m.group(1);
		var gamelog = "";

		// -------------- Game-play ----------------
		// from ontology import Immovable, Passive, Resource, ResourcePack, RandomNPC, Chaser, AStarChaser, OrientedSprite, Missile
  		// from ontology import initializeDistribution, updateDistribution, updateOptions, sampleFromDistribution
		// import things
		var finalEventList = [];
		var agentStatePrev = [];
		var agentState = {};

		// that.getAvatars()[0].resources.forEach(function (resource) {
		// 	agentState[resource[0]] = resource[1];
		// })
		var keyPressPrev = null;

		//Prep for Sprite Induction 
		var sprite_types = [Immovable
							// Passive, 
							// Resource, 
							// ResourcePack, 
							// RandomNPC, 
							// Chaser, 
							// AstarChaser, 
							// OrintedSprite, 
							// Missile
							];
		that.all_objects = that.getObjects(); // Save all objects, some which may be killed in game

		// figure out keypress type
		disableContinuousKeyPress = Object.keys(that.all_objects).every(function (k) {
			return that.all_objects[k]['sprite'].physicstype.__name__ == 'GridPhysics';
		});

		var objects = that.getObjects();
		that.spriteDistribution = {};
		that.movement_options = {};
		Object.keys(objects).forEach(function (sprite) {
			that.spriteDistribution[sprite] = initializeDistribution(sprite_types);
			that.movement_options[sprite] = {"OTHER": {}};
			sprite_types.forEach(function (sprite_type) {
				that.movement_options[sprite][sprite_type] = {};
			})
		});

		// This should actually be in a game loop function, or something.
		
	
		that.time ++;

		// that._clearAll();

		var objects = that.getObjects();
		Object.keys(objects).forEach(function (sprite_number) {
			var sprite = objects[sprite_number];
			if (!(that.spriteDistribution in sprite)) {
				that.all_objects[sprite] = objects[sprite];
				that.spriteDistribution[sprite] = initializeDistribution(sprite_types);
				that.movement_options[sprite] = {"OTHER": {}};
				sprite_types.forEach(function (sprite_type) {
					that.movement_options[sprite][sprite_type] = {};
				})
			}
		});

		that.keystate = {};
		that.keywait = {};
		// disableContinuousKeyPress = false;

		gamejs.event.onKeyDown (event => {
			if (!(that.keywait[event.key]))
				that.keystate[event.key] = true;
		});

		gamejs.event.onKeyUp (event => {
			that.keystate[event.key] = false;
			that.keywait[event.key] = false;
		})

		// Main Game Loop
		var pre_time = new Date().getTime();
		var new_time = 0;
		var fps = 20;
		var mpf = 1000/fps;


		that.collision_eff.forEach(eff=> {
			console.log(eff);
		})
		gamejs.onTick(function () {



			// console.log(that.kill_list);

			new_time = new Date().getTime();
			ms = (new_time - pre_time);

			if (ms < mpf) return;

			// disable continuous key press

			pre_time = new_time;

			that._terminationHandling();
			that._eventHandling();

			// that.background.fill(LIGHTGRAY);
			that.background.fill(LIGHTGRAY);
			that.screen.blit(that.background, [0, 0]);
			that._clearAll();
			that._drawAll();


			that._iterAll().forEach(sprite => {
				sprite.update(that);
			})

			that.time ++;

			// Discontinuous key press
			if (disableContinuousKeyPress) {
				Object.keys(that.keystate).forEach(key => {
					if (that.keystate[key]) {
						that.keystate[key] = false;
						that.keywait[key] = true;
					}
				});
			}

		})

		
	}

	that.getPossibleActions = function () {
		that.getAvatars()[0].declare_possible_actions();
	}

	that.tick = function (action) {

	}

	return that;
}

try {module.exports = BasicGame}
catch (e) {};
