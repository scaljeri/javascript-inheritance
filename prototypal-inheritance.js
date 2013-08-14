if (  Object.prototype.$augment === undefined ) {
    Object.defineProperty(Object.prototype, '$augment', {
        value:  function(proto) {
            var newObj = Object.create(this) ;
            Object.defineProperty(newObj, {
                '$_stack': {
                    value: [newObj]
                    , enumerable: false
                    , configurable: false
                    , writable: false
                }
            }) ;
            for( var p in proto ) {
                if ( proto.hasOwnProperty(p)) {
                    newObj[p] = proto[p] ;
                }
            }
            return newObj ;
        }
        , configurable: false
        , writable: false
    }) ;
    Object.prototype.$new = function() {
        var newObj = Object.create(this) ;
        newObj.constructor.apply(newObj, arguments) ;
        return newObj ;
    } ;

    Object.prototype.$super = function() {
        var proto = Object.getPrototypeOf(this.$_stack[this.$_stack.length-1]) ;
        this.$_stack.push(proto) ;
        var result = proto[arguments.callee.caller.name].apply(this, arguments) ;
        this.$_stack.pop() ;
        return result ;
    } ;
}