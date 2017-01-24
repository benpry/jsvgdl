var Resource = function () {
	var that = Object.create(Resource.prototype);

	that.value = 1;
	that.limit = 2;
	that.res_type = null;

	return that;
}

Resource.prototype = {
	resourceType : function () {
		if (this.res_typ == null)
			return this.name;
		else
			return this.res_type;
	}
}

function ResourcePack () {
	var that = Object.create(Resource.prototype);

	that.is_static = true;

	return that;
}