if (Object.prototype.$augment === undefined) {
    Object.defineProperties(Object.prototype, {
        '$augment': {
            value: function (proto) {
                var newObj = Object.create(this);
                Object.defineProperty(newObj, '$_proto_', {
                    value: [newObj], enumerable: false
                });
                for (var p in proto) {
                    if (proto.hasOwnProperty(p)) {
                        newObj[p] = proto[p];
                    }
                }
                return newObj;
            }
        }, '$new': {
            value: function () {
                var newObj = Object.create(this);
                newObj.constructor.apply(newObj, arguments);
                return newObj;
            }
        }, '$super': {
            value: function () {
                if ( arguments.callee.caller.name === "" ) {
                    console.error("this.$super cannot be used in an anonymouse function!") ;
                }
                else {
                    var _proto_ = Object.getPrototypeOf(this.$_proto_) ;
                    while( _proto_ !== null && !_proto_.hasOwnProperty(arguments.callee.caller.name) ){
                       _proto_ = Object.getPrototypeOf(_proto_) ;
                    }

                    if ( _proto_ ) {
                        this.$_proto_ = _proto_ ;
                        return _proto_[arguments.callee.caller.name].apply(this, arguments);
                    }
                }
            }
        }
    });
}