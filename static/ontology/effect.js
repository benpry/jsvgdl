function getColor(sprite) {
	try {
		var color = sprite.color;
		try {
			return colorDict[color];
		} catch (e) {
			console.log(e);
			return color;
		}
	} catch (e) {
		console.log(e);
		return null;
	}
}

function killSprite (sprite, partner, game, kwargs) {

	// console.log(sprite.name, 'killed');
	game.kill_list.push(sprite);

	// console.log('kill sprite', sprite);
	return ['killSprite'];
}

function cloneSprite (sprite, partner, game, kwargs) {
	game._createSprite([sprite.name], [sprite.rect.left, sprite.rect.top]);
	return ['cloneSprite', sprite.ID, partner.ID];
}

function transformTo (sprite, partner, game, kwargs) {
	var stype = kwargs.stype;

	var newones = game._createSprite([stype], [sprite.rect.left, sprite.rect.top]);

	if (newones.length > 0) {
		if ((sprite instanceof OrientedSprite) && (newones[0] instanceof OrientedSprite))
			newones[0].orientation = sprite.orientation;
		game.kill_list.push(sprite); 
		game.dead.push(sprite);
	}

	var args = {'stype': stype}
	return ['transforrmTo', sprite.ID, partner.ID, args];

}

function transformToOnLanding (sprite, partner, game, kwargs) {
	var stype = kwargs.stype;
}

function triggerOnLading (sprite, partner, game, kwargs) {
	var strigger = kwargs.strigger;
}

function stepBack (sprite, partner, game, kwargs) {
	sprite.rect = sprite.lastrect.clone();
	// return ['stepBack', sprite.ID, partner.ID];
}

function undoAll(sprite, partner, game, kwargs) {
	console.log('undo all');
	game._iterAll().forEach(sprite => {
		sprite.rect = sprite.lastrect.copy();
	})	
}

function bounceForward(sprite, partner, game, kwargs) {
	sprite.physics.activeMovement(sprite, tools.unitVector(partner.lastdirection()));
	game._updateCollisionDict(sprite);

}

function conveySprite(sprite, partner, game, kwargs) {
	var sprite_lastrect = sprite.lastrect.copy();
	var vect = tools.unitVector(partner.orientation);
	sprite.physics.activeMovement(sprite, vect, partner.strength);
	sprite.lastrect = sprite_lastrect;
	game._updateCollisionDict(sprite);
}

function windGust(sprite, partner, game, kwargs) {
	var s = partner.strength-[0, 1, -1].randomElement();
	if (s != 0) {
		var sprite_lastrect = sprite.lastrect.copy();
		var vect = tools.unitVector(partner.orientation);
		sprite.physics.activeMovement(sprite, vect, s);
		sprite.lastrect = sprite_lastrect;
		game._updateCollisionDict(sprite);
	}
}

function slipForward(sprite, partner, game, kwargs) {
	if (kwargs.prob > Math.random()) {
		var sprite_lastrect = sprite.lastrect.copy();
		var vect = tools.unitVector(partner.orientation);
		sprite.physics.activeMovement(sprite, vect, 1);
		sprite.lastrect = sprite_lastrect;
		game._updateCollisionDict(sprite);
	}
}

function attractGaze(sprite, partner, game, kwargs) {
	if (kwargs.prob > Math.random()) {
		sprite.orientation = partner.orientation;
	}
}

function turnAround(sprite, partner, game, kwargs) {
	sprite.rect = sprite.lastrect;
	sprite.lastmove = sprite.cooldown;
	sprite.physics.activeMovement(sprite, DOWN);
	sprite.lastmove = sprite.cooldown;
	sprite.physics.activeMovement(sprite, DOWN);
	reverseDirection(sprite, partner, game, kwargs);
	game._updateCollisionDict(sprite);

}

function reverseDirection(sprite, partner, game, kwargs) {
	sprite.orientation = [-sprite.orientation[0], -sprite.orientation[1]];

}

function reverseFlowIfActivated(sprite, partner, game, kwargs) {

}

function trigger(sprite, partner, game, kwargs) {

}

function detrigger(sprite, partner, game, kwargs) {

}

function flipDirection(sprite, partner, game, kwargs) {

}

function bounceDirection(sprite, partner, game, kwargs) {
	var friction = kwargs.friction || 0;

	stepBack(sprite, partner, game);
	var inc = sprite.orientation;
    var snorm = unitVector([-sprite.rect.centerx + partner.rect.centerx,
                        - sprite.rect.centery + partner.rect.centery])

    var dp = snorm[0] * inc[0] + snorm[1] * inc[1]
    sprite.orientation = [-2 * dp * snorm[0] + inc[0], -2 * dp * snorm[1] + inc[1]]
    sprite.speed *= (1. - friction)
    // return ('bounceDirection', sprite.ID, partner.ID)
}

function wallBounce(sprite, partner, game, kwargs) {

    if (!(oncePerStep(sprite, game, 'lastbounce'))) return;
    sprite.speed *= (1. - friction)
    stepBack(sprite, partner, game)
    if (Math.abs(sprite.rect.centerx - partner.rect.centerx) > Math.abs(sprite.rect.centery - partner.rect.centery))
        sprite.orientation = (-sprite.orientation[0], sprite.orientation[1])
    else
        sprite.orientation = (sprite.orientation[0], -sprite.orientation[1])
    // return ('wallBounce', colorDict[str(partner.color)], colorDict[str(sprite.color)])
    // TODO: Not printing for now   
    // return ('wallBounce', sprite.ID, partner.ID)
}

