function VGDLSprite (pos, size = (10, 10), color = null, speed = null, cooldown = null, physicstype = null, kwargs) {
	var that = Object.create(VGDLSprite.prototype);

	that.name = null;
	that.COLOR_DISC = [20, 80, 140, 200];
	that.is_static = false;
	that.only_active = false;
	that.is_avatar = false;
	that.is_stochastic =false;
	that.color = null;
	that.cooldown = 0;
	that.speed = null;
	that.mass = 1;
	that.physicstype = null;
	that.shrinkfactor = 0;

	// import GridPhysics
	
	that.rect = gamejs.Rect(pos, size);
	that.x = pos[0];
	that.y = pos[1];
	that.lastrect = that.rect;
	that.physicstype = physicstype || that.physicstype // || GridPhysics;
	that.physics = that.physicstype();
	that.physics.gridsize = size;
	that.speed = speed || that.speed;
	that.cooldown = cooldown || that.cooldown;
	that.ID = id(that);
	that.direction = null;

	that.color = color || that.color || [140, 20, 140];

	// iterate over kwargs
	Object.keys(kwargs).forEach(function (name) {
		var value = kwargs[name];
		try {
			that[name] = value;
		}
		catch (e) {
			console.log(e);
		}
	});

	// how many timesteps ago was the last move
	that.lastmove = 0;

	// management of resources contained in the sprite
	that.resources = {};

	return that;
}

VGDLSprite.prototype = {

	dirtyrects : [],
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
		return `${this.name} at (${this.rect.left}, ${this.rect.top})`; 
	}
}

function Immovable () {
	var that = Object.create(VGDLSprite.prototype);

	that.color = GRAY;
	that.is_static = true;

	return that;
}

function Passive () {
	var that = Object.create(VGDLSprite.prototype);
	that.color = RED;
	return that;
}

function Flicker (kwargs) {
	var that = VGDLSprite.apply(null, kwargs);

	that.color = RED;
	that.limit = 1;

	return that;
}

var vgdl_sprite = {
	VGDLSprite : VGDLSprite,
	Immovable : Immovable,
	Passive : Passive,
	Flicker : Flicker
};

module.exports = vgdl_sprite;