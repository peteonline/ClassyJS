;(function(undefined){
	
	Class.Property = function(
		name,
		value,
		scope,
		getter,
		setter,
		ownerUsesGetter,
		childUsesGetter,
		ownerUserSetter,
		childUsesSetter
	){
		this.name = name;
		this.value = value;
		this.scope = scope;
		this.getter = getter;
		this.setter = setter;
		this.ownerUsesGetter = ownerUsesGetter;
		this.childUsesGetter = childUsesGetter;
		this.ownerUsesSetter = ownerUserSetter;
		this.childUsesSetter = childUsesSetter;
	};
	
})();