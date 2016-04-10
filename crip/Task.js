var Utils = require('./Utils'),
    watch = require('gulp-watch');

var Crip;

var Task = function (section, name, fn, globs) {
    this.section = section;
    this.name = name;
    this.id = section + '-' + name;

    if (globs)
        this.globs = globs;

    if (fn)
        this.describe(fn);
};

Task.find = find;
Task.runAll = runAll;
Task.watchAll = watchAll;

Task.prototype = {
    describe: describe,
    register: register,
    run: run
};

/**
 * Find a task by section and its name
 *
 * @param {String} section
 * @param {String} name
 * @returns {Array}
 */
function find(section, name) {
    var taskSection = Crip.tasks[section];
    if (name) {
        return [taskSection[name]];
    }

    return taskSection;
}

/**
 * Describe task and register it
 *
 * @param {function} fn
 * @returns {Task}
 */
function describe(fn) {
    this.fn = fn;

    this.register();

    return this;
}

/**
 * Register task
 */
function register() {
    if (!Crip.tasks[this.section])
        Crip.tasks[this.section] = [];

    Crip.tasks[this.section][this.name] = this;

    Crip.activeTasks[this.id] = 0;
}

/**
 * Exec task definition
 *
 * @returns {*}
 */
function run() {
    if (Crip.activeTasks[this.id] === 0) {
        Crip.activeTasks[this.id]++;
        var result = this.fn();
        Crip.activeTasks[this.id]--;

        return result;
    }

    return false;
}

/**
 * Run all registered tasks
 */
function runAll() {
    _loopAllTasks(function (task) {
        Crip.gulp.start(task.id);
    });
}

/**
 * watch all registered task
 */
function watchAll() {
    _loopAllTasks(function (task) {
        'use strict';
        if (task.globs) {
            watch(task.globs, function () {
                'use strict';
                Crip.gulp.start(task.id);
            });
        }
    });
}

function _loopAllTasks(callback) {
    Utils.forEach(Crip.tasks, function (section, sectionName) {
        Utils.forEach(section, function (task, name) {
            callback(task, name, sectionName);
        });
    });
}

module.exports = function (crip) {
    // Make Crip available throughout this file.
    Crip = crip;

    return Task;
};