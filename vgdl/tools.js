Object.prototype.extend = function () {
	// console.log(arguments);
	for (argument in arguments) {
		for (property in arguments[argument]) {
			// console.log(property);
			if (property != 'extend')
				this[property] = arguments[argument][property];
		}
	}
}

/**
 * @param  {String}	tabSize
 * @return {String}	new string with expanded tabs
 * pulled from
 * http://cwestblog.com/2012/01/23/javascript-string-prototype-expandtabs-revisited/
 * to mimic Python's String.expandtab() function
 */
String.prototype.expandTabs = function(tabSize) {
  var spaces = (new Array((tabSize = tabSize || 8 ) + 1)).join(" ");
  return this.replace(/([^\r\n\t]*)\t/g, function(a, b) {
    return b + spaces.slice(b.length % tabSize);
  });
};

/**
 * Tools used for vgdl. Some of these functions alraedy exist in the gamejs library
 */
var Tools = function () {
	var that = Object.create(Tools.prototype);

	/**
	 * @param  {[type]}
	 * @return {[type]}
	 */
	that.clone = function (obj) {
	    if (null == obj || "object" != typeof obj) return obj;
	    var copy = obj.constructor();
	    for (var attr in obj) {
	        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	    }
	    return copy;
	}


	/**
	 * @param  {[type]}
	 * @return {[type]}
	 */
	that.vectNorm = function (vector) {
		return Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
	}

	/**
	 * @param  {[type]}
	 * @return {[type]}
	 */
	that.unitVector = function (vector) {
		var norm = that.vectNorm(vector);
		if (norm > 0)
			return [vector[0]/norm, vector[1]/norm];
		else
			return [1, 0];	
	}

	/**
	 * @param  {[type]}
	 * @param  {[type]}
	 * @param  {[type]}
	 * @return {[type]}
	 */
	that.oncePerStep = function (sprite, game, name) {
		var name = '_'+name;

		if (sprite[name]) 
			if (sprite[name] == game.time) return false;
		
		sprite[name] = game.time;
		return true;
	}

	/**
	 * @param  {[type]}
	 * @param  {[type]}
	 * @return {[type]}
	 */
	that.triPoints = function (rect, orientation) {
		var p1 = [rect.center[0] + orientation[0]*rect.w/3,
				  rect.center[1] + orientation[1]*rect.h/3];
		var p2 = [rect.center[0] + orientation[0]*rect.w/4,
			      rect.center[1] + orientation[1]*rect.h/4];
		var orthdir = [orientation[1], -orientation[0]];
		var p2a = [p2[0]-orthdir[0]*rect.w/6,
				   p2[1]-orthdir[1]*rect.h/6];
		var p2b = [p2[0]+orthdir[0]*rect.w/6,
				   p2[1]+orthdir[1]*rect.h/6];
		return [p1, p2a, p2b].map(function (p) {return [p[0], p[1]]});
	}

	/**
	 * @param  {[type]}
	 * @return {[type]}
	 */
	that.roundedPoints = function (rect) {

	}

	/**
	 * @param  {[type]}
	 * @param  {[type]}
	 * @return {[type]}
	 */
	that.squarePoints = function (center, size) {

	}

	/**
	 * @param {[type]}
	 * @param {[type]}
	 * @param {[type]}
	 */
	that.Node = function (content, indent, parent=null) {
		var that = Object.create(null);
		that.children = [];
		that.content = content;
		that.indent = indent;
		if (parent) 
			parent.insert(that);
		else
			that.parent = null;

		/**
		 * @param  {[type]}
		 * @return {[type]}
		 */
		that.insert = function (node) {
			if (that.indent < node.indent) {
				if (that.children.length > 0)
					console.assert(that.children[0].indent == node.indent, 'children indentations must match');
				that.children.push(node);
				node.parent = that;
			} else {
				console.assert(that.parent, 'Root node too indented?');
				that.parent.insert(node);
			}
		}

		that.getRoot = function () {
			if (that.parent)
				return that.parent.getRoot();
			else
				return that;
		}

		Object.freeze(that);
		return that;
	}

	that.Node.prototype.toString = function () {
		if (this.children) 
    		return this.content;
    	else 
    		return this.content + this.children.toString();
	}

	/**
	 * @param  {[type]}
	 * @param  {Number}
	 * @return {[type]}
	 */
	that.indentTreeParser = function (s, tabsize=8) {
		var s = s.expandTabs(tabsize);
		s.replace('(', ' ');
		s.replace(')', ' ');
		s.replace(',', ' ');
		var lines = s.split('\n');

		var last = that.Node('', -1);
		lines.forEach(function (line) {
			if (line.indexOf('#') != -1)
				line = line.split('#')[0];
			var content = line.trim();
			if (content.length > 0) {
				var indent = line.length - line.trimLeft().length;
				last = that.Node(content, indent, last);
			}
		});

		return last.getRoot();

	}

	that.listRotate = function (list, n) {
		return list.slice(n).concat(list.slice(0, n));
	}

	Object.freeze(that);
	return that;
}

module.exports = Tools;