function wallStop(sprite, partner, game, kwargs) {
	if (!(tools.oncePerStep(sprite, game, 'laststop'))) return;

	stepBack(sprite, partner, game, kwargs);
	var x_dist = Math.abs(sprite.rect.centerx - partner.rect.centerx);
	var y_dist = Math.abs(sprite.rect.centery - partner.rect.centery);
	var y_orient = sprite.orientation[1]*(1. - kwargs.friction);
	var x_orient = sprite.orientation[0]*(1. - kwargs.friction)
	if (x_dist > y_dist) 
		sprite.orientation = [0, y_orient];
	else
		sprite.orientation = [x_orient, 0];
	sprite.speed = tools.vectNorm(sprite.orientation) * sprite.speed;
	sprite.orientation = tools.unitVector(sprite.orientation);
}

function killIfSlow(sprite, partner, game, kwargs) {
	var relspeed = 0;
	if (sprite.is_static)
		relspeed = partner.speed;
	else if (partner.is_static)
		relspeed = sprite.speed;
	else
		relspeed = tools.vectNorm([sprite._velocity()[0] - partner._velocity()[0],
									sprite._velocity()[1] - partner._velocity()[1]]);
	if (relspeed < limitspeed)
		return killSprite(sprite, partner, game);
}

function killIfFromAbove(sprite, partner, game, kwargs) {

}

function killIfAlive(sprite, partner, game, kwargs) {
	if (!(game.kill_list.contains(partner))) 
		return killSprite(sprite, partner, game);
}

function collectResource(sprite, partner, game, kwargs) {
	console.assert(sprite instanceof Resource)
	var resource_type = sprite.resourceType;
	partner.resources[resource_type] = Math.max(-1, 
		Math.min(partner.resources[resource_type] + sprite.value, game.resources_limits[resource_type]));
}

function changeResource(sprite, partner, resourceColor, game, kwargs) {
	var resource = kwargs.resource;
	var value = kwargs.value || 1;
	var sprite_resource = sprite.resources[resource] || 0;
	var resource_limit = game.resources_limits[resource] || Infinity;
	sprite.resources[resource] = Math.max(-1, Math.min(sprite_resource + value, resource_limit))
	console.log(sprite.resources);
}

function spawnIfHasMore(sprite, partner, game, kwargs) {
	var resource = kwargs.resource;
	var stype = kwargs.stype;
	var limit = kwargs.limit || 1;
	if (sprite.resources[resource] >= limit) {
		game._createSprite([stype], [sprite.rect.left, sprite.rect.top]);
	}
}

function killIfHasMore(sprite, partner, game, kwargs) {
	var limit = kwargs.limit;
	var resource = kwargs.resource;
	if (sprite.resources[resource] >= limit)
		return killSprite(sprite, partner, game, kwargs);
}

function killIfHasLess(sprite, partner, game, kwargs) {
	var resource = kwargs.resource;
	var limit = kwargs.limit;
	if (sprite.resources[resource] <= limit)
		return killSprite(sprite, partner, game, kwargs);
}

function killIfOtherHasMore(sprite, partner, game, kwargs) {
	var resource = kwargs.resource;
	var limit = kwargs.limit;
	if (partner.resources[resource] <= limit)
		return killSprite(sprite, partner, game, kwargs);
}

function killIfOtherHasLess(sprite, partner, game, kwargs) {

}

function wrapAround(sprite, partner, game, kwargs) {
	var offset = kwargs.offset || 0;

    if (sprite.orientation[0] > 0)
        sprite.rect.left = offset * sprite.rect.size[1]
    else if (sprite.orientation[0] < 0)
        sprite.rect.left = game.screensize[0] - sprite.rect.size[0] * (1 + offset)
    if (sprite.orientation[1] > 0)
        sprite.rect.top = offset * sprite.rect.size[1]
    else if (sprite.orientation[1] < 0)
        sprite.rect.top = game.screensize[1] - sprite.rect.size[1] * (1 + offset)
    sprite.lastmove = 0
}

function pullWithIt(sprite, partner, game, kwargs) {
    if (!(oncePerStep(sprite, game, 'lastpull'))) return;
    var tmp = sprite.lastrect.copy;
    var v = tools.unitVector(partner.lastdirection)
    sprite._updatePos(v, partner.speed * sprite.physics.gridsize[0])
    if (sprite.physics instanceof ContinuousPhysics) {
        sprite.speed = partner.speed;
        sprite.orientation = partner.lastdirection;
    }
    sprite.lastrect = tmp
}

function collideFromAbove(sprite, partner, game, kwargs) {

}

function killSpriteOnLanding(sprite, partner, game, kwargs) {

}

function teleportToExit(sprite, partner, game, kwargs) {
	try {
		var rand_sprite = game.sprite_groups[partner.stype].randomElement();
	} catch (error) {
		var rand_sprite = game.sprite_groups['goal'].randomElement();
	}

	sprite.rect = rand_sprite.rect.copy();
	sprite.lastmove = 0;
}

var stochastic_effects = [teleportToExit, windGust, slipForward, attractGaze, flipDirection];
var kill_effects = [killSprite, killIfSlow, transformTo, killIfOtherHasLess, killIfOtherHasMore, killIfHasMore, killIfHasLess, killIfFromAbove, killIfAlive];

function canActivateSwitch(sprite, partner, game, kwargs) {

}

function cannotActivateSwitch(sprite, partner, game, kwargs) {

}

try {
	module.exports = Effect;
} catch (e) {
	
}