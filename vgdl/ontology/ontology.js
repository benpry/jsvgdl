var tools = require('../tools.js');


var ontology = {};
ontology.extend(require('./vgdl-sprite.js'),
				require('./avatar.js'),
				require('./physics.js'),
				require('./resource.js'),
				require('./termination.js'),
				require('./conditional.js'),
				require('./constants.js'),
				require('./effect.js'))	

module.exports = ontology;