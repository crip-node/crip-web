var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var events = require('events');

var utils = require('./../../crip/utils');
var crip = require('./../../crip/crip');
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
            var task = new Task('section', 'name', function () { }, 'glob/string');

            expect(task.section).to.equal('section');
            expect(task.name).to.equal('name');
            expect(task.id).to.equal('section-name');
            expect(task.globs).to.equal('glob/string');
        })

    })

    describe('#run', function () {
        it('should execute fn method', function () {
            var fn = function () { return { on: function () { } } };
            var task = new Task('section', 'name', fn, 'glob/string');
            var spy = sinon.spy(task, '_fn');

            task.run({});

            expect(spy.calledOnce).to.be.ok;
            expect(crip.log).to.be.called;
        })

        it('should add id to stack', function () {
            var stack = {};
            var fn = function () { return { on: function () { } } };
            var task = new Task('section', 'name', fn, 'glob/string');

            task.run(stack);

            expect(crip.log).to.be.called;
            expect(stack).to.have.property('section-name', 1)
        })

        it('should decrease stack propery value on fn finish emit', function (done) {

            function GulpFake() { }
            GulpFake.prototype.__proto__ = events.EventEmitter.prototype;

            var gulpFake = new GulpFake();
            var stack = {};
            var fn = function () { return gulpFake; };
            var task = new Task('section', 'name', fn, 'glob/string');

            task.run(stack);
            gulpFake.emit('finish');

            expect(crip.log.calledTwice).to.be.ok;
            expect(stack).to.have.property('section-name', 0);

            done();
        })

        it('should be executed only once if finish event is not fired', function () {
            var stack = {};
            var fn = function () { return { on: function () { } } };
            var task = new Task('section', 'name', fn, 'glob/string');
            var spy = sinon.spy(task, '_fn');

            task.run(stack);
            task.run(stack);

            expect(spy.calledOnce).to.be.ok;
            expect(crip.log.calledOnce).to.be.ok;
            expect(stack).to.have.property('section-name', 1)
        })
    })

    describe('#isInDefaults', function() {

        it('should return false if not presented in constructor', function (){
            var task = new Task('section', 'name', function () { }, 'glob/string');

            expect(task.isInDefaults()).to.not.be.ok;
        })

        it('should return true if presented in constructor', function (){
            var task = new Task('section', 'name', function () { }, 'glob/string', true);
            
            expect(task.isInDefaults()).to.be.ok;
        })

    })

})