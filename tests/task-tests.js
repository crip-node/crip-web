var chai = require('chai');
var expect = chai.expect;
var sinonChai = require('sinon-chai');
var sinon = require('sinon');
var events = require('events');

var Utils = require('./../crip/Utils');
var Task = require('./../crip/Task');

chai.use(sinonChai);

describe('Task', function () {

    beforeEach(function () {
        sinon.stub(Utils, 'log');
    })

    afterEach(function () {
        Utils.log.restore();
    })

    it('constructor() should set public properties of task', function () {
        var task = new Task('section', 'name', function () { }, 'glob/string');

        expect(task.section).to.equal('section');
        expect(task.name).to.equal('name');
        expect(task.id).to.equal('section-name');
        expect(task.globs).to.equal('glob/string');
    })

    it('run() should execute fn method', function () {
        var fn = function () { return { on: function () { } } };
        var task = new Task('section', 'name', fn, 'glob/string');
        var spy = sinon.spy(task, '_fn');

        task.run({});

        expect(spy.calledOnce).to.be.ok;
        expect(Utils.log).to.be.called;
    })

    it('run() should add id to stack', function () {
        var stack = {};
        var fn = function () { return { on: function () { } } };
        var task = new Task('section', 'name', fn, 'glob/string');

        task.run(stack);

        expect(Utils.log).to.be.called;
        expect(stack).to.have.property('section-name', 1)
    })

    it('run() should decrease stack propery value on fn finish emit', function (done) {

        function GulpFake() { }
        GulpFake.prototype.__proto__ = events.EventEmitter.prototype;

        var gulpFake = new GulpFake();
        var stack = {};
        var fn = function () { return gulpFake; };
        var task = new Task('section', 'name', fn, 'glob/string');

        task.run(stack);
        gulpFake.emit('finish');

        expect(Utils.log.calledTwice).to.be.ok;
        expect(stack).to.have.property('section-name', 0);

        done();
    })

    it('run() should be executed only once if finish event is not fired', function () {
        var stack = {};
        var fn = function () { return { on: function () { } } };
        var task = new Task('section', 'name', fn, 'glob/string');
        var spy = sinon.spy(task, '_fn');

        task.run(stack);
        task.run(stack);

        expect(spy.calledOnce).to.be.ok;
        expect(Utils.log.calledOnce).to.be.ok;
        expect(stack).to.have.property('section-name', 1)
    })

})