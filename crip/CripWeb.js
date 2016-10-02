var utils = require('./utils');
var crip = require('./crip');
var watch = require('gulp-watch');

var Methods = require('./Methods');
var Task = require('./Task');
var Config = require('./Config');

var Copy = require('./tasks/Copy');
var Watch = require('./tasks/Watch');


/**
 * Initialise new instance of CripWeb
 * 
 * @param {gulp} gulp
 * @param {*} config
 */
function CripWeb(gulp, config) {
    var self = this;
    this._Task = Task;

    this._gulp = gulp;
    this._tasks = {};
    this._activeTasks = {};
    this._conf = new Config({});
    this._methods = new Methods(this._gulp, this._conf, this.addTask, this);

    defineDefaultMethods();

    // set dev defined configurations only after Methods.configure is executed;
    this._conf.set(config);

    function defineDefaultMethods() {
        self._methods.define('copy', Copy);
        self._methods.define('watch', Watch);
    }
}

/**
 * Get crip registered method wrapper
 * 
 * @returns {Methods} crip public methods
 */
CripWeb.prototype.getPublicMethods = function () {
    return this._methods;
}

/**
 * Define task for method
 * 
 * @param {String} method
 * @param {String} name
 * @param {Function} gulpFn
 * @param {String|Array} globs
 * @param {Boolean?} isDefault
 */
CripWeb.prototype.addTask = function (method, name, gulpFn, globs, isDefault) {
    if (!this._tasks[method])
        this._tasks[method] = {};

    if (!this._methods[method])
        throw new Error(crip.supplant('Could not add task {name} for undefined section "{section}"!', { section: method, name: name }));

    if (this._tasks[method][name])
        throw new Error(crip.supplant(
            'In section {section} already exists task with name "{name}"!',
            { section: method, name: name }));

    var methodIsDefault = this._methods[method].isInDefault();
    var includeInDefault = crip.isDefined(isDefault) ? isDefault : methodIsDefault;
    var task = new this._Task(method, name, gulpFn, globs, includeInDefault);
    this._tasks[method][name] = task;
}

/**
 * Register all defined tasks in gulp object
 */
CripWeb.prototype.defineRegisteredTasksInGulp = function () {
    var self = this;

    crip.forEach(self._tasks, function (sectionValues, sectionKey) {
        // register section task
        self.defineTaskInGulp({ section: sectionKey });

        crip.forEach(sectionValues, function (task) {
            // regiter task for each section item
            self.defineTaskInGulp(task);
        });
    })
}

/**
 * Regiter Task instance in gulp
 * 
 * @param {Task} task
 * @returns
 */
CripWeb.prototype.defineTaskInGulp = function (task) {
    var id = task.id || task.section;
    var methods = this._methods;

    if (utils.contains(this._gulp.tasks, id)) return;

    this._registerGulpTask(id, this.findTasks(task.section, task.name));
}

/**
 * Register gulp task with collection of crip tasks
 * 
 * @param {String} taskId Unique name for gulp task
 * @param {Array|Object} tasks Collection of crip Tasks to be executed under gulp task 
 */
CripWeb.prototype._registerGulpTask = function (taskId, tasks) {
    var self = this;
    var gulp = this._gulp;
    var methods = this._methods;
    var activeTasks = this._activeTasks;
    var counter = { c: Object.keys(tasks).length };
    var emit = function (id) {
        var name = crip.supplant('finish-{id}', { id: id });
        methods.emit(name);
    };

    gulp.task(taskId, function (done) {
        var emitDone = function (id) {
            emit(id);

            if (--counter.c <= 0) {
                done();
                emit(taskId);
            }
        }

        crip.forEach(tasks, function (task) {
            task.run(activeTasks);
            task.on('finish', emitDone);
        });
    });
}

/**
 * Search tasks by section and/or name
 * 
 * @param {String} section Section of tasks to find
 * @param {String?} name Name of task to find (if not presented - all section returned)
 * @returns {Array} Array of tasks matching search parameters
 */
CripWeb.prototype.findTasks = function (section, name) {
    if (!name)
        return this._tasks[section];

    var result = {};
    var key = crip.supplant('{section}-{name}', { section: section, name: name });
    result[key] = this._tasks[section][name];

    return result;
}

/**
 * Define crip default tasks in gulp
 */
CripWeb.prototype.defineDefaultTasksInGulp = function () {
    var self = this;
    var defaultTasks = {};


    this._loopTasks(function (task) {
        if (task.isInDefaults())
            defaultTasks[task.id] = task;
    });

    this._registerGulpTask('default', defaultTasks);

    // TODO: find a way how to avoid this duplicate of '_registerGulpTask' method
    this._gulp.task('watch-glob', function () {
        self._loopTasks(function (task) {
            if (task.globs) {
                watch(task.globs, batch(function () {
                    return task.run(self._activeTasks);
                }));
            }
        })
    });
}

/**
 * Loop all defined tasks in crip
 * 
 * @param {Function} cb Callback as iterator
 */
CripWeb.prototype._loopTasks = function (cb) {
    var self = this;
    crip.forEach(self._tasks, function (section, sectionName) {
        crip.forEach(section, function (task, name) {
            cb(task, name, sectionName);
        });
    });
}

module.exports = CripWeb;