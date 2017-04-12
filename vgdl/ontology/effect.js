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
		killSprite(sprite, partner, game, kwargs); 
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

// function undoAll(sprite, partner, game, kwargs) {

// }

function bounceForward(sprite, partner, game, kwargs) {
	sprite.physics.activeMovement(sprite, tools.unitVector(partner.lastdirection()));
	game._updateCollisionDict(sprite);

}

function undoAll(sprite, partner, game, kwargs) {
	
}

function conveySprite(sprite, partner, game, kwargs) {

}

function windGust(sprite, partner, game, kwargs) {

}

function slipForward(sprite, partner, game, kwargs) {

}

function attractGaze(sprite, partner, game, kwargs) {

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

}

function killIfSlow(sprite, partner, game, kwargs) {

}

function killIfFromAbove(sprite, partner, game, kwargs) {

}

function killIfAlive(sprite, partner, game, kwargs) {

}

function collectResource(sprite, partner, game, kwargs) {

}

function changeResource(sprite, partner, game, kwargs) {

}

function spawnIfHasMore(sprite, partner, game, kwargs) {

}

function killIfHasMore(sprite, partner, game, kwargs) {

}

function killIfHasLess(sprite, partner, game, kwargs) {

}

function killIfOtherHasMore(sprite, partner, game, kwargs) {

}

function killIfOtherHasLess(sprite, partner, game, kwargs) {

}

function wrapAround(sprite, partner, game, kwargs) {

}

function pullWithIt(sprite, partner, game, kwargs) {

}

function collideFromAbove(sprite, partner, game, kwargs) {

}

function killSpriteOnLanding(sprite, partner, game, kwargs) {

}

function teleportToExit(sprite, partner, game, kwargs) {

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