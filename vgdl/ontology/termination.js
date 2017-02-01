var Termination = function () {
}

Termination.prototype = {
	isDone : function (game) {
		// improt escape conditions
		return [false, null];
	}
}

var Timeout = function (args) {
	this.limit = args.limit;
	this.win = args.win;
}
Timeout.prototype = Object.create(Termination.prototype);

Timeout.prototype.isDone = function (game) {
	if (game.time >= this.limit) 
		return [true, this.win];
	else
		return [false, null];
}

var SpriteCounter = function (args) {
	this.limit = args.limit || 0;
	this.stype = args.stype;
	this.win = args.win;
}
SpriteCounter.prototype = Object.create(Termination.prototype);

SpriteCounter.prototype.isDone = function (game) {
	if (game.numSprites(this.stype) <= this.limit)
		return [true, this.win];
	else
		return [false, null];
}


var TerminationModule = {
	Termination : Termination,
	Timeout : Timeout,
	SpriteCounter : SpriteCounter
};


try {
	module.exports = TerminationModule;
} catch (e) {
	
}