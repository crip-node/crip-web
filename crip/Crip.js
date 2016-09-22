var Utils = require('./Utils');
var CripMethods = require('./CripMethods');
var Copy = require('./tasks/Copy');
var Task = require('./Task');
var watch = require('gulp-watch');

function Crip(gulp, config) {
    this._gulp = gulp;
    this._tasks = {};
    this._conf = config;
    this._methods = new CripMethods(config);

    this.defineDefaultMethods();
}

Crip.prototype.getPublicMethods = function () {
    return this._methods;
}

Crip.prototype.addTask = function (method, name, gulpFn, globs) {
    if (!this._tasks[method])
        this._tasks[method] = {};

    if (this._tasks[method][name])
        throw new Error(Utils.supplant(
            'In section {section} already exists task with name {name}',
            { section: method, name: name }));

    this._tasks[method][name] = new Task(method, name, gulpFn, globs);
}

Crip.prototype.defineDefaultMethods = function () {
    this._methods.define('copy', new Copy(this._gulp, this._conf, this, this.addTask));
}

Crip.prototype.defineRegisteredTasksInGulp = function () {
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
Crip.prototype.defineTaskInGulp = function (task) {
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

Crip.prototype.findTasks = function (section, name) {
    if (!name)
        return this._tasks[section];

    return [this._tasks[section][name]];
}

Crip.prototype.defineDefaultTasksInGulp = function () {
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

Crip.prototype._loopTasks = function (cb) {
    var self = this;
    Utils.forEach(self._tasks, function (section, sectionName) {
        Utils.forEach(section, function (task, name) {
            cb(task, name, sectionName);
        });
    });
}

module.exports = Crip;