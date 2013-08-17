(function () {
    if (Object.prototype.$augment === undefined) {
        Object.defineProperties(Object.prototype, {
            '$augment': {
                value: function (constructor, proto, preserve) {
                    var newProto = Object.create(this), type = 'prototypal' ;
                    if ( constructor.apply ) { // its a function - constructor
                       newProto = buildConstructor.apply(this, arguments) ;
                       type = 'classical' ;
                    }
                    else {
                       proto = constructor||{} ;
                    }

                    Object.defineProperties(newProto, {
                          '$_proto_': { value: newProto, enumerable: false, writable: true }
                        , '$_name_' : { value: null, enumerable: false, writable: true}
                        , '$_type'  : { value: type, enumerable: false }
                    });

                    for (var p in proto) { // no proto.hasOwnProperty, copy all properties!
                        newProto[p] = proto[p];
                    }
                    return newProto;
                }
            }, '$new': {
                value: function () {
                    var newObj ;
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
                    var caller = arguments.callee.caller;
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
                        throw "No overridden method for '" + this.$_name_ + "'";
                    }
                }
            }
        });
    }

    /* *** PRIVATE FUNCTIONS *** */
    function buildConstructor(constructor, proto, preserve) {
        var prop, prototype = this.prototype, constructor = this ;

        if ( (Object.prototype.toString.call(proto).slice(8, -1) === "Boolean" && proto === true || preserve === true) ) {
            constructor = (new Function( 'base', 'return function ' + constructor.name + '(){ base.apply(this, arguments); };'))(constructor) ;
        }

        constructor.prototype = new parent() ;
        for( prop in prototype ) {
            constructor.prototype[prop] = prototype[prop];
        }
        constructor.prototype.constructor = this;                // fix instanceof
        return constructor.prototype ;
    }

    function determineOverriddenFuncName(obj, caller) {
        var index = -1, retval = caller.name;
        if (!retval) {
            var properties = Object.getOwnPropertyNames(obj.$_proto_);
            while (obj.$_proto_[properties[++index]] !== caller) {
            } // this will always be successful!
            retval = properties[index]
        }
        return retval;
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
