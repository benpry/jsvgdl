function stepBack (sprite, partner, game) {
	// console.log('stepBack');
	// console.log(sprite.rect);
	// console.log(sprite, partner);
	// console.log('stepback', sprite.rect, sprite.lastrect);
	// console.log(sprite.rect == sprite.lastrect);
	sprite.rect = sprite.lastrect.clone();
	// return ['stepBack', sprite.ID, partner.ID];
}

function killSprite (sprite, partner, game) {
	console.log('killing sprite', sprite, 'colliding with', partner);

	game.kill_list.push(sprite);
	// console.log(sprite.toString());

}


var stochastic_effects = []//[teleportToExit, windGust, slipForward, attractGaze, flipDirection];
var kill_effects = [killSprite] //killIfSlow, transformTo, killIfOtherHasLess, killIfOtherHasMore, killIfHasMore, killIfHasLess, killIfFromAbove, killIfAlive];

try {
	module.exports = Effect;
} catch (e) {
	
}