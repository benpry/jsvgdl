var tools = Tools();

function VGDLSprite(gamejs, pos, size = [10, 10], args) {

	
	this.gamejs = gamejs

	this.name = args.key || null;
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
	// this.dirtyrects = [];

	// import GridPhysics
	
	this.rect = new gamejs.Rect(pos, size);
	this.x = pos[0];
	this.y = pos[1];
	this.lastrect = this.rect;
	this.physicstype = args.physicstype || this.physicstype || GridPhysics;
	this.physics = new this.physicstype();
	this.physics.gridsize = size;
	this.speed = args.speed || this.speed;
	this.cooldown = args.cooldown || this.cooldown;
	this.ID = new_id();
	this.direction = null;

	this.color = args.color || this.color || '#8c148c';

	// iterate over kwargs
	if (args) {
		Object.keys(args).forEach(function (name) {
			var value = args[name];
			try {
				this[name] = value;
			}
			catch (e) {
				console.log(e);
			}
		});
	}

	// how many timesteps ago was the last move
	this.lastmove = 0;

	// management of resources contained in the sprite
	this.resources = {};
}

VGDLSprite.dirtyrects = [];

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
		if (speed == null)
			speed = this.speed;

		if (!(this.cooldown > this.lastmove) || Math.abs(orientation[0]) + Math.abs(orientation[1]) == 0) {
			// this.rect = this.rect.move(orientation[0] * speed, orientation[1] * speed);
			this.rect.moveIp(orientation[0] * speed, orientation[1] * speed);
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
		// console.log(this.rect);
		this.gamejs.graphics.rect(game.screen, this.color, this.rect);

		return;
		var screen = game.screen;
		if (this.shrinkfactor != 0)
			var shrunk = this.rect.inflate(-this.rect.width * this.shrinkfactor,
											-this.rect.height * this.shrinkfactor);
		else
			var shrunk = this.rect;

		if (this.is_avatar) {
			var rounded = tools.roundedPoints(shrunk);
			this.gamejs.graphics.polygon(screen, this.color, rounded);
			this.gamejs.graphics.lines(screen, '#32fa32', true, rounded, 2);
			var r = this.rect.clone();
		} 
		else if (!(this.is_static)) {
			var rounded = roundedPoints(shrunk);
			this.gamejs.graphics.polygon(screen, this.color, rounded);
			var r = this.rect.clone();
		} 
		else {
			var r = screen.fill(this.color, shrunk);
		}

		// if (this.resources) 
		// 	this._drawResources(game, screen, shrunk);
		VGDLSprite.dirtyrects.push(r);
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

function Immovable (gamejs, pos, size = [10, 10], args) {
	this.color = GRAY;
	this.is_static = true;
	VGDLSprite.call(this, gamejs, pos, size, args);
}

Immovable.prototype = Object.create(VGDLSprite.prototype);

function Passive (gamejs) {
	this.color = RED;
	VGDLSprite.call(this, arguments);
}
Passive.prototype = Object.create(VGDLSprite.prototype);

function Flicker (gamejs, kwargs) {
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

var VGDLSpriteModule = {
	VGDLSprite : VGDLSprite,
	Immovable : Immovable,
	Passive : Passive,
	Flicker : Flicker
};

try {
	module.exports = VGDLSpriteModule;
} catch (e) {
	
}
