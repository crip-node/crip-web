var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

chai.use(require('sinon-chai'));

var utils = require('./../../../crip/utils');
var Copy = require('./../../../crip/tasks/Copy');


describe('Copy', function () {

    beforeEach(function () {
        sinon.stub(utils, 'appendBase');
    })

    afterEach(function () {
        utils.appendBase.restore();
    })

    it('costructor() should define default methods', function () {

        var copy = new Copy('gulp', 'config', 'cripweb', 'registerTask');

        expect(copy).to.have.property('fn');
        expect(copy).to.have.property('configure');
        expect(copy).to.have.property('isInDefault');
    })

    describe('#fn', function () {

        it('should be a function', function () {
            var copy = new Copy('gulp', 'config', 'cripweb', 'registerTask');

            expect(copy.fn).to.be.a('function');
        })

        it('should get config base and output path', function () {
            var config = { get: sinon.spy() };
            var noop = function () { };
            var cripweb = { getPublicMethods: noop };
            var copy = new Copy('gulp', config, cripweb, noop);

            copy.fn('taskName', 'globs');

            expect(config.get).to.have.been.calledTwice;
            expect(config.get.getCall(0)).to.have.been.calledWithExactly('copy.base');
            expect(config.get.getCall(1)).to.have.been.calledWithExactly('copy.output');
        })

        it('should return cripweb getPublicMethods', function () {
            var config = { get: sinon.spy() };
            var noop = function () { };
            var cripweb = { getPublicMethods: sinon.stub().returns(123) };
            var copy = new Copy('gulp', config, cripweb, noop);

            var result = copy.fn('taskName', 'globs');

            expect(result).to.be.equal(123);
        })

        it('should call utils.appendBase in default order', function () {
            var config = { get: sinon.spy() };
            var noop = function () { };
            var cripweb = { getPublicMethods: noop };
            var copy = new Copy('gulp', config, cripweb, noop);

            copy.fn('taskName', 'globs', 'outputPath', 'prependPath');

            expect(utils.appendBase).to.have.been.calledOnce;
            expect(utils.appendBase).to.have.been.calledWithExactly({ base: 'prependPath', output: 'outputPath', src: 'globs' });
        })

        it('should call utils.appendBase with epty base', function () {
            var config = { get: sinon.stub().returns('') };
            var noop = function () { };
            var cripweb = { getPublicMethods: noop };
            var copy = new Copy('gulp', config, cripweb, noop);

            copy.fn('taskName', 'globs', 'outputPath');

            expect(utils.appendBase).to.have.been.calledOnce;
            expect(utils.appendBase).to.have.been.calledWithExactly({ base: '', output: 'outputPath', src: 'globs' });
        })

        it('should call utils.appendBase with epty base and output', function () {
            var config = { get: sinon.stub().returns('') };
            var noop = function () { };
            var cripweb = { getPublicMethods: noop };
            var copy = new Copy('gulp', config, cripweb, noop);

            copy.fn('taskName', 'globs');

            expect(utils.appendBase).to.have.been.calledOnce;
            expect(utils.appendBase).to.have.been.calledWithExactly({ base: '', output: '', src: 'globs' });
        })

        it('should throw error if globs is not presented', function () {
            var copy = new Copy('gulp', 'config', 'cripweb', 'noop');

            var delegate = function () {
                copy.fn('taskName');
            }

            expect(delegate).to.throw(Error, 'Copy task could not be executed without globs! "globs" argument as Array | String is required.');
        })

        it('should throw error if name is not string with length > 3', function () {
            var copy = new Copy('gulp', 'config', 'cripweb', 'noop');

            var delegate = function () {
                copy.fn({}, 'globs');
            }

            expect(delegate).to.throw(Error, 'Copy task could not be executed without name! "name" argument as String with length > 3 is required.');
        })

    })

    it('configure() should call config set method', function () {
        var config = { set: sinon.spy() };
        var copy = new Copy('gulp', config, 'cripweb', 'registerTask');

        copy.configure();

        expect(config.set).to.have.been.calledOnce;
        expect(config.set).to.have.been.calledWithExactly('copy', { base: "", isInDefaults: true, output: "{assetsDist}" });
    })

    it('isInDefault() should return value from config get method', function () {
        var config = { get: sinon.stub() };
        config.get.returns(true);
        var copy = new Copy('gulp', config, 'cripweb', 'registerTask');

        var result = copy.isInDefault();

        expect(config.get).to.have.been.calledOnce;
        expect(config.get).to.have.been.calledWithExactly('copy.isInDefaults');
        expect(result).to.be.equal(true);
    });

})