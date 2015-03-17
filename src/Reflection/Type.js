(function(_){
	
	_.Type = function(name, type)
	{
		this._name = name;
		this._type = type;
	};
	
	_.Type.acceptClassDependencies = function(namespaceManager, typeRegistry, memberRegistry)
	{
		_.Type._namespaceManager = namespaceManager;
		_.Type._typeRegistry = typeRegistry;
		_.Type._memberRegistry = memberRegistry;
	};
	
	_.Type.prototype.getMethods = function()
	{
		var members = _getMembers(this);
		var methods = [];
		for (var i in members) {
			if (members[i] instanceof ClassyJS.Member.Method) {
				methods.push(new Reflection.Method(members[i]));
			}
		}
		return methods;
	};
	
	_.Type.prototype.getProperties = function()
	{
		var members = _getMembers(this);
		var properties = [];
		for (var i in members) {
			if (members[i] instanceof ClassyJS.Member.Property) {
				properties.push(new Reflection.Property(members[i]));
			}
		}
		return properties;
	};
	
	var _getMembers = function(_this)
	{
		try {
			if (_this._type == 'interface') {
				return _.Type._memberRegistry.getMembers(
					_.Type._typeRegistry.getInterface(_this._name)
				);
			} else {
				return _.Type._memberRegistry.getMembers(
					_.Type._typeRegistry.getClass(
						_.Type._namespaceManager.getNamespaceObject(_this._name)
					)
				);
			}
		} catch (error) {
			if (error instanceof ClassyJS.Registry.Type.Fatal
			&&  error.code == 'CLASS_NOT_REGISTERED') {
				return [];
			} else {
				throw error;
			}
		}
	};
	
})(window.Reflection = window.Reflection || {});
