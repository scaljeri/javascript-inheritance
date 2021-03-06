describe('Javascript Prototypal Inheritance', function () {

    // setup prototypes
    var Base = (function () { // create closure
            var value = 0;
            return {
                constructor: function (input) {
                    value = input;
                    this.name = 'Base';
                }, getValue: function () {
                    return this.multi * value;
                }, toString: function () {
                    return this.name ;
                }
                , multi: 1
            } ;
        })()
        , Bar = Base.$augment({
            constructor: function (input) {
                this.$super(input);
                this.name = 'Bar';
            }
            , multi: 2
        })
        , Foo = Bar.$augment({
            constructor: function (input) {
                this.$super(input);
                this.name = 'Foo';
            }
            , getValue: function () {
                return this.multi * this.$super();
            }
            , newFunc: function () { this.$super();}
            , multi: 3
        })
        , bar, foo;

    beforeEach(function () {
        foo = Foo.$new(100);
        bar = Bar.$new(100);
    });

    it('should create new instances', function () {
        expect(Base).toBeDefined();
        expect(Bar).toBeDefined();
        expect(Foo).toBeDefined();
        expect(foo).toBeDefined();
        expect(bar).toBeDefined();
    });
    it('should create instance with a correct prototype chain', function(){
        var proto = Object.getPrototypeOf(foo) ;
        expect(proto).toBe(Foo);
        proto = Object.getPrototypeOf(proto) ;
        expect(proto).toBe(Bar);
        proto = Object.getPrototypeOf(proto) ;
        expect(proto).toBe(Base);
        proto = Object.getPrototypeOf(proto) ;
        expect(proto).toBe(Object.prototype);
        proto = Object.getPrototypeOf(proto) ;
        expect(proto).toBeNull() ;
    }) ;
    it('should create instances with correct properties', function() {
        expect(foo.name).toEqual('Foo');
        expect(bar.name).toEqual('Bar');
        expect(foo.multi).toEqual(3) ;
        expect(bar.multi).toEqual(2) ;
        expect(bar.toString()).toEqual('Bar') ;
        expect(foo.toString()).toEqual('Foo') ;
        expect(bar.getValue()).toEqual(200) ;
        expect(foo.getValue()).toEqual(900) ;
    }) ;
    it('should throw an exception if overriden method does not exist', function(){
        expect(foo.newFunc.bind(foo)).toThrow('No overridden method for "newFunc"') ;
    }) ;
});
