var chai = require('chai');
var expect = chai.expect;
var crip = require('crip-core');
var sinon = require('sinon');
var events = require('events');

chai.use(require('sinon-chai'));

var utils = require('./../../crip/utils');
var Task = require('./../../crip/Task');

describe('Task', function () {

    beforeEach(function () {
        sinon.stub(crip, 'log');
    })

    afterEach(function () {
        crip.log.restore();
    })

    describe('#constructor', function () {

        it('should set public properties of task', function () {
            var deps = ['deps1', 'deps2'];
            var task = new Task('section', 'name', function () { }, 'glob/string', true, deps);

            expect(task.section).to.equal('section');
            expect(task.name).to.equal('name');
            expect(task.id).to.equal('section-name');
            expect(task.globs).to.equal('glob/string');
            expect(task._includeInDefault).to.equal(true);
            expect(task.deps).to.equal(deps);
        });

        it('should set _includeInDefault as false if is not presented', function () {
            var task = new Task('section', 'name', function () { }, 'glob/string');

            expect(task._includeInDefault).to.equal(false);
        });

        it('should set deps as array if parameter is string', function () {
            var task = new Task('section', 'name', function () { }, 'glob/string', 0, 'deps');

            expect(task._includeInDefault).to.equal(false);
            expect(task.deps.length).to.equal(1);
            expect(task.deps[0]).to.equal('deps');
        })

        it('should not set deps if it is boolean', function () {
            var task = new Task('section', 'name', function () { }, 'glob/string', 0, false);

            expect(task.deps).to.equal(undefined);
        })
    })

    describe('#run', function () {
        it('should execute fn method', function () {
            var fn = function () { return { on: function () { } } };
            var task = new Task('section', 'name', fn, 'glob/string');
            var spy = sinon.spy(task, '_fn');

            task.run({});

            expect(spy).to.have.been.calledOnce;
            expect(crip.log).to.have.been.calledOnce;
        })

        it('should add id to stack', function () {
            var stack = {};
            var fn = function () { return { on: function () { } } };
            var task = new Task('section', 'name', fn, 'glob/string');

            task.run(stack);

            expect(crip.log).to.be.called;
            expect(stack).to.have.property('section-name', 1)
        })

        it('should decrease stack propery value on fn finish emit', function () {
            function GulpFake() { }
            GulpFake.prototype.__proto__ = events.EventEmitter.prototype;

            var gulpFake = new GulpFake();
            var stack = {};
            var fn = function () { return gulpFake; };
            var task = new Task('section', 'name', fn, 'glob/string');

            task.run(stack);
            gulpFake.emit('finish');

            expect(crip.log).to.have.been.calledTwice;
            expect(stack).to.have.property('section-name', 0);
        })

        it('should be executed only once if finish event is not fired', function () {
            var stack = {};
            var fn = function () { return { on: function () { } } };
            var task = new Task('section', 'name', fn, 'glob/string');
            var spy = sinon.spy(task, '_fn');

            task.run(stack);
            task.run(stack);

            expect(spy).to.have.been.calledOnce;
            expect(crip.log).to.have.been.calledOnce;
            expect(stack).to.have.property('section-name', 1)
        })

        it('should fire finish event with task id on gulp finish event', function () {
            function GulpFake() { }
            GulpFake.prototype.__proto__ = events.EventEmitter.prototype;

            var gulpFake = new GulpFake();
            var stack = {};
            var fn = function () { return gulpFake; };
            var spy = sinon.spy();
            var task = new Task('section', 'name', fn, 'glob/string');

            task.on('finish', spy);

            task.run(stack);
            gulpFake.emit('finish');

            expect(spy).to.have.been.calledWithExactly('section-name');
        })
    })

    describe('#isInDefaults', function () {

        it('should return false if not presented in constructor', function () {
            var task = new Task('section', 'name', function () { }, 'glob/string');

            expect(task.isInDefaults()).to.not.be.ok;
        })

        it('should return true if presented in constructor', function () {
            var task = new Task('section', 'name', function () { }, 'glob/string', true);

            expect(task.isInDefaults()).to.be.ok;
        })

    })

})