var mongoose = require("mongoose");
var Mixed = mongoose.Schema.Types.Mixed;

var SubjectSchema = mongoose.Schema({
	MTurkID: { type: String, required: true },
	ValID: String,

	Games: [
		{
			game: { type: String, ref: "Game", required: true },
			color_scheme: { type: Number, required: true },
			levels: [
				{
					level: { type: Number, required: true },
					desc: { type: Number, required: true },
					time_start: Date,
				},
			],
			time_start: Date,
			delay_retry: { type: Number, required: true },
			delay_forfeit: { type: Number, required: true },
		},
	],

	current_game: { type: Number, default: 0 },
	current_level: { type: Number, default: 0 },
	// Expires after an hour
	createdAt: { type: Date, expires: 3600 },
});

var experiments = [
	["JRNL_avoidGeorge_v1", [[0, 0]], false, ""],
	["JRNL_beesAndBirds_v1", [[0, 0]], false, ""],
	["JRNL_boulderDash_v1", [[0, 0]], false, ""],
	["JRNL_plaqueAttack_v1", [[0, 0]], false, ""],
	["JRNL_portals_v1", [[0, 0]], false, "", 20],
	["JRNL_preconditions_v1", [[0, 0]], false, ""],
	["JRNL_pushBoulders_v1", [[0, 0]], false, ""],
	["JRNL_relational_v1", [[0, 0]], false, ""],
	["JRNL_watergame_v1", [[0, 0]], false, ""],
];

SubjectSchema.statics.add_subject = function (mturk_id, callback) {};

var model = mongoose.model("Subject", SubjectSchema);

model.experiments = experiments;

module.exports = model;
