var effect = require('./effect.js');

function VGDLSprite(pos, size = [10, 10], color = null, speed = null, cooldown = null, physicstype = null, kwargs) {
	this.name = null;
	this.COLOR_DISC = [20, 80, 140, 200];
	this.is_static = false;
	this.only_active = false;
	this.is_avatar = false;
	this.is_stochastic =false;
	this.color = null;
	this.cooldown = 0;
	this.speed = null;
	this.mass = 1;
	this.physicstype = null;
	this.shrinkfactor = 0;
	this.dirtyrects = [];

	// import GridPhysics
	
	this.rect = gamejs.Rect(pos, size);
	this.x = pos[0];
	this.y = pos[1];
	this.lastrect = this.rect;
	this.physicstype = physicstype || this.physicstype // || GridPhysics;
	this.physics = this.physicstype();
	this.physics.gridsize = size;
	this.speed = speed || this.speed;
	this.cooldown = cooldown || this.cooldown;
	this.ID = id(this);
	this.direction = null;

	this.color = color || this.color || [140, 20, 140];

	// iterate over kwargs
	Object.keys(kwargs).forEach(function (name) {
		var value = kwargs[name];
		try {
			this[name] = value;
		}
		catch (e) {
			console.log(e);
		}
	});

	// how many timesteps ago was the last move
	this.lastmove = 0;

	// management of resources contained in the sprite
	this.resources = {};
}

VGDLSprite.prototype = {
	update : function (game) {
		this.x = this.rect.x;
		this.y = this.rect.y;
		this.lastrect = this.rect;

		this.lastmove += 1;
		if (!(this.is_static && !(this.only_active)))
			this.physics.passiveMovement(this);
	},

	_updatePos : function (orientation, speed = null) {
		if (speed = null)
			speed = this.speed;

		if (!(this.cooldown > this.lastmove) || Math.abs(orientation[0]) + Math.abs(orientation[1]) == 0) {
			this.rect = this.rect.move((orientation[0] * speed, orientation[1] * speed));
			this.lastmove = 0;
		}

	},

	_velocity : function () {
		if (this.speed = null || this.speed == 0 || !('orientation' in this))
			return [0, 0];
		else
			return [this.orientation[0] * this.speed, this.orientation[1]*this.speed];
	},

	lastdirection : function () {
		return [this.rect[0]-this.lastrect[0], this.rect[1]-this.lastrect[1]];
	},

	_draw : function (game) {
		// import lightgreen;
		var screen = game.screen;
		if (this.shrinkfactor != 0)
			var shrunk = this.rect.inflate(-this.rect.width * this.shrinkfactor,
											-this.rect.height * this.shrinkfactor);
		else
			var shrunk = this.rect;

		if (this.is_avatar) {
			var rounded = roundedPoints(shrunk);
			gamejs.graphics.polygon(screen, this.color, rounded);
			gamejs.graphics.lines(screen, '#32fa32', true, roudned, 2);
			var r = this.rect.copy();
		} 
		else if (!(this.is_static)) {
			var rounded = roundedPoints(shrunk);
			gamejs.graphics.polygon(screen, this.color, rounded);
			var r = this.rect.copy;
		} 
		else 
			var r = screen.fill(this.color, shrunk);

		if (this.resources) 
			this._drawResources(game, screen, shrunk);
		
		VGDLSprite.prototype.dirtyrects.push(r);
	},

	_drawResources : function (game, screen, rect) {
		// import BLACK
		var BLACK = '#000000';
		var tot = this.resources.length;
		var barheight = rect.height /3.5/ tot;
		var offset = rect.top + 2*rect.height/3;
		this.resources.keys().sort().forEach(function (r) {
			var wiggle = rect.width/10;
			var prop = Math.max(0, Math.min(1, this.resources[r] / game.resourses_limits[r]));
			var filled = gamejs.Rect(rect.left+wiggle/2, offset, prop*(rect.width-wiggle), barheight);
			var rest = gamejs.Rect(rect.left+wiggle/2+prop*(rect.width-wiggle), offset, (1-prop)*(rect.width-wiggle), barheight);
			screen.fill(game.resources_colors[r], filled);
			screen.fill(BLACK, rest);
			offset += barheight;
		});
	},

	_clear : function (screen, background, double=null) {
		var r = screen.blit(background, this.rect, this.rect);
		VGDLSprite.prototype.dirtyrects.push(r);
		if (double) {
			r = screen.blit(background, this.lastrect, this.lastrect);
			VGDLSprite.prototype.dirtyrects.push(r);
		}
	},

	inspect : function () {
		return `${this.name} at (${this.rect.left}, ${this.rect.top})`; // tick marks are cool
	}
}

function Immovable () {
	VGDLSprite.call(this, arguments);
	this.color = GRAY;
	this.is_static = true;
}
Immovable.prototype = Object.create(VGDLSprite.prototype);

function Passive () {
	VGDLSprite.call(this, arguments);
	this.color = RED;
}
Passive.prototype = Object.create(VGDLSprite.prototype);

function Flicker (kwargs) {
	VGDLSprite.call(this, arguments); // This needs to be redone so kwargs actually gets passed to the right spot
	this._age = 0;
	this.color = RED;
	this.limit = 1;
}
Flicker.prototype = Object.create(Flicker.prototype);

Flicker.prototype.update = function (game) {
	VGDLSprite.prototype.update.call(this, game);
	if (this._age > this.limit) 
		effect.killSprite(this, null, game);

	this._age ++;	
}

var vgdl_sprite = {
	VGDLSprite : VGDLSprite,
	Immovable : Immovable,
	Passive : Passive,
	Flicker : Flicker
};

module.exports = vgdl_sprite;
