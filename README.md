javascript-inheritance
======================

JavaScript helper functions for Classical and Prototypal Inheritance

example:

    var Base = Object.$augment( function() {
        var message = '' ;
        return  {
        	constructor: function(msg, total) {
        		message = msg ;
        		this.total = total
			}
			, getMessage: function() {
				return 	message ;
			}
			, getTotal: function() {
				return this.total ;
			}
			, add: function(value) {
				this.total += value ;
			}
		} ;
    }) ;

    var Bar = Base.$augment( {
    	constructor: function constructor(msg) {
    		this.$super(msg, 10) ;
    	}
    	, getTotal: function getTotal() {
    		return 10 + this.$super() ;
    	}
    	, add: function add(value) {
    		this.$super(2*value) ;
    	}
    }) ;

    var Foo = Bar.$augment( {
    	constructor: function constructor(msg) {
    		this.$super(msg, 100) ;
    	}
    	, getMessage: function getMessage() {
    		return 'Foo ' + this.$super() ;
    	}
    	, add: function add(value) {
    		this.$super(value) ;
    	}
    }) ;

	var foo = Foo.$new('Inheritance') ;
    foo.total ; // --> 100 ;
    foo.getTotal() ; // --> 110 ;
    foo.getMessage() ; // --> Foo Inheritance ;
