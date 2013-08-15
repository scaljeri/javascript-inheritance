javascript-inheritance
======================

JavaScript helper functions for Classical and Prototypal Inheritance

example:

  var Base = Object.$augment( function() { // create closure
        var message = '' ;
        return  {
                initialize: function(msg, total) {
                        message = msg ;
                        this.total = total
                }
                , getMessage: function() {
                        return  message ;
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
        initialize: function initialize(msg) {
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
        initialize: function initialize(msg) {
                this.$super(msg) ;
        }
        , getMessage: function getMessage() {
                return 'Foo ' + this.$super() ;
        }
        , add: function add(value) {
                this.$super(value) ;
        }
    }) ;

    var foo = Foo.$new('Inheritance') ;
    console.log(foo.total) ; // --> 100 ;
    console.log(foo.getTotal()) ; // --> 110 ;
    console.log(foo.getMessage()) ; // --> Foo Inheritance ;
