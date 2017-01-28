function stepBack () {
	console.log('effect called');
}

function killSprite () {

}


var stochastic_effects = []//[teleportToExit, windGust, slipForward, attractGaze, flipDirection];
var kill_effects = [killSprite] //killIfSlow, transformTo, killIfOtherHasLess, killIfOtherHasMore, killIfHasMore, killIfHasLess, killIfFromAbove, killIfAlive];

try {
	module.exports = Effect;
} catch (e) {
	
}