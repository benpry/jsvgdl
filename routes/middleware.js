var Middleware = function () {
	var that = this;

	that.require_login = function (req, res, next) {
		if (req.session.logged_in) 
			next();
		else
			res.redirect('/admin/login');
	}

	that.validate_exp = function (req, res, next) {	
		var exp_id = req.session.exp_id
		// console.log(req.session.cookie)
		var val_id = req.session.val_id
		// next()

		if (exp_id == '0') {
			res.end();
			return
		}
		if (experiments[exp_id] && experiments[exp_id].validate(val_id)) {
			next();
		} else {
			res.status(404).render('404');
		}
	}

	Object.freeze(that);
	return that;
}

module.exports = Middleware();