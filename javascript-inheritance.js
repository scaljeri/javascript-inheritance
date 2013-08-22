(function () {
    if (Object.prototype.$augment === undefined) {
        Object.defineProperties(Object.prototype, {
            '$augment': {
                /**
                 * The context of this function is the parent class, which is extended by 'constructor'. The
                 * constructor's value is a Function if classical inheritance is used and an Object if Prototypal
                 * inheritance applied.
                 *
                 * Classical:
                 *
                 *     Bar = function() {  } ;
                 *     Foo = Bar.$augment(function(){}) ;
                 *     foo = new Foo() ; // or
                 *     foo = Foo.$new() ;
                 *
                 * Prototypal:
                 *
                 *     Bar = { initialize: function(){} }
                 *     Foo = Bar.$augment({ initialize: function(){}}) ;
                 *     foo = Foo.$new() ;
                 *
                 * @param {Object|Function} constructor constructor function or object
                 * @param {Object} [proto={}] additional prototype properties
                 * @param {Boolean} [preserve=false] if true the constructor function is cloned (only for Classical inheritance) ;
                 * @returns {Object|Function} depending on Classical or Prototypal inheritance a Function or Object, resp. is returned
                 */
                value: function (constructor, proto) {
                    if ( constructor.apply ) { // its a function - constructor
                       var newObj = buildConstructor.apply(this, arguments) ;
                       setProperties(newObj.prototype,proto) ; // constructor holds proto
                    }
                    else {
                       newObj = Object.create(this) ;
                       setProperties(newObj, constructor) ; // constructor holds proto
                    }
                    return newObj;
                }
            }, '$new': {
                value: function () {
                    // determine if dealing with prototypal or classical inheritance
                    if ( Object.prototype.toString.call(this).slice(8, -1) === 'Object' ) { // prototypal
                        var newObj = Object.create(this);
                        newObj.initialize.apply(newObj, arguments);
                    }
                    else {  // classical
                        var constructor = this, args = arguments ;
                        function Fake(){
                            constructor.apply(this, args) ;
                        }
                        Fake.prototype = this.prototype ;
                        newObj = new Fake() ;
                    }
                    return newObj;
                }
            }, '$super': {
                value: function () {
                    var retval, caller = arguments.callee.caller;
                    /* set the name of the function calling $super. Things to check are:
                        * if $super is called from inside an overridden method, $_name_ is already set.
                        * caller can be null inside a constructor
                        * caller.name can be null inside an anonymous function
                     */
                    this.$_name_ || (
                            this.$_name_ = ( (!caller || caller === this.constructor) ?
                                'constructor' :
                                caller.name || findFunctionInObject(this.$_proto_, caller)
                            )
                        ) ;

                    // with the name the overridden method can be found somewhere in the prototype chain
                    if ((this.$_proto_ = traversePrototypeChain(this, caller))) { // found overridden method?
                        retval = this.$_proto_[this.$_name_].apply(this, arguments);

                        // done, reset values
                        this.$_proto_ = Object.getPrototypeOf(this);
                        this.$_name_ = null;

                        return retval;
                    }
                    else { // $super was called and no overridden function was found in the prototype chain
                        throw 'No overridden method for "' + this.$_name_ + '"';
                    }
                }
            }
        });
    }

    /* *** PRIVATE FUNCTIONS *** */
    function setProperties(obj, proto) {
        Object.defineProperties(obj, { // each instance will have these properties. They're used to call overridden methods
            '$_proto_': { value: obj, enumerable: false, writable: true }
            , '$_name_' : { value: null, enumerable: false, writable: true}
        });

        for (var p in proto) { // no proto.hasOwnProperty --> copy all properties!
            obj[p] = proto[p];
        }
    }
    /* with classical inheritance the constructor function's prototype is augmented with properties from its parent and
     * addition properties from 'proto'. Set 'preserve' to TRUE to leave the constructor as it is, and create a new
     * constructor instead.
     */
    function buildConstructor(child, proto, preserve) {
        var prop, prototype = child.prototype ;

        // check if preserve is TRUE (note that proto is optional and can hold the boolean value of 'preserve')
        if ( (proto === true || preserve === true) ) {
            child = (new Function( 'base', 'return function ' + child.name + '(){ base.apply(this, arguments); };'))(child) ;
        }

        child.prototype = new this() ;

        for( prop in prototype ) {
            child.prototype[prop] = prototype[prop];
        }
        for( prop in proto) {
            child.prototype[prop] = proto[prop];
        }
        child.prototype.constructor = child ;                // fix instanceof
        return child ;
    }

    function findFunctionInObject(obj, func) {
        var retval = 'constructor', properties = Object.getOwnPropertyNames(obj);
        for( var prop in properties) {
            if ( obj[properties[prop]] === func ){
                retval = properties[prop] ;
                break ;
            }
        }
        return retval ;
    }

    // find the overridden function by traversing the prototype chain
    function traversePrototypeChain(obj, caller) {
        var _proto_ = Object.getPrototypeOf(obj.$_proto_);
        while (_proto_ !== null && (!_proto_.hasOwnProperty(obj.$_name_) || _proto_[obj.$_name_] === caller)) {
            _proto_ = Object.getPrototypeOf(_proto_); // go deeper
        }
        return _proto_;
    }
})();
