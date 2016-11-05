var chai = require('chai');
var expect = chai.expect;

var Methods = require('./../../crip/Methods');

describe('Methods', function () {

    it('constructor() should set config as public property', function () {
        var methods = new Methods('', 'config instance');

        expect(methods).to.have.property('config', 'config instance');
    });

    describe('#define', function () {

        it('should set property with object fn value', function () {
            var methods = new Methods('config instance');

            function TaskConstructor() { }
            TaskConstructor.prototype.fn = 'object-value';

            methods.define('property-name', TaskConstructor);

            expect(methods).to.have.property('property-name', 'object-value');
        });

        it('should rise error if method already defined', function () {
            var methods = new Methods('config instance');
            var delegate = function () {
                methods.define('config');
            };

            expect(delegate).to.throw(Error);
        });

        it('should rise error if method definition is not set', function () {
            var methods = new Methods('config instance');
            function TaskConstructor() { }
            var delegate = function () {
                methods.define('test', TaskConstructor);
            };

            expect(delegate).to.throw(Error);
        });

    });

    describe('#addDefault', function () {

        it('should add string in to _beforeDefault array', function () {
            var cripWeb = { _beforeDefault: new Array() };
            var methods = new Methods('gulp', 'config', 'task', cripWeb);

            methods.addDefault('task-name');

            expect(cripWeb._beforeDefault.length).to.equal(1);
            expect(cripWeb._beforeDefault[0]).to.equal('task-name');
        });

        it('should join arrays', function () {
            var cripWeb = { _beforeDefault: new Array('existing') };
            var methods = new Methods('gulp', 'config', 'task', cripWeb);

            methods.addDefault('task-name');

            expect(cripWeb._beforeDefault.length).to.equal(2);
            expect(cripWeb._beforeDefault[0]).to.equal('existing');
            expect(cripWeb._beforeDefault[1]).to.equal('task-name');
        });

    });
});