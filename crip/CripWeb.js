var Utils = require('./Utils');
var Methods = require('./Methods');
var Copy = require('./tasks/Copy');
var Task = require('./Task');
var watch = require('gulp-watch');

/**
 * 
 * 
 * @param {any} gulp
 * @param {any} config
 */
function CripWeb(gulp, config) {
    this._gulp = gulp;
    this._tasks = {};
    this._conf = config;
    this._methods = new Methods(config);

    this.defineDefaultMethods();
}

/**
 * 
 * 
 * @returns
 */
CripWeb.prototype.getPublicMethods = function () {
    return this._methods;
}

/**
 * 
 * 
 * @param {any} method
 * @param {any} name
 * @param {any} gulpFn
 * @param {any} globs
 */
CripWeb.prototype.addTask = function (method, name, gulpFn, globs) {
    if (!this._tasks[method])
        this._tasks[method] = {};

    if (this._tasks[method][name])
        throw new Error(Utils.supplant(
            'In section {section} already exists task with name {name}',
            { section: method, name: name }));

    this._tasks[method][name] = new Task(method, name, gulpFn, globs);
}

/**
 * 
 */
CripWeb.prototype.defineDefaultMethods = function () {
    this._methods.define('copy', new Copy(this._gulp, this._conf, this, this.addTask));
}

/**
 * 
 */
CripWeb.prototype.defineRegisteredTasksInGulp = function () {
    var self = this;

    Utils.forEach(self._tasks, function (sectionValues, sectionKey) {
        // register section task
        self.defineTaskInGulp({ section: sectionKey });

        Utils.forEach(sectionValues, function (task) {
            // regiter task for each section item
            self.defineTaskInGulp(self, task);
        });
    })
}

/**
 * 
 * 
 * @param {Task} task
 * @returns
 */
CripWeb.prototype.defineTaskInGulp = function (task) {
    var self = this;
    var id = task.id || task.section;

    if (Utils.contains(this._gulp.tasks, id)) return;

    this._gulp.task(id, function () {
        var tasksToRun = self.findTasks(task.section, task.name);
        Utils.forEach(tasksToRun, function (taskInstance) {
            taskInstance.run();
        });
    });
}

/**
 * 
 * 
 * @param {any} section
 * @param {any} name
 * @returns
 */
CripWeb.prototype.findTasks = function (section, name) {
    if (!name)
        return this._tasks[section];

    return [this._tasks[section][name]];
}

/**
 * 
 */
CripWeb.prototype.defineDefaultTasksInGulp = function () {
    var self = this;

    this._gulp.task('default', function () {
        self._loopTasks(function (task) {
            // move this check to configuration and allow dev to exclude task from default
            if (!task.isWatch())
                task.run();
        })
    });

    this._gulp.task('watch', function () {
        self._loopTasks(function (task) {
            if (task.globs) {
                watch(task.globs, batch(function () {
                    return task.run();
                }));
            }
        })
    });
}

/**
 * 
 * 
 * @param {any} cb
 */
CripWeb.prototype._loopTasks = function (cb) {
    var self = this;
    Utils.forEach(self._tasks, function (section, sectionName) {
        Utils.forEach(section, function (task, name) {
            cb(task, name, sectionName);
        });
    });
}

module.exports = CripWeb;