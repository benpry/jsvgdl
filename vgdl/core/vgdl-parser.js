var VGDLParser = function () {
	var parser = Object.create(null);
	var verbose = false;

	var parseGame = function (tree) {

		if (!(tree instanceof tools.Node))
			tree = tools.indentTreeParser(tree).children[0];

		[sclass, args] = _parseArgs(tree.content);
		parser.game = sclass(args);
		tree.children.forEach(function (child) {
			parse[child.content](child.children);
		});

		return parser.game;
	}

	var _eval = function (estr) {
		// Oh shit...
		estr = 'core.' + estr;
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
					var [eclass, args] = _parseArgs(edef);
					parser.game.collision_eff.push(
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
				var [sclass, args] = _parseArgs(sdef, parentClass, Object.assign({}, parentargs));
				var stypes = parenttypes.concat(key);

				if ('singleton' in args) {
					if (args['singleton'] == true) 
						parser.game.singletons.push(key);
					args = tools.clone(args);
					delete args['singleton'];
				}

				if (snode.children.length == 0) {
					if (verbose) 
						console.log('Defining:', key, sclass, args, stypes);
					// console.log('parser', parser);
					// console.log('game', parser.game);
					parser.game.sprite_constr[key] = [sclass, args, stypes];
					if (key in parser.game.sprite_order) {
						var index = parser.game.sprite_order.indexOf(key);
						parser.game.sprite_order.splice(index, 1);
					}
					parser.game.sprite_order.push(key);
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
				parser.game.terminations.append(sclass(args));
			});
		},
		//parseConditions
		'ConditionalSet' : function (cnodes) {
			cnodes.forEach(function (cnode) {
				if (cnode.content.indexOf('>') != -1) {
					var [conditional, interaction] = cnode.content.split('>').map(function (s) {
						return s.trim();
					});

					var [cclass, cargs] = _parseArgs(conditional);
					var [eclass, eargs] = _parseArgs(interaction);

					parser.game.conditions.push([cclass(cargs), [eclass, eargs]]);
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

			parser.game.char_mapping[c] = keys;
		});

	}

	var _parseArgs = function (string, sclass={}, args={}) {
		var sparts = string.split(' ').map(function (s) {
			return s.trim();
		});
		
		if (sparts.length == 0)
			return [sclass, args];	

		console.log('sparts[0]', sparts[0]);
		if (sparts[0].indexOf('=') == -1) {
			sclass = _eval(sparts[0]);
			sparts = sparts.slice(1);
		}
		console.log('sclass', sclass);
		console.log('sparts', sparts);	
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

	parser.playGame = function (game_str, map_str) {

		var game = parseGame(game_str);

		game.buildLevel(map_str);
		// game.uiud;
		game.startGame();

		return game;
	}


	Object.freeze(parser);
	return parser;
}

module.exports = VGDLParser;