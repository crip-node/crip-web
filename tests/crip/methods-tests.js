var chai = require('chai');
var expect = chai.expect;

var Methods = require('./../../crip/Methods');

describe('Methods', function () {

    it('constructor() should set config as public property', function () {
        var methods = new Methods('', 'config instance');

        expect(methods).to.have.property('config', 'config instance');
    });

    it('define() should set property with object fn value', function () {
        var methods = new Methods('config instance');
        
        function TaskConstructor() { }
        TaskConstructor.prototype.fn = 'object-value';

        methods.define('property-name', TaskConstructor);

        expect(methods).to.have.property('property-name', 'object-value');
    });

    it('define() should rise error if method already defined', function () {
        var methods = new Methods('config instance');
        var delegate = function () {
            methods.define('config');
        };

        expect(delegate).to.throw(Error);
    });

    it('define() should rise error if method definition is not set', function () {
        var methods = new Methods('config instance');
        function TaskConstructor() { }
        var delegate = function () {
            methods.define('test', TaskConstructor);
        };

        expect(delegate).to.throw(Error);
    });
});