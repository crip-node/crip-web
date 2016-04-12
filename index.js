var fs = require('fs'),
    extend = require('extend'),
    watch = require('gulp-watch'),
    Utils = require('./crip/Utils');

function Crip(gulp, config) {
    var scope = this,
        defaults = false;

    if (config && typeof config === 'string')
        defaults = readConfig(config);

    this.gulp = gulp;
    this.Task = require('./crip/Task')(scope);
    this.Config = require('./crip/Config')((defaults || config));
    this.extend = _extend;
    this.activeTasks = {};
    this.tasks = {};
    this.core = {};


    // initialise all tasks
    require('./crip/tasks/copy.js')(scope, gulp);
    require('./crip/tasks/watch.js')(scope, gulp);
    require('./crip/tasks/sass.js')(scope, gulp);
    require('./crip/tasks/styles.js')(scope, gulp);

    return function (exec) {
        exec(scope.core);

        // create all user used tasks
        createGulpTasks.apply(scope);

        // create default task for gulp
        createGulpDefaultTasks.apply(scope);
    }
}

/**
 * Create gulp tasks for groups
 */
var createGulpTasks = function () {
    var self = this;
    Utils.forEach(self.tasks, function (section, sectionName) {
        // register section task
        createGulpTask(self, {section: sectionName, id: sectionName, name: false});
        Utils.forEach(section, function (task) {
            // regiter task for each section item
            createGulpTask(self, task);
        });
    });
};

/**
 * Crate task for each task
 *
 * @param {Crip} Crip
 * @param {gulp} Crip.gulp
 * @param {Task} Crip.Task
 *
 * @param {Task} task
 * @param {String} task.section
 * @param {String|Boolean|null} task.name
 * @param {String} task.id
 */
function createGulpTask(Crip, task) {
    if (Utils.contains(Crip.gulp.tasks, task.id)) return;

    Crip.gulp.task(task.id, function () {
        var tasksToRun = Crip.Task.find(task.section, task.name);
        Utils.forEach(tasksToRun, function (taskInstance) {
            taskInstance.run();
        });
    });
}

function createGulpDefaultTasks() {
    var self = this;
    this.gulp.task('default', function () {
        'use strict';
        self.Task.runAll();
        self.gulp.start('watch');
    });

    this.gulp.task('watch', function () {
        self.Task.watchAll();
    });
}

/**
 * Extend config from file
 *
 * @param {String} file Config file location
 */
function readConfig(file) {
    if (fs.existsSync(file)) {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
}

/**
 * Add method for Crip.core
 *
 * @param name
 * @param callback
 * @private
 */
function _extend(name, callback) {
    var scope = this;
    scope.core[name] = function () {
        callback.apply(scope, arguments);

        return scope.core;
    };
}

module.exports = function (gulp, config) {
    return new Crip(gulp, config);
};