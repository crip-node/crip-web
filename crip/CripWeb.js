var crip = require('crip-core');
var watch = require('gulp-watch');
var batch = require('gulp-batch');

var Methods = require('./Methods');
var Task = require('./Task');
var Config = require('./Config');

var Copy = require('./tasks/Copy');
var Watch = require('./tasks/Watch');
var Scripts = require('./tasks/Scripts');


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
    this._beforeDefault = new Array();
    this._methods = new Methods(this._gulp, this._conf, this.addTask, this);

    defineDefaultMethods();

    // set dev defined configurations only after Methods.configure is executed;
    this._conf.set(config);

    function defineDefaultMethods() {
        self._methods.define('copy', Copy);
        self._methods.define('watch', Watch);
        self._methods.define('scripts', Scripts);
    }
}

/**
 * Get crip registered method wrapper
 * 
 * @returns {Methods} crip public methods
 */
CripWeb.prototype.getPublicMethods = function () {
    return this._methods;
};

/**
 * Emits correct name of task compliteion
 * 
 * @param {String} taskId
 */
CripWeb.prototype.emitComplete = function (taskId) {
    var name = crip.supplant('finish-{id}', { id: taskId });

    this._methods.emit(name);

    return name;
};

/**
 * Define task for method
 * 
 * @param {String} method
 * @param {String} name
 * @param {Function} gulpFn
 * @param {String|Array} globs
 * @param {Boolean?} isDefault
 */
CripWeb.prototype.addTask = function (method, name, gulpFn, globs, isDefault, deps) {
    if (!this._tasks[method])
        this._tasks[method] = {};

    if (!this._methods[method])
        throw new Error(crip.supplant('Could not add task {name} for undefined section "{section}"!', { section: method, name: name }));

    if (this._tasks[method][name])
        throw new Error(crip.supplant(
            'In section {section} already exists task with name "{name}"!',
            { section: method, name: name }));

    var includeInDefault = this.resolveDefault(method, isDefault);
    var task = new this._Task(method, name, gulpFn, globs, includeInDefault, deps);
    this._tasks[method][name] = task;
};

/**
 * Determines is task in defaults by configuration or definition 
 * 
 * @param {String} method
 * @param {Boolean?} isDefault
 * @returns {Boolean}
 */
CripWeb.prototype.resolveDefault = function (method, isDefault) {
    var methodIsDefault = this._methods[method].isInDefault();

    return crip.isDefined(isDefault) ? isDefault : methodIsDefault;
};

/**
 * Register all defined tasks in gulp object
 */
CripWeb.prototype.defineRegisteredTasksInGulp = function () {
    var self = this;

    crip.forEach(self._tasks, function (sectionValues, sectionKey) {
        self.defineSection(sectionKey);
        self.defineTasksInGulp(sectionValues);
    });
};

/**
 * Define gulp section task to complete all task in it
 * 
 * @param {any} name
 */
CripWeb.prototype.defineSection = function (name) {
    var self = this;
    var sectionTasks = this.findTasks(name);
    var beforeDeps = new Array();

    crip.forEach(sectionTasks, function (task) {
        beforeDeps.push(task.id);
    });

    this._gulp.task(name, beforeDeps, function (done) {
        self.emitComplete(name);
        done();
    });
};

/**
 * Regiter Tasks instances in gulp
 * 
 * @param {Task} task
 * @returns
 */
CripWeb.prototype.defineTasksInGulp = function (tasks) {
    var self = this;

    crip.forEach(tasks, function (task) {
        self.definetaskInGulp(task);
    });
};

/**
 * Define single task instance in gulp
 * 
 * @param {any} task
 */
CripWeb.prototype.definetaskInGulp = function (task) {
    var self = this;

    var deps = new Array();

    // If section of this task is WATCH, define deps for it to be executed before 
    // we start watchin this files on changes
    if (task.section === 'watch' && crip.isDefined(task.deps))
        crip.forEach(task.deps, function (dep) {
            if (crip.isString(dep))
                deps.push(dep);
        });

    self._gulp.task(task.id, deps, function (cb) {
        var emiterCounter = 0;
        task.run(self._activeTasks);
        task.on('finish', function () {
            self.emitComplete(task.id);
            if (++emiterCounter === 1)
                cb();
        });
    });
};

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
};

/**
 * Define crip default tasks in gulp
 */
CripWeb.prototype.defineDefaultTasksInGulp = function () {
    var self = this;
    var watchTasks = new Array();

    this._loopTasks(function (task) {
        if (task.isInDefaults())
            self._beforeDefault.push(task.id);

        // if the task is in WATCH section, it may rise infinete wait until inner watch is completed
        // this stops parent wait to execute tasks, so we in else statemenet register DEPS to execute
        // instead of whole watch
        if (task.globs && task.section !== 'watch') {
            watchTasks.push(task.id);
        }
        else if (task.globs && task.section === 'watch' && crip.isDefined(task.deps)) {
            // task DEPS always is an array, fo we safely can loop if it is defined
            crip.forEach(task.deps, function (dep) {
                watchTasks.push(dep);
            });
        }
    });

    this._gulp.task('default', self._beforeDefault, function (done) {
        self.emitComplete('default');
        done();
    });

    this._gulp.task('watch-glob', watchTasks, function () {
        self._loopTasks(function (task) {
            // we have no need to watch watch tasks
            if (task.globs) {
                if (task.section === 'watch')
                    task.run(self._activeTasks);
                else
                    watch(task.globs, batch(function () {
                        return task.run(self._activeTasks);
                    }));
            }
        });
    });
};

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
};

module.exports = CripWeb;