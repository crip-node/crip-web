var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

chai.use(require('sinon-chai'));

var utils = require('./../../../crip/utils');
var Watch = require('./../../../crip/tasks/Watch');


describe('Watch', function () {

    beforeEach(function () {
        sinon.stub(utils, 'appendBase');
    });

    afterEach(function () {
        utils.appendBase.restore();
    });

    describe('#constructor', function () {

        it('should define default methods', function () {

            var watch = new Watch('gulp', 'config', 'cripweb', 'registerTask', utils);

            expect(watch).to.have.property('fn');
            expect(watch).to.have.property('configure');
            expect(watch).to.have.property('isInDefault');
        });

    });

    it('configure() should call config set method', function () {
        var config = { set: sinon.spy() };
        var watch = new Watch('gulp', config, 'cripweb', 'registerTask', utils);

        watch.configure();

        expect(config.set).to.have.been.calledOnce;
        expect(config.set).to.have.been.calledWithExactly('watch', { base: '', isInDefaults: false });
    });

    it('isInDefault() should return value from config get method', function () {
        var config = { get: sinon.stub() };
        config.get.returns(true);
        var watch = new Watch('gulp', config, 'cripweb', 'registerTask', utils);

        var result = watch.isInDefault();

        expect(config.get).to.have.been.calledOnce;
        expect(config.get).to.have.been.calledWithExactly('watch.isInDefaults');
        expect(result).to.be.equal(true);
    });

    describe('#fn', function () {

        it('should be a function', function () {
            var watch = new Watch('gulp', 'config', 'cripweb', 'registerTask', utils);

            expect(watch.fn).to.be.a('function');
        });

        it('should get config base path', function () {
            var config = { get: sinon.spy() };
            var noop = function () { };
            var cripweb = { getPublicMethods: noop };
            var watch = new Watch('gulp', config, cripweb, noop, utils);

            watch.fn('taskName', 'globs', 'deps');

            expect(config.get).to.have.been.calledOnce;
            expect(config.get.getCall(0)).to.have.been.calledWithExactly('watch.base');
        });

        it('should return cripweb getPublicMethods', function () {
            var config = { get: sinon.spy() };
            var noop = function () { };
            var cripweb = { getPublicMethods: sinon.stub().returns(123) };
            var watch = new Watch('gulp', config, cripweb, noop, utils);

            var result = watch.fn('taskName', 'globs', 'deps');

            expect(result).to.be.equal(123);
        });

        it('should call utils.appendBase in default order', function () {
            var config = { get: sinon.spy() };
            var noop = function () { };
            var cripweb = { getPublicMethods: noop };
            var watch = new Watch('gulp', config, cripweb, noop, utils);

            watch.fn('taskName', 'globs', 'deps', 'prependPath');

            expect(utils.appendBase).to.have.been.calledOnce;
            expect(utils.appendBase).to.have.been.calledWithExactly({ base: 'prependPath', src: 'globs' });
        });

        it('should call utils.appendBase with epty base', function () {
            var config = { get: sinon.stub().returns('') };
            var noop = function () { };
            var cripweb = { getPublicMethods: noop };
            var watch = new Watch('gulp', config, cripweb, noop, utils);

            watch.fn('taskName', 'globs', 'outputPath');

            expect(utils.appendBase).to.have.been.calledOnce;
            expect(utils.appendBase).to.have.been.calledWithExactly({ base: '', src: 'globs' });
        });

        it('should throw error if deps is not presented', function () {
            var copy = new Watch('gulp', 'config', 'cripweb', 'noop');

            var delegate = function () {
                copy.fn('taskName', 'globs');
            };

            expect(delegate).to.throw(Error, 'Watch task could not be executed without deps! "deps" argument as Array | String is required.');
        });

        it('should throw error if globs is not presented', function () {
            var copy = new Watch('gulp', 'config', 'cripweb', 'noop');

            var delegate = function () {
                copy.fn('taskName');
            };

            expect(delegate).to.throw(Error, 'Watch task could not be executed without globs! "globs" argument as Array | String is required.');
        });

        it('should throw error if name is not string with length > 3', function () {
            var copy = new Watch('gulp', 'config', 'cripweb', 'noop');

            var delegate = function () {
                copy.fn({}, 'globs');
            };

            expect(delegate).to.throw(Error, 'Watch task could not be executed without name! "name" argument as String with length > 3 is required.');
        });

        it('should call registerTask with globs as sixt parameter', function () {
            var config = { get: sinon.stub().returns('') };
            var registerTask = sinon.spy();
            var cripweb = { getPublicMethods: function () { } };
            var watch = new Watch('gulp', config, cripweb, registerTask, utils);

            watch.fn('taskName', 'globs', 'deps');

            expect(registerTask).to.have.been.calledOnce;
            expect(registerTask.getCall(0).args[5]).to.equal('deps');
        });

    });

});