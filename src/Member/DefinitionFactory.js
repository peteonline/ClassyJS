;(function(ClassyJS, _){
	
	_.DefinitionFactory = function(
		propertyDefinitionFactory,
		methodDefinitionFactory,
		eventDefinitionFactory,
		constantDefinitionFactory
	)
	{
		if (!(propertyDefinitionFactory instanceof _.Property.Definition.Factory)) {
			throw new _.DefinitionFactory.Fatal('PROPERTY_DEFINITION_FACTORY_NOT_PROVIDED');
		}
		if (!(methodDefinitionFactory instanceof _.Method.Definition.Factory)) {
			throw new _.DefinitionFactory.Fatal('METHOD_DEFINITION_FACTORY_NOT_PROVIDED');
		}
		if (!(eventDefinitionFactory instanceof _.Event.Definition.Factory)) {
			throw new _.DefinitionFactory.Fatal('EVENT_DEFINITION_FACTORY_NOT_PROVIDED');
		}
		if (!(constantDefinitionFactory instanceof _.Constant.Definition.Factory)) {
			throw new _.DefinitionFactory.Fatal('CONSTANT_DEFINITION_FACTORY_NOT_PROVIDED');
		}
		this._propertyDefinitionFactory = propertyDefinitionFactory;
		this._methodDefinitionFactory = methodDefinitionFactory;
		this._eventDefinitionFactory = eventDefinitionFactory;
		this._constantDefinitionFactory = constantDefinitionFactory;
	};
	
	_.DefinitionFactory.prototype.build = function(signature)
	{
		if (typeof signature != 'string') {
			throw new _.DefinitionFactory.Fatal(
				'NON_STRING_SIGNATURE',
				'Provided type: ' + typeof signature
			);
		}
		var factories = ['Property', 'Method', 'Event', 'Constant'];
		for (var i in factories) {
			try {
				var factory = this['_' + factories[i].toLowerCase() + 'DefinitionFactory'];
				var returnObject = factory.build(signature);
				if (typeof returnObject != 'object') {
					throw new _.DefinitionFactory.Fatal(
						'FACTORY_RETURNED_NON_OBJECT',
						'Returned type: ' + typeof returnObject
					);
				}
				break;
			} catch (error) {
				if (!(error instanceof ClassyJS.Member[factories[i]].Definition.Fatal)
				||	error.code != 'SIGNATURE_NOT_RECOGNISED') {
					throw error;
				}
			}
		}
		if (typeof returnObject == 'undefined') {
			throw new _.DefinitionFactory.Fatal(
				'INVALID_SIGNATURE',
				'Provided signature: ' + signature
			);
		}
		return returnObject;
	};
})(
	window.ClassyJS = window.ClassyJS || {},
	window.ClassyJS.Member = window.ClassyJS.Member || {}
);