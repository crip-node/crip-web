var Utils = require('./Utils'),
    watch = require('gulp-watch'),
    batch = require('gulp-batch'),
    colors = require('colors');

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
    var self = this;
    if (Crip.activeTasks[self.id] === 0) {
        Crip.activeTasks[self.id]++;
        log('CRIP start', self.id);
        self.fn()
            .on('end', function () {
                log('CRIP done ', self.id);
                Crip.activeTasks[self.id]--;
            });
    }
}

function log(type, event) {
    if (Crip.Config.get('log'))
        console.log(timestamp() + (' ' + type + ' ').magenta + '\'' + event.cyan + '\'');
}

function timestamp() {
    return '[' + ((new Date).toTimeString()).substr(0, 8).grey + ']';
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
            watch(task.globs, batch(function (events, cb) {
                Crip.gulp.start(task.id, cb);
            }));
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