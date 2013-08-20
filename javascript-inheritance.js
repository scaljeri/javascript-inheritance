(function () {
    if (Object.prototype.$augment === undefined) {
        Object.defineProperties(Object.prototype, {
            '$augment': {
                value: function (constructor, proto, preserve) {
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
                    var _proto_, caller = arguments.callee.caller;
                    if (!this.$_name_) { // determine the overridden function name only the first time
                        this.$_name_ = determineOverriddenFuncName(this, caller);
                    }

                    if ((_proto_ = traversePrototypeChain(this, caller))) { // found overridden method?
                        this.$_proto_ = _proto_;
                        var val = _proto_[this.$_name_].apply(this, arguments);

                        // done, reset values
                        this.$_proto_ = Object.getPrototypeOf(this);
                        this.$_name_ = null;

                        return val;
                    }
                    else {
                        throw 'No overridden method for "' + this.$_name_ + '"';
                    }
                }
            }
        });
    }

    /* *** PRIVATE FUNCTIONS *** */
    function setProperties(obj, proto) {
        Object.defineProperties(obj, {
            '$_proto_': { value: obj, enumerable: false, writable: true }
            , '$_name_' : { value: null, enumerable: false, writable: true}
        });

        for (var p in proto) { // no proto.hasOwnProperty, copy all properties!
            obj[p] = proto[p];
        }
    }
    function buildConstructor(child, proto, preserve) {
        var prop, prototype = child.prototype, parent = this ;

        if ( (Object.prototype.toString.call(proto).slice(8, -1) === 'Boolean' && proto === true || preserve === true) ) {
            child = (new Function( 'base', 'return function ' + child.name + '(){ base.apply(this, arguments); };'))(child) ;
        }

        child.prototype = new parent() ;

        for( prop in prototype ) {
            child.prototype[prop] = prototype[prop];
        }
        for( prop in proto) {
            child.prototype[prop] = proto[prop];
        }
        child.prototype.constructor = child ;                // fix instanceof
        return child ;
    }

    function determineOverriddenFuncName(obj, caller) {
        var retval, index = -1 ;
        if ( !caller || caller === obj.constructor) {
           retval = 'constructor' ;
        }
        else {
            retval = caller.name ||  findFunctionInObject(obj.$_proto_, caller) ;
        }
        return retval;
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
