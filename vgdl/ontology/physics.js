function GridPhysics () {
	var that = Object.create(GridPhysics.prototype);	
	return that;
}

GridPhysics.prototype = { 
	passiveMovement : function (sprite) {
		if (sprite.speed == null)
			var speed = 1;
		else 
			var speed = sprite.speed;
		if (speed != 0 && 'orientation' in sprite)
			sprite._udpatePos(sprit.orientation, speed * this.gridsize[0]);
	},
	calculatePassiveMovement : function (sprite) {
		if (sprite.speed == null) 
			var speed = 1;
		else
			var speed = sprite.speed;
		if (speed != 0 && 'orientation' in sprite) {
			var orientation = sprite.orientation;
			speed = speed * self.gridsize[0];
			if (!(sprite.cooldown > sprite.lastmove + 1 || Math.abs(orientation[0]) + Math.abs(orientation[1]) == 0)) {
				var pos = sprite.rect.move((orientation[0] * speed, orientation[1]*speed));
				return [pos.left, pos.top];
			}
		} else {
			return null;
		}
	},
	activeMovement : function (sprite, action, speed=null) {

	},
	calculateActiveMovement : function (sprite, action, speed = null) {

	},
	distance : function (r1, r2) {
	return (Math.abs(r1.top - r2.top) + Math.abs(r1.left - r2.left))
	}
}

function ContinuousPhysics () {
	var that = Object.create(GridPhysics.prototype);
	that.gravity = 0.0;
	that.friction = 0.02;
	return that;
}

ContinuousPhysics.prototype = {
	passiveMovement : function (sprite) {

	},

	calculatePassiveMovement : function (sprite) {

	},

	activeMovement : function (sprite, action, speed=null) {

	},

	calculateActiveMovement : function (sprite, action, speed = null) {

	},

	distance : function (r1, r2) {
		return (Math.pow(Math.sqrt((r1.top - r2.top), 2)) + Math.pow(Math.sqrt(r1.left - r2.left), 2));
	}
}


function NoFrictionPhysics () {
	var that = Object.create(ContiniousPhysics.prototype);
	that.friction = 0.0;
	return that;
}

function GravityPhysics () {
	var that = Object.create(ContiniuousPhysics.prototype);
	that.gravity = 0.8;
	return that;
}

var PhysicsModule = {GridPhysics : GridPhysics,
					 ContinuousPhysics : ContinuousPhysics};

module.exports = PhysicsModule;