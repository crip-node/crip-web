var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

chai.use(require('sinon-chai'));

var utils = require('./../../../crip/utils');
var Watch = require('./../../../crip/tasks/Watch');


describe('Watch', function () {

    beforeEach(function () {
        sinon.stub(utils, 'appendBase');
    })

    afterEach(function () {
        utils.appendBase.restore();
    })

    it('costructor() should define default methods', function () {

        var watch = new Watch('gulp', 'config', 'cripweb', 'registerTask');

        expect(watch).to.have.property('fn');
        expect(watch).to.have.property('configure');
        expect(watch).to.have.property('isInDefault');
    })

    describe('#fn', function () {

        it('should be a function', function () {
            var watch = new Watch('gulp', 'config', 'cripweb', 'registerTask');

            expect(watch.fn).to.be.a('function');
        })

        it('should get config base path', function () {
            var config = { get: sinon.spy() };
            var noop = function () { };
            var cripweb = { getPublicMethods: noop };
            var watch = new Watch('gulp', config, cripweb, noop);

            watch.fn('taskName', 'globs', 'deps');

            expect(config.get).to.have.been.calledOnce;
            expect(config.get.getCall(0)).to.have.been.calledWithExactly('watch.base');
        })

        it('should return cripweb getPublicMethods', function () {
            var config = { get: sinon.spy() };
            var noop = function () { };
            var cripweb = { getPublicMethods: sinon.stub().returns(123) };
            var watch = new Watch('gulp', config, cripweb, noop);

            var result = watch.fn('taskName', 'globs', 'deps');

            expect(result).to.be.equal(123);
        })

        it('should call utils.appendBase in default order', function () {
            var config = { get: sinon.spy() };
            var noop = function () { };
            var cripweb = { getPublicMethods: noop };
            var watch = new Watch('gulp', config, cripweb, noop);

            watch.fn('taskName', 'globs', 'deps', 'prependPath');

            expect(utils.appendBase).to.have.been.calledOnce;
            expect(utils.appendBase).to.have.been.calledWithExactly({ base: 'prependPath', src: 'globs' });
        })

        it('should call utils.appendBase with epty base', function () {
            var config = { get: sinon.stub().returns('') };
            var noop = function () { };
            var cripweb = { getPublicMethods: noop };
            var watch = new Watch('gulp', config, cripweb, noop);

            watch.fn('taskName', 'globs', 'outputPath');

            expect(utils.appendBase).to.have.been.calledOnce;
            expect(utils.appendBase).to.have.been.calledWithExactly({ base: '', src: 'globs' });
        })

        it('should throw error if deps is not presented', function () {
            var copy = new Watch('gulp', 'config', 'cripweb', 'noop');

            var delegate = function () {
                copy.fn('taskName', 'globs');
            }

            expect(delegate).to.throw(Error, 'Watch task could not be executed without deps! "deps" argument as Array | String is required.');
        })

        it('should throw error if globs is not presented', function () {
            var copy = new Watch('gulp', 'config', 'cripweb', 'noop');

            var delegate = function () {
                copy.fn('taskName');
            }

            expect(delegate).to.throw(Error, 'Watch task could not be executed without globs! "globs" argument as Array | String is required.');
        })

        it('should throw error if name is not string with length > 3', function () {
            var copy = new Watch('gulp', 'config', 'cripweb', 'noop');

            var delegate = function () {
                copy.fn({}, 'globs');
            }

            expect(delegate).to.throw(Error, 'Watch task could not be executed without name! "name" argument as String with length > 3 is required.');
        })

    })

    it('configure() should call config set method', function () {
        var config = { set: sinon.spy() };
        var watch = new Watch('gulp', config, 'cripweb', 'registerTask');

        watch.configure();

        expect(config.set).to.have.been.calledOnce;
        expect(config.set).to.have.been.calledWithExactly('watch', { base: '', isInDefaults: false });
    })

    it('isInDefault() should return value from config get method', function () {
        var config = { get: sinon.stub() };
        config.get.returns(true);
        var watch = new Watch('gulp', config, 'cripweb', 'registerTask');

        var result = watch.isInDefault();

        expect(config.get).to.have.been.calledOnce;
        expect(config.get).to.have.been.calledWithExactly('watch.isInDefaults');
        expect(result).to.be.equal(true);
    });

})