var extend = require('extend'),
    Utils = require('./crip/Utils');

function Crip(gulp, config) {
    var scope = this;

    scope.gulp = gulp;
    scope.Task = require('./crip/Task')(scope);
    scope.Config = require('./crip/Config')(scope, config);
    scope.extend = _extend;
    scope.activeTasks = {};
    scope.tasks = {};
    scope.core = {
        config: scope.Config
    };

    // initialise all tasks
    require('./crip/tasks/copy.js')(scope, gulp);
    require('./crip/tasks/watch.js')(scope, gulp);
    require('./crip/tasks/sass.js')(scope, gulp);
    require('./crip/tasks/styles.js')(scope, gulp);
    require('./crip/tasks/scripts.js')(scope, gulp);

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
 * Crate gulp-task for each task registered in crip
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

/**
 * Create default tasks for crip
 */
function createGulpDefaultTasks() {
    var self = this;
    this.gulp.task('default', function () {
        self.Task.runAll();
    });

    this.gulp.task('watch', function () {
        self.Task.runAllWatchTasks();
    });

    this.gulp.task('watch-all-globs', function () {
        self.Task.watchAll();
    });
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