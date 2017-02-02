var Resource = function () {
	this.value = 1;
	this.limit = 2;
	this.res_type = null;
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
	this.is_static = true;
}
ResourcePack.prototype = Object.create(Resource.prototype);