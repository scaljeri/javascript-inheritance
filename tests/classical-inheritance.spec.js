describe('Javascript Classical Inheritance', function () {

    // setup classes/prototypes
    var baseProto = (function() { // closure, Module Pattern
        var value = 0;

        function Base(input) { // create closure
            value = input;
            this.name = 'Base';
        }

        Base.prototype.getValue = function () {
            return this.multi * value;
        } ;
        return Base ;
    })() ;
    var Base = Object.$augment( baseProto, {        // the third param is added to the prototype
                toString: function () {
                    return this.name ;
                }, multi: 1
            }
        )
        , Bar = Base.$augment(function Bar(input) {
            this.$super(input);
            this.name = 'Bar';
        }, { multi: 2 })                            // add multi param to the prototype

        , FooConstructor = function (input) {
            this.$super(input);
            this.name = 'Foo';
        }
        , Foo = Bar.$augment( FooConstructor, {     // extend Bar without changing FooConstructor
            getValue: function () {
                return this.multi * this.$super();
            }, multi: 3
        }, true)                                    // should be TRUE, otherwise the $augment will modify FooConstructor
        , foo, bar;

    beforeEach(function () {
        bar = new Bar(10);
        foo = Foo.$new(100);
    });

    it('should create new instances', function () {
        expect(Base).toBeDefined();
        expect(Bar).toBeDefined();
        expect(FooConstructor).toBeDefined();
        expect(Foo).toBeDefined();
        expect(Foo.prototype).not.toBe(FooConstructor.prototype) ; // constructor should be cloned, not referenced
        expect(Foo).not.toEqual(FooConstructor) ;
        expect(foo).toBeDefined();
        expect(bar).toBeDefined();

    });
    it('should create instance with a correct prototype chain', function () {
        expect(foo).toBeInstanceof(Foo);
        expect(foo).toBeInstanceof(Bar);
        expect(foo).toBeInstanceof(Base);
    });
    it('should create instances with correct properties', function () {
        expect(foo.name).toEqual('Foo');
        expect(bar.name).toEqual('Bar');
        expect(foo.multi).toEqual(3);
        expect(bar.multi).toEqual(2);
        expect(bar.toString()).toEqual('Bar');
        expect(foo.toString()).toEqual('Foo');
        expect(bar.getValue()).toEqual(200);
        expect(foo.getValue()).toEqual(900);
    });
    xit('should throw an exception if overriden method does not exist', function(){
        Foo.prototype.newFunc = function(){ this.$super(); } ;
        expect(foo.newFunc.bind(foo)).toThrow('No overridden method for "newFunc"') ;
    });
});
