var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

chai.use(require('sinon-chai'));

var utils = require('./../../../crip/utils');
var Webpack = require('./../../../crip/tasks/Webpack');


describe('Webpack', function () {

    beforeEach(function () {
        sinon.stub(utils, 'appendBase');
    })

    afterEach(function () {
        utils.appendBase.restore();
    })

    it('costructor() should define default methods', function () {

        var webpack = new Webpack('gulp', 'config', 'cripweb', 'registerTask');

        expect(webpack).to.have.property('fn');
        expect(webpack).to.have.property('configure');
        expect(webpack).to.have.property('isInDefault');
    })

    it('configure() should call config set method', function () {
        var config = { set: sinon.spy() };
        var webpack = new Webpack('gulp', config, 'cripweb', 'registerTask');

        webpack.configure();

        expect(config.set).to.have.been.calledOnce;
        expect(config.set).to.have.been.calledWithExactly('webpack', {
            base: "", config: {}, isInDefaults: true, output: "{assetsDist}"
        });
    })

    it('isInDefault() should return value from config get method', function () {
        var config = { get: sinon.stub() };
        config.get.returns(true);
        var webpack = new Webpack('gulp', config, 'cripweb', 'registerTask');

        var result = webpack.isInDefault();

        expect(config.get).to.have.been.calledOnce;
        expect(config.get).to.have.been.calledWithExactly('webpack.isInDefaults');
        expect(result).to.be.equal(true);
    });

    describe('#fn', function () {

        it('should be a function', function () {
            var webpack = new Webpack('gulp', 'config', 'cripweb', 'registerTask');

            expect(webpack.fn).to.be.a('function');
        })

        it('should get config base and output path', function () {
            var config = { get: sinon.spy() };
            var noop = function () { };
            var cripweb = { getPublicMethods: noop };
            var webpack = new Webpack('gulp', config, cripweb, noop);

            webpack.fn('taskName', 'globs');

            expect(config.get).to.have.been.calledThrice;
            expect(config.get.getCall(0)).to.have.been.calledWithExactly('webpack.base');
            expect(config.get.getCall(1)).to.have.been.calledWithExactly('webpack.output');
            expect(config.get.getCall(2)).to.have.been.calledWithExactly('webpack.config');
        })

        it('should return cripweb getPublicMethods', function () {
            var config = { get: sinon.spy() };
            var noop = function () { };
            var cripweb = { getPublicMethods: sinon.stub().returns(123) };
            var webpack = new Webpack('gulp', config, cripweb, noop);

            var result = webpack.fn('taskName', 'globs');

            expect(result).to.be.equal(123);
        })

        it('should call utils.appendBase without webpack configuration', function () {
            var config = { get: sinon.stub().returns({}) };
            var noop = function () { };
            var cripweb = { getPublicMethods: noop };
            var webpack = new Webpack('gulp', config, cripweb, noop);

            webpack.fn('taskName', 'globs', 'outputPath', 'prependPath');

            expect(utils.appendBase).to.have.been.calledOnce;
            expect(utils.appendBase).to.have.been.calledWithExactly({
                base: 'prependPath', config: {}, output: 'outputPath', src: 'globs'
            });
        })

        it('should call utils.appendBase with epty base', function () {
            var config = { get: sinon.stub().returns('') };
            var noop = function () { };
            var cripweb = { getPublicMethods: noop };
            var webpack = new Webpack('gulp', config, cripweb, noop);

            webpack.fn('taskName', 'globs', 'outputPath');

            expect(utils.appendBase).to.have.been.calledOnce;
            expect(utils.appendBase).to.have.been.calledWithExactly({
                base: '', output: 'outputPath', src: 'globs', config: ''
            });
        })

        it('should call utils.appendBase with epty base and output', function () {
            var config = { get: sinon.stub().returns('') };
            var noop = function () { };
            var cripweb = { getPublicMethods: noop };
            var webpack = new Webpack('gulp', config, cripweb, noop);

            webpack.fn('taskName', 'globs');

            expect(utils.appendBase).to.have.been.calledOnce;
            expect(utils.appendBase).to.have.been.calledWithExactly({
                base: '', output: '', src: 'globs', config: ''
            });
        })

        it('should call utils.appendBase with passed config', function () {
            var config = { get: sinon.stub().returns('') };
            var noop = function () { };
            var cripweb = { getPublicMethods: noop };
            var webpack = new Webpack('gulp', config, cripweb, noop);

            webpack.fn('taskName', 'globs', { a: '' });

            expect(utils.appendBase).to.have.been.calledOnce;
            expect(utils.appendBase).to.have.been.calledWithExactly({
                base: '', output: '', src: 'globs', config: { a: '' }
            });
        })

        it('should call utils.appendBase with passed config amd all parameters', function () {
            var config = { get: sinon.stub().returns('') };
            var noop = function () { };
            var cripweb = { getPublicMethods: noop };
            var webpack = new Webpack('gulp', config, cripweb, noop);

            webpack.fn('taskName', 'globs', { a: '' }, 'outputPath', 'prependPath');

            expect(utils.appendBase).to.have.been.calledOnce;
            expect(utils.appendBase).to.have.been.calledWithExactly({
                base: 'prependPath', output: 'outputPath', src: 'globs', config: { a: '' }
            });
        })

        it('should throw error if globs is not presented', function () {
            var webpack = new Webpack('gulp', 'config', 'cripweb', 'noop');

            var delegate = function () {
                webpack.fn('taskName');
            }

            expect(delegate).to.throw(Error, 'Webpack task could not be executed without globs! "globs" argument as Array | String is required.');
        })

        it('should throw error if name is not string with length > 3', function () {
            var webpack = new Webpack('gulp', 'config', 'cripweb', 'noop');

            var delegate = function () {
                webpack.fn({}, 'globs');
            }

            expect(delegate).to.throw(Error, 'Webpack task could not be executed without name! "name" argument as String with length > 3 is required.');
        })

    })

})