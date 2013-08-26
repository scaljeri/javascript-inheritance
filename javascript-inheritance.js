(function (prototype, getPrototypeOf) {
    if (prototype.$augment === undefined) {
        Object.defineProperties(prototype, {
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
                    if ( isFunction(constructor) ) { // its a function - constructor
                       var newObj = buildConstructor.apply(this, arguments) ;
                    }
                    else {
                       newObj = Object.create(this) ;
                       setProperties(newObj, constructor) ; // constructor holds proto
                    }
                    return newObj;
                }
            }, '$new': {
                value: function () {
                    if ( isFunction(this) ) { // classical
                        var constructor = this, args = arguments ;
                        function Fake(){
                            constructor.apply(this, args) ;
                        }
                        Fake.prototype = this.prototype ;
                        newObj = new Fake() ;
                    }
                    else {  // prototypal
                        var newObj = Object.create(this);
                        newObj.constructor.apply(newObj, arguments);
                    }
                    return newObj;
                }
            }, '$super': {
                value: function () {
                    var retval, caller = arguments.callee.caller;
                    /* set the name of the function calling $super. Things to check are:
                        * if $super is called from inside an overridden method, _$n is already set.
                        * caller can be null inside a constructor
                        * caller.name can be null inside an anonymous function
                     */
                    this._$n || (
                            this._$n = ( (!caller || caller === this.constructor) ?
                                'constructor' :
                                caller.name || findFunctionInObject(this._$p, caller)
                            )
                        ) ;

                    // with the name the overridden method can be found somewhere in the prototype chain
                    if ((this._$p = traversePrototypeChain(this, caller))) { // found overridden method?
                        retval = this._$p[this._$n].apply(this, arguments);

                        // done, reset values
                        this._$p = getPrototypeOf(this);
                        this._$n = null;

                        return retval;
                    }
                    else { // $super was called and no overridden function was found in the prototype chain
                        throw 'No overridden method for "' + this._$n + '"';
                    }
                }
            }
        });
    }

    /* *** PRIVATE FUNCTIONS *** */
    function setProperties(obj, proto) {
        /* _$p --> holds the prototype object which contains the overridden method
           _$n --> the name of the overridden method
         */
        Object.defineProperties(obj, { // each instance will have these properties. They're used to call overridden methods
            '_$p': { value: obj, enumerable: false, writable: true }
            , '_$n' : { value: null, enumerable: false, writable: true}
        });

        for (var p in proto) {
            if ( proto.hasOwnProperty(p)) {
                obj[p] = proto[p];
            }
        }
    }
    /* with classical inheritance the constructor function's prototype is augmented with properties from its parent and
     * addition properties from 'proto'. Set 'preserve' to TRUE to leave the constructor as it is, and create a new
     * constructor instead.
     */
    function buildConstructor(child, proto, preserve) {
        var prop, cproto = child.prototype, dummy ;

        // check if preserve is TRUE (note that proto is optional and can hold the boolean value of 'preserve')
        if ( (proto === true || preserve === true) ) {
            child = (new Function( 'b', 'return function ' + child.name + '(){ b.apply(this, arguments); };'))(child) ;
        }

        dummy = new this() ;

        for( prop in cproto ) {
            if ( cproto.hasOwnProperty(prop) ) {
                dummy[prop] = cproto[prop];
            }
        }
        setProperties(dummy, proto) ;
        child.prototype = dummy ;
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
        var _proto_ = getPrototypeOf(obj._$p);
        while (_proto_ !== null && (!_proto_.hasOwnProperty(obj._$n) || _proto_[obj._$n] === caller)) {
            _proto_ = getPrototypeOf(_proto_); // go deeper
        }
        return _proto_;
    }

    function isFunction(obj) {
        return prototype.toString.call(obj).slice(8, -1) === 'Function' ;
    }
})(Object.prototype, Object.getPrototypeOf);
