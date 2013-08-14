/*
 * Add this code to enable easy to use classical inheritance. Example
 *
 * Bar = (function($) {
 *     var msg ; // private variable
 *     function Bar(input) { msg = input };
 *
 *     Bar.prototype.toString = function(){ return this.constructor.name; };
 *     Bar.prototype.getMsg = function() {
 *         return msg ;
 *     }
 *     return Bar ;
 * })(jQuery) ; // list of external dependencies
 *
 * var Foo = (function() {
 *     function Foo(input) {
 *         this.$super(input); // call parent constructor
 *     }
 *     Foo.prototype.getMsg = function getMsg() {
 *         return 'Foo\'s ' + this.$super() ; // call overridden 'getMsg' function
 *     }
 *
 *     return Foo;
 * })().$extends(Bar); // extend Bar
 *
 * For the $super magic to work it is important to use named function ( checkout the getMsg function of Foo )
 *
 * The $extends method excepts three parameters, with 'proto' and 'doNew' being optional.
 *    * proto - define additional prototype properties
 *    * create a new constructor without altering the current constructor, for example
 *
 *        function Bar(){}
 *        function Foo(){}
 *        var Foo1 = Foo.$extends(Bar, true) ;
 *
 *      This way Foo is extended, but is not altered, and the result is returned
 *
 *
 */
/* Inheritance helper functions */
if (typeof Object.$super !== "function") {
    Object.defineProperty(Object.prototype, '$super', {
        value: function () {
            var parentProto
                , caller = arguments.callee.caller ; // is the function in which $super is called

            if ( !this.$_deep ) this.$_deep = [] ;                  // create inheritance stack
            var length = this.$_deep.length ;

            parentProto = Object.getPrototypeOf(
                length === 0 ?  Object.getPrototypeOf(this) : this.$_deep[length-1]
            ) ;

            // keep track of position in the inheritance stack
            this.$_deep.push(parentProto) ;                         // add parent to stack

            var result = (this.constructor.$_parents[caller.name] ?
                this.constructor.$_parents :                    // call parent constructor
                parentProto                                     // call parent method
                )[caller.name].apply(this, arguments);
            this.$_deep.pop() ;                                     // remove parent from stack
            return result ;
        },
        writable: false,
        enumerable: false,
        configurable: false
    });
}

if (typeof Function.$extends !== "function") {
    Object.defineProperty(Function.prototype, '$extends', {
        value: function (parent, proto, doNew) {
            var prop, prototype = this.prototype, constructor = this ;

            if ( (Object.prototype.toString.call(proto).slice(8, -1) === "Boolean" && proto === true) ||
                doNew === true ) {
                constructor = (new Function( 'base', 'return function ' + this.name + '(){ base.apply(this, arguments); };'))(this) ;
            }

            constructor.prototype = new parent() ;

            for( prop in prototype ) {
                constructor.prototype[prop] = prototype[prop];
            }
            if (proto) {
                for ( prop in proto) {
                    constructor.prototype[prop] = proto[prop];
                }
            }

            constructor.prototype.constructor = this;                // fix instanceof
            this.$_parents = parent.$_parents ||{} ;
            this.$_parents[constructor.name] = parent ;
            return constructor;
        }
    });
}
