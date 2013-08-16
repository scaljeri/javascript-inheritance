(function () {
    if (Object.prototype.$augment === undefined) {
        Object.defineProperties(Object.prototype, {
            '$augment': {
                value: function (proto) {
                    proto = proto ? proto.apply ? proto() : proto : {}; // check input

                    var newProto = Object.create(this);
                    Object.defineProperties(newProto, {
                          '$_proto_': { value: newProto, enumerable: false, writable: true }
                        , '$_name_': { value: null, enumerable: false, writable: true}
                    });

                    for (var p in proto) { // no proto.hasOwnProperty, copy all properties!
                        newProto[p] = proto[p];
                    }
                    return newProto;
                }
            }, '$new': {
                value: function () {
                    var newObj = Object.create(this);
                    newObj.initialize.apply(newObj, arguments);
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
