var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

chai.use(require('sinon-chai'));

var utils = require('./../../../crip/utils');
var Scripts = require('./../../../crip/tasks/Scripts');


describe('Scripts', function () {

    beforeEach(function () {
        sinon.stub(utils, 'appendBase');
    })

    afterEach(function () {
        utils.appendBase.restore();
    })

    it('costructor() should define default methods', function () {

        var scripts = new Scripts('gulp', 'config', 'cripweb', 'registerTask');

        expect(scripts).to.have.property('fn');
        expect(scripts).to.have.property('configure');
        expect(scripts).to.have.property('isInDefault');
    })

    it('configure() should call config set method', function () {
        var config = { set: sinon.spy() };
        var scripts = new Scripts('gulp', config, 'cripweb', 'registerTask');

        scripts.configure();

        expect(config.set).to.have.been.calledOnce;
        expect(config.set).to.have.been.calledWithExactly('scripts', {
            base: "{assetsSrc}\\js",
            isInDefaults: true,
            output: "{assetsDist}\\js",
            sourcemaps: { enabled: true, location: undefined, options: {} },
            uglify: { enabled: true, options: {} }
        });
    })

    it('isInDefault() should return value from config get method', function () {
        var config = { get: sinon.stub() };
        config.get.returns(true);
        var scripts = new Scripts('gulp', config, 'cripweb', 'registerTask');

        var result = scripts.isInDefault();

        expect(config.get).to.have.been.calledOnce;
        expect(config.get).to.have.been.calledWithExactly('scripts.isInDefaults');
        expect(result).to.be.equal(true);
    });

    describe('#fn', function () {

        it('should be a function', function () {
            var scripts = new Scripts('gulp', 'config', 'cripweb', 'registerTask');

            expect(scripts.fn).to.be.a('function');
        })

        it('should get config base, output path, uglify and sourcemaps options', function () {
            var config = { get: sinon.spy() };
            var noop = function () { };
            var cripweb = { getPublicMethods: noop };
            var scripts = new Scripts('gulp', config, cripweb, noop);

            scripts.fn('taskName', 'globs');

            expect(config.get.getCall(0)).to.have.been.calledWithExactly('scripts.base');
            expect(config.get.getCall(1)).to.have.been.calledWithExactly('scripts.output');
            expect(config.get.getCall(2)).to.have.been.calledWithExactly('scripts.uglify');
            expect(config.get.getCall(3)).to.have.been.calledWithExactly('scripts.sourcemaps');
        })

        it('should return cripweb getPublicMethods', function () {
            var config = { get: sinon.spy() };
            var noop = function () { };
            var cripweb = { getPublicMethods: sinon.stub().returns(123) };
            var scripts = new Scripts('gulp', config, cripweb, noop);

            var result = scripts.fn('taskName', 'globs');

            expect(result).to.be.equal(123);
        })

        it('should call utils.appendBase in default order', function () {
            var config = { get: sinon.stub().returns('') };
            var noop = function () { };
            var cripweb = { getPublicMethods: noop };
            var scripts = new Scripts('gulp', config, cripweb, noop);

            scripts.fn('taskName', 'globs', 'outputPath', 'outputFileName', 'prependPath');

            expect(utils.appendBase).to.have.been.calledOnce;
            expect(utils.appendBase).to.have.been.calledWithExactly({
                base: "prependPath", concat: true, output: "outputPath",
                sourcemaps: '', src: "globs", uglify: '',
                outputFile: { basename: "outputFileName", extname: ".js" },
            });
        })

        it('should call utils.appendBase with epty base', function () {
            var config = { get: sinon.stub().returns('') };
            var noop = function () { };
            var cripweb = { getPublicMethods: noop };
            var scripts = new Scripts('gulp', config, cripweb, noop);

            scripts.fn('taskName', 'globs', 'outputPath', 'outputFileName');

            expect(utils.appendBase).to.have.been.calledOnce;
            expect(utils.appendBase).to.have.been.calledWithExactly({
                base: "", concat: true, output: "outputPath",
                sourcemaps: "", src: "globs", uglify: "",
                outputFile: { basename: "outputFileName", extname: ".js" },
            });
        })

        it('should call utils.appendBase with epty base and output', function () {
            var config = { get: sinon.stub().returns('') };
            var noop = function () { };
            var cripweb = { getPublicMethods: noop };
            var scripts = new Scripts('gulp', config, cripweb, noop);

            scripts.fn('taskName', 'globs', 'fileName');

            expect(utils.appendBase).to.have.been.calledOnce;
            expect(utils.appendBase).to.have.been.calledWithExactly({
                base: "", concat: true, output: "", sourcemaps: "",
                src: "globs", uglify: "",
                outputFile: { basename: "fileName", extname: ".js" },
            });
        })

        it('should call utils.appendBase with concat: false if file name is as boolean false', function () {
            var conf = { get: sinon.stub().returns('') };
            var noop = function () { };
            var cripweb = { getPublicMethods: noop };
            var scripts = new Scripts('gulp', conf, cripweb, noop);

            scripts.fn('taskName', 'globs', 'outputPath', false, 'prependPath');

            expect(utils.appendBase).to.have.been.calledOnce;
            expect(utils.appendBase).to.have.been.calledWithExactly({
                base: "prependPath", concat: false, output: "outputPath",
                sourcemaps: "", src: "globs", uglify: "",
                outputFile: { basename: "taskName", extname: ".js" },
            });
        })

        it('should call utils.appendBase with default src if boolean is third parameter', function () {
            var conf = { get: sinon.stub().returns('def') };
            var noop = function () { };
            var cripweb = { getPublicMethods: noop };
            var scripts = new Scripts('gulp', conf, cripweb, noop);

            scripts.fn('taskName', 'globs', true, 'prependPath');

            expect(utils.appendBase).to.have.been.calledOnce;
            expect(utils.appendBase).to.have.been.calledWithExactly({
                base: "prependPath", concat: true, output: "def",
                sourcemaps: "def", src: "globs", uglify: "def",
                outputFile: { basename: "taskName", extname: ".js" },
            });
        })

        it('should call utils.appendBase with concat false if file name is not presented', function () {
            var config = { get: sinon.stub().returns('x') };
            var noop = function () { };
            var cripweb = { getPublicMethods: noop };
            var scripts = new Scripts('gulp', config, cripweb, noop);

            scripts.fn('taskName', 'globs');

            expect(utils.appendBase).to.have.been.calledOnce;
            expect(utils.appendBase).to.have.been.calledWithExactly({
                base: "x", concat: false, output: "x", sourcemaps: "x",
                src: "globs", uglify: "x",
                outputFile: { basename: "taskName", extname: ".js" },
            });
        })

        it('should throw error if globs is not presented', function () {
            var scripts = new Scripts('gulp', 'config', 'cripweb', 'noop');

            var delegate = function () {
                scripts.fn('taskName');
            }

            expect(delegate).to.throw(Error, 'Scripts task could not be executed without globs! "globs" argument as Array | String is required.');
        })

        it('should throw error if name is not string with length > 3', function () {
            var scripts = new Scripts('gulp', 'config', 'cripweb', 'noop');

            var delegate = function () {
                scripts.fn({}, 'globs');
            }

            expect(delegate).to.throw(Error, 'Scripts task could not be executed without name! "name" argument as String with length > 3 is required.');
        })

    })

})