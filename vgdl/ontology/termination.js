var Termination = function () {
	var that = Object.create(Termination);
	return that;
}

Termination.prototype = {
	isDone : function (game) {
		// improt escape conditions
		return [false, null];
	}
}

var Timeout = function (limit=0, win=true) {
	var that = Object.create(Timeout.prototype);

	that.limit = limit;
	that.win = win;

	return that;
}
Timeout.prototype = new Termination();

Timeout.prototype.isDone = function (game) {
	if (game.time >= this.limit) 
		return [true, this.win];
	else
		return [false, null];
}

var SpriteCounter = function (limit=0, stype=null, win=false) {
	var that = Object.create(SpriteCounter.prototype);

	that.limit = limit;
	that.stype = stype;
	that.win = win;

	return that;
}
SpriteCounter.prototype = new Termination();

SpriteCounter.prototype.isDone = function (game) {
	if (game.numSprites(this.stype) <= this.limit)
		return [true, this.win];
	else
		return [false, null];
}


var termination = {
	Termination : Termination,
	Timeout : Timeout,
	SpriteCounter : SpriteCounter
};


module.exports = termination;