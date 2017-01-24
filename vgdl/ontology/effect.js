var Effect = {
	killSprite : function (sprite, partner, game) {
		game.kill_list.push(sprite);
		if (!(null in [sprite, partner]))
			return ["killSprite", sprite.ID, partner.ID];
	},

	stochastic_effects : []
};



module.exports = Effect;