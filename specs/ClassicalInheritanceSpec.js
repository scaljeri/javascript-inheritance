describe('Javascript Classical Inheritance', function () {

    // setup classes/prototypes
    var Base = Object.$augment((function () { // create closure around constructor
            var value = 0;

            function Base(input) { // create closure
                value = input;
                this.name = 'Base';
            }

            Base.prototype.getValue = function () {
                return this.multi * value;
            } ;
            return Base;
        })(), {
                toString: function () {
                    return this.name ;
                }, multi: 1
            }
        ) ;
        var Bar = Base.$augment(function Bar(input) {
            this.$super(input);
            this.name = 'Bar';
        }, { multi: 2 }) ;
        var Foo = Bar.$augment(function (input) {
            this.$super(input);
            this.name = 'Foo';
        }, {
            getValue: function () {
                return this.multi * this.$super();
            }, multi: 3
        }, true)
        , foo, bar;

    beforeEach(function () {
        bar = new Bar(10);
        foo = Foo.$new(100);
    });

    it('should create new instances using Foo', function () {
        expect(Base).toBeDefined();
        expect(Bar).toBeDefined();
        expect(Foo).toBeDefined();
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
    it('should throw an exception if overriden method does not exist', function(){
        Foo.prototype.newFunc = function(){ this.$super(); } ;
        expect(foo.newFunc.bind(foo)).toThrow('No overridden method for "newFunc"') ;
    })
});
