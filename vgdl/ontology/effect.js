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

}

function wallBounce(sprite, partner, game, kwargs) {

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