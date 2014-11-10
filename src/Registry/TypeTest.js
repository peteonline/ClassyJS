describe('Registry.Type', function(){
	
	var registry;
	var classConstructor;
	var parentClassConstructor;
	var grandParentClassConstructor;
	var classObject;
	var parentClassObject;
	var grandParentClassObject;
	var interfaceObject;
	var interfaceObject2;
	
	beforeEach(function(){
		classConstructor = function(){};
		parentClassConstructor = function(){};
		grandParentClassConstructor = function(){};
		classObject = new ClassyJS.Type.Class(
			new ClassyJS.Type.Class.Definition('class MyClass'),
			new ClassyJS.Registry.Type(),
			new ClassyJS.Registry.Member(new ClassyJS.Registry.Type(), new ClassyJS.TypeChecker()),
			new ClassyJS.NamespaceManager()
		);
		parentClassObject = new ClassyJS.Type.Class(
			new ClassyJS.Type.Class.Definition('class MyClass'),
			new ClassyJS.Registry.Type(),
			new ClassyJS.Registry.Member(new ClassyJS.Registry.Type(), new ClassyJS.TypeChecker()),
			new ClassyJS.NamespaceManager()
		);
		grandParentClassObject = new ClassyJS.Type.Class(
			new ClassyJS.Type.Class.Definition('class MyClass'),
			new ClassyJS.Registry.Type(),
			new ClassyJS.Registry.Member(new ClassyJS.Registry.Type(), new ClassyJS.TypeChecker()),
			new ClassyJS.NamespaceManager()
		);
		interfaceObject = new ClassyJS.Type.Interface();
		interfaceObject2 = new ClassyJS.Type.Interface();
		registry = new ClassyJS.Registry.Type();
	});
	
	it('can be instantiated', function(){
		var registry = new ClassyJS.Registry.Type();
		expect(registry instanceof ClassyJS.Registry.Type).toBe(true);
	});
	
	it('can register class constructor against class object', function(){
		registry.registerClass(classObject, classConstructor);
	});
	
	it('throws error if non class object is registered', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal(
			'NON_CLASS_OBJECT_PROVIDED',
			'Provided type: object'
		);
		expect(function(){ registry.registerClass({}, classConstructor); }).toThrow(expectedFatal);
	});
	
	it('throws error if non function is registered as constructor', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal(
			'NON_CLASS_CONSTRUCTOR_PROVIDED',
			'Provided type: object'
		);
		expect(function(){ registry.registerClass(classObject, {}); }).toThrow(expectedFatal);
	});
	
	it('throws error if class is re-registered', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal('CLASS_ALREADY_REGISTERED');
		registry.registerClass(classObject, classConstructor);
		expect(function(){
			registry.registerClass(classObject, classConstructor);
		}).toThrow(expectedFatal);
	});
	
	it('returns registered class object from class constructor', function(){
		registry.registerClass(classObject, classConstructor);
		expect(registry.getClass(classConstructor)).toBe(classObject);
	});
	
	it('returns registered class object from class instance', function(){
		registry.registerClass(classObject, classConstructor);
		expect(registry.getClass(new classConstructor())).toBe(classObject);
	});
	
	it('throws error if getClass is called with non object or function', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal(
			'INVALID_CLASS_LOOKUP',
			'Provided type: string'
		);
		registry.registerClass(classObject, classConstructor);
		expect(function(){ registry.getClass('string'); }).toThrow(expectedFatal);
	});
	
	it('throws error if getClass is called with unregistered constructor', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal('CLASS_NOT_REGISTERED');
		expect(function(){ registry.getClass(classConstructor); }).toThrow(expectedFatal);
	});
	
	it('throws error if getClass is called with unregistered constructor instance', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal('CLASS_NOT_REGISTERED');
		expect(function(){ registry.getClass(new classConstructor()); }).toThrow(expectedFatal);
	});
	
	it('can register class object as child of other class object', function(){
		registry.registerClass(classObject, classConstructor);
		registry.registerClass(parentClassObject, parentClassConstructor);
		registry.registerClassChild(parentClassObject, classObject);
	});
	
	it('throws error if parent class object is non class object', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal(
			'NON_CLASS_OBJECT_PROVIDED',
			'Provided type: object'
		);
		expect(function(){
			registry.registerClassChild({}, classObject);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if child class object is non class object', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal(
			'NON_CLASS_OBJECT_PROVIDED',
			'Provided type: object'
		);
		expect(function(){
			registry.registerClassChild(parentClassObject, {});
		}).toThrow(expectedFatal);
	});
	
	it('throws error if parent class object is not already registered', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal('PARENT_CLASS_NOT_REGISTERED');
		registry.registerClass(classObject, classConstructor);
		expect(function(){
			registry.registerClassChild(parentClassObject, classObject);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if parent class object is not already registered', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal('CHILD_CLASS_NOT_REGISTERED');
		registry.registerClass(parentClassObject, parentClassConstructor);
		expect(function(){
			registry.registerClassChild(parentClassObject, classObject);
		}).toThrow(expectedFatal);
	});
	
	it('indicates when class object has parent', function(){
		registry.registerClass(classObject, classConstructor);
		registry.registerClass(parentClassObject, parentClassConstructor);
		registry.registerClassChild(parentClassObject, classObject);
		expect(registry.hasParent(classObject)).toBe(true);
	});
	
	it('indicates when class object does not have parent', function(){
		registry.registerClass(classObject, classConstructor);
		registry.registerClass(parentClassObject, parentClassConstructor);
		expect(registry.hasParent(classObject)).toBe(false);
	});
	
	it('indicates when class constructor has parent', function(){
		registry.registerClass(classObject, classConstructor);
		registry.registerClass(parentClassObject, parentClassConstructor);
		registry.registerClassChild(parentClassObject, classObject);
		expect(registry.hasParent(classConstructor)).toBe(true);
	});
	
	it('indicates when class constructor does not have parent', function(){
		registry.registerClass(classObject, classConstructor);
		registry.registerClass(parentClassObject, parentClassConstructor);
		expect(registry.hasParent(classConstructor)).toBe(false);
	});
	
	it('throws error when non registered class object is provided to hasParent', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal('CLASS_NOT_REGISTERED');
		expect(function(){
			registry.hasParent(classObject);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if getParent is called on object with no parent', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal('NON_EXISTENT_PARENT_REQUESTED');
		registry.registerClass(classObject, classConstructor);
		expect(function(){
			registry.getParent(classObject);
		}).toThrow(expectedFatal);
	});
	
	it('throws error when non registered class constructor is provided to hasParent', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal('CLASS_NOT_REGISTERED');
		expect(function(){
			registry.hasParent(classConstructor);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if getParent is called on constructor with no parent', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal('NON_EXISTENT_PARENT_REQUESTED');
		registry.registerClass(classObject, classConstructor);
		expect(function(){
			registry.getParent(classConstructor);
		}).toThrow(expectedFatal);
	});
	
	it('returns parent class object', function(){
		registry.registerClass(classObject, classConstructor);
		registry.registerClass(parentClassObject, parentClassConstructor);
		registry.registerClassChild(parentClassObject, classObject);
		expect(registry.getParent(classObject)).toBe(parentClassObject);
	});
	
	it('returns multiple levels of parenthood objects', function(){
		registry.registerClass(classObject, classConstructor);
		registry.registerClass(parentClassObject, parentClassConstructor);
		registry.registerClass(grandParentClassObject, grandParentClassConstructor);
		registry.registerClassChild(parentClassObject, classObject);
		registry.registerClassChild(grandParentClassObject, parentClassObject);
		expect(registry.getParent(registry.getParent(classObject))).toBe(grandParentClassObject);
	});
	
	it('returns parent class constructor', function(){
		registry.registerClass(classObject, classConstructor);
		registry.registerClass(parentClassObject, parentClassConstructor);
		registry.registerClassChild(parentClassObject, classObject);
		registry.getParent(classConstructor);
		expect(registry.getParent(classConstructor)).toBe(parentClassConstructor);
	});
	
	it('returns multiple levels of parenthood constructors', function(){
		registry.registerClass(classObject, classConstructor);
		registry.registerClass(parentClassObject, parentClassConstructor);
		registry.registerClass(grandParentClassObject, grandParentClassConstructor);
		registry.registerClassChild(parentClassObject, classObject);
		registry.registerClassChild(grandParentClassObject, parentClassObject);
		expect(registry.getParent(
			registry.getParent(classConstructor)
		)).toBe(grandParentClassConstructor);
	});
	
	// @todo Interface stuff
	
	it('can register class instance', function(){
		registry.registerClass(classObject, classConstructor);
		registry.registerClass(parentClassObject, parentClassConstructor);
		registry.registerClassChild(parentClassObject, classObject);
		registry.registerClassInstance([
			new classConstructor(),
			new parentClassConstructor()
		]);
	});
	
	it('throws error if non array is registered as class instance', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal(
			'NON_ARRAY_CLASS_INSTANCE_PROVIDED',
			'Provided type: object'
		);
		expect(function(){
			registry.registerClassInstance(new classConstructor());
		}).toThrow(expectedFatal);
	});
	
	it('throws error if single instance of registered class is registered', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal('SINGLE_CLASS_INSTANCE_PROVIDED');
		registry.registerClass(classObject, classConstructor);
		expect(function(){
			registry.registerClassInstance([new classConstructor()]);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if array containing non object is registered as class instance', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal(
			'NON_OBJECT_CLASS_INSTANCE_PROVIDED',
			'Provided type: string'
		);
		registry.registerClass(classObject, classConstructor);
		expect(function(){
			registry.registerClassInstance([new classConstructor(), 'non object']);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if class instance contains instance of an unregistered class', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal('CLASS_NOT_REGISTERED');
		registry.registerClass(classObject, classConstructor);
		expect(function(){
			registry.registerClassInstance([new classConstructor(), new parentClassConstructor()]);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if class instance array does not correspond with class hierarchy', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal(
			'INVALID_CLASS_HIERARCHY_INSTANCE_REGISTERED'
		);
		registry.registerClass(classObject, classConstructor);
		registry.registerClass(parentClassObject, parentClassConstructor);
		registry.registerClass(grandParentClassObject, grandParentClassConstructor);
		registry.registerClassChild(parentClassObject, classObject);
		expect(function(){
			registry.registerClassInstance([
				new classConstructor(),
				new grandParentClassConstructor()
			]);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if class instance array is incomplete class hierarchy', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal(
			'INCOMPLETE_CLASS_HIERARCHY_INSTANCE_REGISTERED'
		);
		registry.registerClass(classObject, classConstructor);
		registry.registerClass(parentClassObject, parentClassConstructor);
		registry.registerClass(grandParentClassObject, grandParentClassConstructor);
		registry.registerClassChild(parentClassObject, classObject);
		registry.registerClassChild(grandParentClassObject, parentClassObject);
		expect(function(){
			registry.registerClassInstance([new classConstructor(), new parentClassConstructor()]);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if class instance array contains more than class hierarchy', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal(
			'INVALID_CLASS_HIERARCHY_INSTANCE_REGISTERED'
		);
		registry.registerClass(classObject, classConstructor);
		registry.registerClass(parentClassObject, parentClassConstructor);
		registry.registerClass(grandParentClassObject, grandParentClassConstructor);
		registry.registerClassChild(parentClassObject, classObject);
		expect(function(){
			registry.registerClassInstance([
				new classConstructor(),
				new parentClassConstructor(),
				new grandParentClassConstructor()
			]);
		}).toThrow(expectedFatal);
	});
	
	it('throws error if class instance is already registered', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal('CLASS_INSTANCE_ALREADY_REGISTERED');
		var classInstance = [
			new classConstructor(),
			new parentClassConstructor()
		];
		registry.registerClass(classObject, classConstructor);
		registry.registerClass(parentClassObject, parentClassConstructor);
		registry.registerClassChild(parentClassObject, classObject);
		registry.registerClassInstance(classInstance);
		expect(function(){ registry.registerClassInstance(classInstance); }).toThrow(expectedFatal);
	});
	
	it('indicates when class instance has parent', function(){
		var classInstance = [new classConstructor(), new parentClassConstructor()];
		registry.registerClass(classObject, classConstructor);
		registry.registerClass(parentClassObject, parentClassConstructor);
		registry.registerClassChild(parentClassObject, classObject);
		registry.registerClassInstance(classInstance);
		expect(registry.hasParent(classInstance[0])).toBe(true);
	});
	
	it('indicates when class instance does not have parent', function(){
		registry.registerClass(classObject, classConstructor);
		registry.registerClass(parentClassObject, parentClassConstructor);
		expect(registry.hasParent(new classConstructor())).toBe(false);
	});
	
	it('indicates oldest generation class instance has no parent', function(){
		var classInstance = [
			new classConstructor(),
			new parentClassConstructor(),
			new grandParentClassConstructor()
		];
		registry.registerClass(classObject, classConstructor);
		registry.registerClass(parentClassObject, parentClassConstructor);
		registry.registerClass(grandParentClassObject, grandParentClassConstructor);
		registry.registerClassChild(parentClassObject, classObject);
		registry.registerClassChild(grandParentClassObject, parentClassObject);
		registry.registerClassInstance(classInstance);
		expect(registry.hasParent(classInstance[0])).toBe(true);
		expect(registry.hasParent(classInstance[1])).toBe(true);
		expect(registry.hasParent(classInstance[2])).toBe(false);
	});
	
	it('throws error if getParent is called on instance with no parent', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal('NON_EXISTENT_PARENT_REQUESTED');
		registry.registerClass(classObject, classConstructor);
		registry.registerClass(parentClassObject, parentClassConstructor);
		expect(function(){
			registry.getParent(new classConstructor());
		}).toThrow(expectedFatal);
	});
	
	it('returns parent class instance', function(){
		var classInstance = [new classConstructor(), new parentClassConstructor()];
		registry.registerClass(classObject, classConstructor);
		registry.registerClass(parentClassObject, parentClassConstructor);
		registry.registerClassChild(parentClassObject, classObject);
		registry.registerClassInstance(classInstance);
		expect(registry.getParent(classInstance[0])).toBe(classInstance[1]);
	});
	
	it('returns multiple levels of parenthood instances', function(){
		var classInstance = [
			new classConstructor(),
			new parentClassConstructor(),
			new grandParentClassConstructor()
		];
		registry.registerClass(classObject, classConstructor);
		registry.registerClass(parentClassObject, parentClassConstructor);
		registry.registerClass(grandParentClassObject, grandParentClassConstructor);
		registry.registerClassChild(parentClassObject, classObject);
		registry.registerClassChild(grandParentClassObject, parentClassObject);
		registry.registerClassInstance(classInstance);
		expect(registry.getParent(registry.getParent(classInstance[0]))).toBe(classInstance[2]);
	});
	
	it('throws error when non class, constructor or instance is provided to hasParent', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal(
			'NON_CLASS_CONSTRUCTOR_OR_INSTANCE_PROVIDED',
			'Provided type: string'
		);
		expect(function(){
			registry.hasParent('string');
		}).toThrow(expectedFatal);
	});
	
	it('throws error when non class, constructor or instance is provided to getParent', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal(
			'NON_CLASS_CONSTRUCTOR_OR_INSTANCE_PROVIDED',
			'Provided type: number'
		);
		expect(function(){
			registry.hasParent(123);
		}).toThrow(expectedFatal);
	});
	
	it('will return instantiated class instance', function(){
		var classInstance = [
			new classConstructor(),
			new parentClassConstructor(),
			new grandParentClassConstructor()
		];
		registry.registerClass(classObject, classConstructor);
		registry.registerClass(parentClassObject, parentClassConstructor);
		registry.registerClass(grandParentClassObject, grandParentClassConstructor);
		registry.registerClassChild(parentClassObject, classObject);
		registry.registerClassChild(grandParentClassObject, parentClassObject);
		registry.registerClassInstance(classInstance);
		expect(registry.getInstantiatedInstance(classInstance[0])).toBe(classInstance[0]);
		expect(registry.getInstantiatedInstance(classInstance[1])).toBe(classInstance[0]);
		expect(registry.getInstantiatedInstance(classInstance[2])).toBe(classInstance[0]);
	});
	
	it('will return instance if no parent is registered at getInstantiatedInstance', function(){
		var instance = new classConstructor();
		registry.registerClass(classObject, classConstructor);
		expect(registry.getInstantiatedInstance(instance)).toBe(instance);
	});
	
	it('will throw error if non object is provided to getInstantiatedInstance', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal(
			'NON_CLASS_INSTANCE_PROVIDED',
			'Provided type: function'
		);
		expect(function(){
			registry.getInstantiatedInstance(classConstructor);
		}).toThrow(expectedFatal);
	});
	
	it('will throw if instance of non registered class to getInstantiatedInstance', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal('CLASS_NOT_REGISTERED');
		expect(function(){
			registry.getInstantiatedInstance(new classConstructor());
		}).toThrow(expectedFatal);
	});
	
	it('can register interface against class object', function(){
		registry.registerClass(classObject, classConstructor);
		registry.registerInterfaceAgainstClass(interfaceObject, classObject);
	});
	
	it('will throw error if non interface is provided to registerInterfaceAgainstClass', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal(
			'NON_INTERFACE_OBJECT_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			registry.registerInterfaceAgainstClass(undefined, classObject);
		}).toThrow(expectedFatal);
	});
	
	it('will throw error if non class is provided to registerInterfaceAgainstClass', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal(
			'NON_CLASS_OBJECT_PROVIDED',
			'Provided type: object'
		);
		expect(function(){
			registry.registerInterfaceAgainstClass(interfaceObject, {});
		}).toThrow(expectedFatal);
	});
	
	it('can register multiple interfaces against class object', function(){
		registry.registerClass(classObject, classConstructor);
		registry.registerInterfaceAgainstClass(interfaceObject, classObject);
		registry.registerInterfaceAgainstClass(interfaceObject2, classObject);
	});
	
	it('can return array of interfaces for specified class', function(){
		registry.registerClass(classObject, classConstructor);
		registry.registerInterfaceAgainstClass(interfaceObject, classObject);
		registry.registerInterfaceAgainstClass(interfaceObject2, classObject);
		expect(registry.getInterfacesFromClass(classObject)).toEqual([interfaceObject, interfaceObject2]);
	});
	
	it('will throw error if non class object is provided to getInterface', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal(
			'NON_CLASS_OBJECT_PROVIDED',
			'Provided type: undefined'
		);
		expect(function(){
			registry.getInterfacesFromClass();
		}).toThrow(expectedFatal);
	});
	
	it('will return empty array of interfaces if non have been registered', function(){
		registry.registerClass(classObject, classConstructor);
		expect(registry.getInterfacesFromClass(classObject)).toEqual([]);
	});
	
	it('will throw error if class provided to register interface does not exist', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal('CLASS_NOT_REGISTERED');
		expect(function(){
			registry.registerInterfaceAgainstClass(interfaceObject, classObject);
		}).toThrow(expectedFatal);
	});
	
	it('will throw error if class provided to retrieve interfaces does not exist', function(){
		var expectedFatal = new ClassyJS.Registry.Type.Fatal('CLASS_NOT_REGISTERED');
		expect(function(){
			registry.getInterfacesFromClass(classObject);
		}).toThrow(expectedFatal);
	});
	
});
