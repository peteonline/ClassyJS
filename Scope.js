;(function(undefined){
	
	Class.Scope = function(level){
		
		if (level != Class.Scope.PUBLIC
		&& level != Class.Scope.PROTECTED
		&& level != Class.Scope.PRIVATE) {
			throw new Error('Invalid scope declaration');
		}
		
		this.level = level;
		
	};
	
	// Declare our levels numerically
	Class.Scope.PUBLIC	  =  1;
	Class.Scope.PROTECTED =  0;
	Class.Scope.PRIVATE	  = -1;
	
	Class.Scope.prototype.checkCallingObject = function(object){
		switch (this.level) {
			case Class.Scope.PUBLIC:
				return true;
				break;
			case Class.Scope.PROTECTED:
				object = object || {};
				if (this.parent instanceof Class.Method) {
					if (this.parent.parentType.id != object.id) {
						throw new ScopeFatal('Cannot access protected method');
					}
				} else {
					if (this.parent.parent.id != object.id) {
						throw new ScopeFatal('Cannot access protected property');
					}
				}
				break;
			case Class.Scope.PRIVATE:
				if (this.parent instanceof Class.Method) {
					if (this.parent.parentType != object) {
						throw new ScopeFatal('Cannot access private property');
					}
				} else {
					if (this.parent.parent.type != object) {
						throw new ScopeFatal('Cannot access private property');
					}
				}
		} 
	}
	
	Class.Scope.prototype.checkCallingFunction = function(callingFunction){
		return this.checkCallingObject(callingFunction.parentType);
	}
	
})();