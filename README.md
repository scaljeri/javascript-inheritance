javascript-inheritance
======================

JavaScript helper functions for Classical and Prototypal Inheritance [![Build Status](https://travis-ci.org/scaljeri/javascript-inheritance.png)](https://travis-ci.org/scaljeri/javascript-inheritance)

# Build #

    $> grunt build

this command creates a minified version of the library inside the build directory.

# Documentation #

TODO

# Examples #

Prototypal Inheritance example:

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

    bar = new Bar(10);
    foo = Foo.$new(100);


Classical Inheritance example:

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

     bar = new Bar(10);
     foo = Foo.$new(100);
