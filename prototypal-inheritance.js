if (Object.prototype.$augment === undefined) {
    Object.defineProperties(Object.prototype, {
        '$augment': {
            value: function (proto) {
                var newObj = Object.create(this);
                Object.defineProperty(newObj, '$_stack', {
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
                var proto = Object.getPrototypeOf(this.$_stack[this.$_stack.length - 1]);
                if ( proto.hasOwnPoperty(arguments.callee.caller.name) ) {
                    this.$_stack.push(proto);
                    var result = proto[arguments.callee.caller.name].apply(this, arguments);
                    this.$_stack.pop();
                    return result;
                }
                else {
                   this.$super.apply(this, arguments) ;
                }
            }
        }
    });
}