var mongoose = require('mongoose');
var Mixed = mongoose.Schema.Types.Mixed;

var SubjectSchema = mongoose.Schema({
	MTurkID : {type: String, required : true}, 
	ValID: String,

	Games   : [{
		game : {type: String, ref: "Game", required: true},
		color_scheme: {type: Number, required: true},
		levels: [{
			level: {type: Number, required: true},
			desc: {type: Number, required: true},
			time_start: Date
		}],
		time_start: Date,
		delay_retry  : {type: Number, required: true},
		delay_forfeit: {type: Number, required: true}
	}],

	current_game  : {type: Number, default: 0},
	current_level : {type: Number, default: 0},
	// Expires after an hour
	createdAt : {type: Date, expires: 3600}
})

var experiments = [
    ['gvgai_sokoban',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        ''],
    ['gvgai_butterflies', 
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        ''],
    ['gvgai_aliens', 
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false, 
        'On this game you can also use the spacebar.'], // never gets shown
    ['gvgai_chase',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        ''],
    ['gvgai_frogs',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        ''],
    ['gvgai_missilecommand',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        'On this game you can also use the spacebar.'],
    ['gvgai_portals',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        ''],
    ['gvgai_zelda', 
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        'On this game you can also use the spacebar.'],
    ['gvgai_boulderdash', 
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        'On this game you can also use the spacebar.', 45, 6*60],
    ['gvgai_survivezombies',
        [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], false,
        '']
]

SubjectSchema.statics.add_subject = function (mturk_id, callback) {
	
}

var model = mongoose.model('Subject', SubjectSchema);

model.experiments = experiments;

module.exports = model;
