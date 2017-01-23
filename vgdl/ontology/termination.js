var Termination = function () {
	var that = Object.create(null);
	return that;
}

Termination.prototype = {
	isDone : function (game) {
		// improt escape conditions
		return [false, null];
	}
}