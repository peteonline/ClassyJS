describe('Type.Factory', function(){
	
	var factory;
	var definitionFactory;
	var classFactory;
	var interfaceFactory;
	var classDefinition;
	var interfaceDefinition;
	var classObject;
	var interfaceObject;
	var typeRegistry;
	var memberRegistry;
	var namespaceManager;
	
	beforeEach(function(){
		definitionFactory = new ClassyJS.Type.DefinitionFactory(
			new ClassyJS.Type.Class.Definition.Factory(),
			new ClassyJS.Type.Interface.Definition.Factory()
		);
		classFactory = new ClassyJS.Type.Class.Factory();
		interfaceFactory = new ClassyJS.Type.Interface.Factory();
		classDefinition = new ClassyJS.Type.Class.Definition('class MyClass');
		interfaceDefinition = new ClassyJS.Type.Interface.Definition('interface IMyInterface');
		typeRegistry = new ClassyJS.Registry.Type(new ClassyJS.NamespaceManager());
		memberRegistry = new ClassyJS.Registry.Member(typeRegistry, new ClassyJS.TypeChecker(
			new ClassyJS.TypeChecker.ReflectionFactory()
		));
		namespaceManager = new ClassyJS.NamespaceManager();
		classObject = new ClassyJS.Type.Class(
			classDefinition,
			typeRegistry,
			new ClassyJS.Registry.Member(typeRegistry, new ClassyJS.TypeChecker(
				new ClassyJS.TypeChecker.ReflectionFactory()
			)),
			namespaceManager
		);
		interfaceObject = new ClassyJS.Type.Interface();
		factory = new ClassyJS.Type.Factory(
			definitionFactory,
			classFactory,
			interfaceFactory,
			typeRegistry,
			memberRegistry,
			namespaceManager
		);
	});
	
	it('can be instantiated', function(){
		var factory = new ClassyJS.Type.Factory(
			definitionFactory,
			classFactory,
			interfaceFactory,
			typeRegistry,
			memberRegistry,
			namespaceManager
		);
		expect(factory instanceof ClassyJS.Type.Factory).toBe(true);
	});
	
	it('throws error if no type definition factory is provided', function(){
		var expectedFatal = new ClassyJS.Type.Factory.Fatal(
			'NO_DEFINITION_FACTORY_PROVIDED',
			'Provided type: object'
		);
		expect(function(){
			new ClassyJS.Type.Factory(
				{},
				classFactory,
				interfaceFactory,
				typeRegistry,
				memberRegistry,
				namespaceManager
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if no class factory is provided', function(){
		var expectedFatal = new ClassyJS.Type.Factory.Fatal(
			'NO_CLASS_FACTORY_PROVIDED',
			'Provided type: string'
		);
		expect(function(){
			new ClassyJS.Type.Factory(
				definitionFactory,
				'string',
				interfaceFactory,
				typeRegistry,
				memberRegistry,
				namespaceManager
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if no interface factory is provided', function(){
		var expectedFatal = new ClassyJS.Type.Factory.Fatal(
			'NO_INTERFACE_FACTORY_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new ClassyJS.Type.Factory(
				definitionFactory,
				classFactory,
				undefined,
				typeRegistry,
				memberRegistry,
				namespaceManager
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if no type registry is provided', function(){
		var expectedFatal = new ClassyJS.Type.Factory.Fatal(
			'NO_TYPE_REGISTRY_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new ClassyJS.Type.Factory(
				definitionFactory,
				classFactory,
				interfaceFactory,
				undefined,
				memberRegistry,
				namespaceManager
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if no member registry is provided', function(){
		var expectedFatal = new ClassyJS.Type.Factory.Fatal(
			'NO_MEMBER_REGISTRY_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new ClassyJS.Type.Factory(
				definitionFactory,
				classFactory,
				interfaceFactory,
				typeRegistry,
				undefined,
				namespaceManager
			);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if no namespace manager is provided', function(){
		var expectedFatal = new ClassyJS.Type.Factory.Fatal(
			'NO_NAMESPACE_MANAGER_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			new ClassyJS.Type.Factory(
				definitionFactory,
				classFactory,
				interfaceFactory,
				typeRegistry,
				memberRegistry
			);
		}).toThrow(expectedFatal);
	});
	
	it('accepts definition to build method', function(){
		spyOn(definitionFactory, 'build').and.returnValue(classDefinition);
		spyOn(classFactory, 'build').and.returnValue(classObject);
		factory.build('example signature');
	});
	
	it('throws error if build is called with non string argument', function(){
		var expectedFatal = new ClassyJS.Type.Factory.Fatal(
			'NON_STRING_SIGNATURE_PROVIDED',
			'Provided type: number'
		);
		expect(function(){ factory.build(123) }).toThrow(expectedFatal);
	});
	
	it('throws error if build is called with empty string argument', function(){
		var expectedFatal = new ClassyJS.Type.Factory.Fatal('EMPTY_STRING_SIGNATURE_PROVIDED');
		expect(function(){ factory.build('') }).toThrow(expectedFatal);
	});
	
	it('passes signature to definition factory', function(){
		spyOn(definitionFactory, 'build').and.returnValue(classDefinition);
		spyOn(classFactory, 'build').and.returnValue(classObject);
		factory.build('example signature');
		expect(definitionFactory.build).toHaveBeenCalledWith('example signature');
	});
	
	it('will pass created definition to class factory if definition is class', function(){
		spyOn(definitionFactory, 'build').and.returnValue(classDefinition);
		spyOn(classFactory, 'build').and.returnValue(classObject);
		factory.build('example signature');
		expect(classFactory.build).toHaveBeenCalledWith(
			classDefinition,
			typeRegistry,
			memberRegistry,
			namespaceManager
		);
	});
	
	it('will pass created definition to interface factory if definition is interface', function(){
		spyOn(definitionFactory, 'build').and.returnValue(interfaceDefinition);
		spyOn(interfaceFactory, 'build').and.returnValue(interfaceObject);
		factory.build('example signature');
		expect(interfaceFactory.build).toHaveBeenCalledWith(interfaceDefinition);
	});
	
	it('will return class returned from class factory', function(){
		spyOn(definitionFactory, 'build').and.returnValue(classDefinition);
		spyOn(classFactory, 'build').and.returnValue(classObject);
		factory.build('example signature');
		expect(factory.build('example signature')).toBe(classObject);
	});
	
	it('will return interface returned from interface factory', function(){
		spyOn(definitionFactory, 'build').and.returnValue(interfaceDefinition);
		spyOn(interfaceFactory, 'build').and.returnValue(interfaceObject);
		factory.build('example signature');
		expect(factory.build('example signature')).toBe(interfaceObject);
	});
	
	it('will throw error if definition factory returns non definition', function(){
		var expectedFatal = new ClassyJS.Type.Factory.Fatal(
			'NON_DEFINITION_RETURNED_FROM_FACTORY',
			'Returned type: object'
		);
		spyOn(definitionFactory, 'build').and.returnValue({});
		expect(function(){ factory.build('example signature'); }).toThrow(expectedFatal);
	});
	
	it('will throw error if class factory returns non class', function(){
		var expectedFatal = new ClassyJS.Type.Factory.Fatal(
			'NON_CLASS_RETURNED_FROM_FACTORY',
			'Returned type: object'
		);
		spyOn(definitionFactory, 'build').and.returnValue(classDefinition);
		spyOn(classFactory, 'build').and.returnValue({});
		expect(function(){ factory.build('example signature'); }).toThrow(expectedFatal);
	});
	
	it('will throw error if interface factory returns non interface', function(){
		var expectedFatal = new ClassyJS.Type.Factory.Fatal(
			'NON_INTERFACE_RETURNED_FROM_FACTORY',
			'Returned type: object'
		);
		spyOn(definitionFactory, 'build').and.returnValue(interfaceDefinition);
		spyOn(interfaceFactory, 'build').and.returnValue({});
		expect(function(){ factory.build('example signature'); }).toThrow(expectedFatal);
	});
	
});
