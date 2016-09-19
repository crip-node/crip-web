var Utils = require('./Utils'),
    watch = require('gulp-watch'),
    batch = require('gulp-batch'),
    colors = require('colors');

/**
 * Placeholder for incomming crip variable
 */
var Crip;

/**
 * Crip Task class instance
 * 
 * @class
 * @param {String} section
 * @param {String} name
 * @param {?Function} fn
 * @param {?Array} globs
 */
var Task = function (section, name, fn, globs) {
    var self = this;

    self.globs = false;
    self.section = section;
    self.name = name;
    self.id = Utils.supplant("{section}-{name}", this);

    self.isWatchTask = isWatchTask;
    self.run = run;

    if (globs)
        self.globs = globs;

    if (fn)
        describe(fn);

    /**
     * Register task in Crip.tasks Array
     */
    function register() {
        var section = self.section,
            name = self.name;

        if (!Crip.tasks[section])
            Crip.tasks[section] = [];

        if (Crip.tasks[section][name])
            throw new Error(Utils.supplant("Multiple tasks with same name has been registered. Section: {section}; Name: {name}"
                , { section: section, name: name }));

        Crip.tasks[section][name] = self;

        Crip.activeTasks[self.id] = 0;
    }

    /**
     * Describe task and register it
     *
     * @param {function} fn
     * @returns {Task}
     */
    function describe(fn) {
        self.fn = fn;

        register();

        return self;
    }

    /**
     * Exec task definition
     *
     * @returns {*}
     */
    function run() {
        // run only if it is not started yet
        if (Crip.activeTasks[self.id] && Crip.activeTasks[self.id] === 0) {
            Crip.activeTasks[self.id]++;

            log('CRIP start', self.id, ' ...');
            var curr = new Date();
            return self.fn()
                .on('finish', function () {
                    log('CRIP done ',
                        self.id,
                        ' after ' + ((new Date() - curr) + ' ms').magenta);
                    Crip.activeTasks[self.id]--;
                });
        }
    }

    /**
     * Determines is the task from 'watch' section.
     * 
     * @returns {Boolean}
     */
    function isWatchTask() {
        return self.section === 'watch';
    }
};

// Registering globally available Task methods
Task.find = find;
Task.runAll = runAll;
Task.watchAll = watchAll;

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
 * Run all registered tasks. (except watch section)
 */
function runAll() {
    _loopAllTasks(function (task) {
        if (!task.isWatchTask())
            task.run();
    });
}

/**
 * Run all registered watch tasks
 */
function runAllWatchTasks() {
    _loopAllTasks(function (task) {
        // run tasks registered in watch
        if (task.section === 'watch' && task.name !== 'watch')
            task.run();
    });
}

/**
 * Watch all registered globs and run task on change
 */
function watchAll() {
    _loopAllTasks(function (task) {
        if (task.globs) {
            watch(task.globs, batch(function () {
                return task.run();
            }));
        }
    });
}

/**
 * Log custom event to console if configuration allows
 * 
 * @param {String} type
 * @param {String} event
 * @param {?String} post
 */
function log(type, event, post) {
    if (Crip.Config.get('log'))
        console.log(timestamp() + (' ' + type + ' ').magenta + ('\'' + event + '\'').cyan + (post ? post : '').magenta);

    /**
     * Get Current tymestamp formatted String
     * 
     * @returns {String}
     */
    function timestamp() {
        return ('[' + ((new Date).toTimeString()).substr(0, 8) + ']').grey;
    }
}

/**
 * Loop all task registered in Crip.tasks Array
 * 
 * @param {any} cb - The callback to handle task
 */
function _loopAllTasks(cb) {
    Utils.forEach(Crip.tasks, function (section, sectionName) {
        Utils.forEach(section, function (task, name) {
            cb(task, name, sectionName);
        });
    });
}

/**
 * Export module
 * 
 * @param {Crip} crip
 * @returns {Task}
 */
module.exports = function (crip) {
    // Make Crip available throughout this file.
    Crip = crip;

    return Task;
};