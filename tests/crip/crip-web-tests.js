var chai = require('chai');
var sinon = require('sinon');
var fs = require('fs');
var expect = chai.expect;

chai.use(require('sinon-chai'));

var Task = require('./../../crip/Task');
var CripWeb = require('./../../crip/CripWeb');

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

    describe('#addTask', function () {

        it('should define section and add task as default', function () {
            var cripweb = new CripWeb({}, {});
            cripweb._Task = sinon.stub();

            cripweb.addTask('copy', 'name', 'function', 'globs');

            expect(cripweb._tasks).to.have.property('copy');
            expect(cripweb._tasks.copy).to.have.property('name');
            expect(cripweb._Task).to.have.been.calledOnce;
            expect(cripweb._Task).to.have.been.calledWithExactly('copy', 'name', 'function', 'globs', true);
        })

        it('should add copy task as excluded from gulp default', function () {
            var cripweb = new CripWeb({}, { copy: { isInDefaults: false } });
            cripweb._Task = sinon.stub();
            
            cripweb.addTask('copy', 'name', 'function', 'globs');

            expect(cripweb._Task).to.have.been.calledWithExactly('copy', 'name', 'function', 'globs', false);
        })

        it('should throw Error when task duplicate is added', function () {
            var cripweb = new CripWeb({}, {});
            var noop = function () { };
            cripweb.addTask('copy', 'name', noop, 'globs');

            var delegate = function () {
                cripweb.addTask('copy', 'name', noop, 'globs');
            }

            expect(delegate).to.throw(Error, 'In section copy already exists task with name "name"!');
        })

        it('should throw Error when adding task for unregistered method', function () {
            var cripweb = new CripWeb({}, {});
            var delegate = function () {
                cripweb.addTask('undefined', 'name', 'noop', 'globs');
            }

            expect(delegate).to.throw(Error, 'Could not add task name for undefined section "undefined"!');
        })

    })

    it('defineRegisteredTasksInGulp() should call _gulp with all defined task id and sections', function () {
        var gulp = { task: sinon.spy() };
        var cripweb = new CripWeb(gulp, {});
        cripweb.addTask('copy', 'name', function () { }, 'globs');

        cripweb.defineRegisteredTasksInGulp();

        expect(gulp.task).to.have.been.calledTwice;
        expect(gulp.task.getCall(0).args[0]).to.be.equal('copy');
        expect(gulp.task.getCall(1).args[0]).to.be.equal('copy-name');
    })

    it('defineDefaultTasksInGulp() should call _gulp with default and watch', function () {
        var gulp = { task: sinon.spy() };
        var cripweb = new CripWeb(gulp, {});

        cripweb.defineDefaultTasksInGulp();

        expect(gulp.task).to.have.been.calledTwice;
        expect(gulp.task.getCall(0).args[0]).to.be.equal('default');
        expect(gulp.task.getCall(1).args[0]).to.be.equal('watch');
    })

})