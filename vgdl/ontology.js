
var core_module = require('../vgdl/core.js');

console.log('core_module', core_module);

var Ontology = function () {	
	ontology = Object.create(Ontology.prototype);

	var core = core_module();

	ontology.GREEN = [0, 200, 0];
	ontology.BLUE = [0, 0, 200];
	ontology.RED = [200, 0, 0];
	ontology.GRAY = [90, 90, 90];
	ontology.WHITE = [250, 250, 250];
	ontology.BROWN = [140, 120, 100];
	ontology.BLACK = [0, 0, 0];
	ontology.ORANGE = [250, 160, 0];
	ontology.YELLOW = [250, 250, 0];
	ontology.PINK = [250, 200, 200];
	ontology.GOLD = [250, 212, 0];
	ontology.LIGHTRED = [250, 50, 50]
	ontology.LIGHTORANGE = [250, 200, 100];
	ontology.LIGHTBLUE = [50, 100, 250];
	ontology.LIGHTGREEN = [50, 250, 50];
	ontology.LIGHTGRAY = [150, 150, 150];
	ontology.DARKGRAY = [30, 30, 30];
	ontology.DARKBLUE = [20, 20, 100];
	ontology.PURPLE = [140, 20, 140];

	ontology.UP = [0, -1];
	ontology.DOWN = [0, 1];
	ontology.LEFT = [-1, 0];
	ontology.RIGHT = [1, 0];


	// console.log("ontology's core", core);
	// 
	// console.log('check prototype', core.VGDLSprite.prototype);

	ontology.Immovable = function () {
		var that = Object.create(core.VGDLSprite.prototype);

		that.color = ontology.GRAY;
		that.is_static = true;

		Object.freeze(that);
		return that;
	}

	Object.freeze(ontology);
	return ontology;
}

module.exports = Ontology;