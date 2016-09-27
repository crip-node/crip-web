var chai = require('chai');
var sinon = require('sinon');
var fs = require('fs');
var expect = chai.expect;

//chai.use(require('chai-fs'));
chai.use(require('sinon-chai'));

var Task = require('./../crip/Task');
var CripWeb = require('./../crip/CripWeb');

describe('CripWeb', function () {

    it('constructor() should initialise public methods', function () {
        var cripweb = new CripWeb({}, {});

        expect(cripweb).to.have.property('_tasks');
        expect(Object.keys(cripweb._tasks).length).to.equal(0);

        expect(cripweb).to.have.property('_activeTasks');
        expect(Object.keys(cripweb._activeTasks).length).to.equal(0);

        expect(cripweb).to.have.property('_methods');
        expect(Object.keys(cripweb._methods).length).to.equal(3); // only copy 
    })

    it('getPublicMethods() should return methods object', function () {
        var cripweb = new CripWeb({}, {});

        var methods = cripweb.getPublicMethods();
        expect(Object.keys(methods).length).to.equal(3);
        expect(methods).to.have.property('config');
        expect(methods).to.have.property('define');
        expect(methods).to.have.property('copy');
    })

    it('addTask() should define section and add task', function () {
        var cripweb = new CripWeb({}, {});
        cripweb.addTask('method', 'name', function () { }, 'globs');

        expect(cripweb._tasks).to.have.property('method');
        expect(cripweb._tasks.method).to.have.property('name');
        expect(cripweb._tasks.method.name).to.be.an.instanceof(Task);
    })

    it('addTask() should throw Error when task duplicate is added', function () {
        var cripweb = new CripWeb({}, {});
        var noop = function () { };
        cripweb.addTask('method', 'name', noop, 'globs');

        var delegate = function () {
            cripweb.addTask('method', 'name', noop, 'globs');
        }

        expect(delegate).to.throw(Error);
    })

    it('defineRegisteredTasksInGulp() should call _gulp with all defined task id and sections', function () {
        var gulp = { task: sinon.spy() };
        var cripweb = new CripWeb(gulp, {});
        cripweb.addTask('method', 'name', function () { }, 'globs');

        cripweb.defineRegisteredTasksInGulp();

        expect(gulp.task).to.have.been.calledTwice;
        expect(gulp.task.getCall(0).args[0]).to.be.equal('method');
        expect(gulp.task.getCall(1).args[0]).to.be.equal('method-name');
    })

    it('defineDefaultTasksInGulp() should call _gulp with default and watch', function() {
        var gulp = { task: sinon.spy() };
        var cripweb = new CripWeb(gulp, {});
        
        cripweb.defineDefaultTasksInGulp();

        expect(gulp.task).to.have.been.calledTwice;
        expect(gulp.task.getCall(0).args[0]).to.be.equal('default');
        expect(gulp.task.getCall(1).args[0]).to.be.equal('watch');
    })

})